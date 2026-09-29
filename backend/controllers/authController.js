import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto"
import sendEmail from "../utils/sendEmail.js"
import jwt from "jsonwebtoken";

// ==========================
// Register User
// ==========================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if all fields are filled
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill in all fields.",
      });
    }

    // Check if email already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message:
        "Account created successfully! Please log in to verify.",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        premiumExpires: user.premiumExpires,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================
// Login User
// ==========================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password.",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful.",

      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        premiumExpires: user.premiumExpires,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================
// Update User Profile
// ==========================
export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required.",
      });
    }

    // Check if another user already has this email
    const emailExists = await User.findOne({
      email,
      _id: { $ne: userId },
    });

    if (emailExists) {
      return res.status(400).json({
        message: "This email is already in use.",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        premiumExpires: user.premiumExpires,
      },
    });

  } catch (error) {
    console.error(
      "Update profile error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// FORGOT PASSWORD - SEND OTP
// ==========================================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email was provided
    if (!email) {
      return res.status(400).json({
        message: "Please enter your email address.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find registered user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    // Do not reveal whether an email exists
    if (!user) {
      return res.status(200).json({
        message:
          "If an account exists with this email, a verification code has been sent.",
      });
    }

    // Generate a random 4-digit OTP
    const otp = crypto.randomInt(1000, 10000).toString();

    // Hash OTP before saving it
    const otpHash = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    // Save OTP and expiration time
    user.resetOtpHash = otpHash;
    user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.resetOtpAttempts = 0;

    // Clear any previous reset token
    user.passwordResetTokenHash = null;
    user.passwordResetTokenExpires = null;

    await user.save();

    // Send OTP to user's email
    await sendEmail(
      user.email,
      "DuvieHub Password Reset Code",
      `
      <div style="font-family:Arial,sans-serif;padding:20px;">
        <h2>DuvieHub Verification Code</h2>

        <p>Hello ${user.name},</p>

        <p>
          Use the verification code below to reset your password:
        </p>

        <h1 style="letter-spacing:8px;">
          ${otp}
        </h1>

        <p>
          This code will expire in 10 minutes.
        </p>

        <p>
          If you did not request a password reset,
          you can ignore this email.
        </p>
      </div>
      `
    );

    res.status(200).json({
      message:
        "A verification code has been sent to your email.",
    });

  } catch (error) {
    console.error("Forgot password error:", error);

    res.status(500).json({
      message: "Unable to send verification code.",
    });
  }
};

// ==========================================
// VERIFY PASSWORD RESET OTP
// ==========================================
export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required.",
      });
    }

    if (!/^\d{4}$/.test(String(otp))) {
      return res.status(400).json({
        message: "OTP must contain 4 digits.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (
      !user ||
      !user.resetOtpHash ||
      !user.resetOtpExpires ||
      user.resetOtpExpires < new Date()
    ) {
      return res.status(400).json({
        message: "Invalid or expired verification code.",
      });
    }

    if ((user.resetOtpAttempts || 0) >= 5) {
      return res.status(429).json({
        message: "Too many incorrect attempts. Request a new code.",
      });
    }

    const otpHash = crypto
      .createHash("sha256")
      .update(String(otp))
      .digest("hex");

    if (otpHash !== user.resetOtpHash) {
      user.resetOtpAttempts =
        (user.resetOtpAttempts || 0) + 1;

      await user.save();

      return res.status(400).json({
        message: "Incorrect verification code.",
      });
    }

    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetTokenHash = resetTokenHash;

    user.passwordResetTokenExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    user.resetOtpHash = null;
    user.resetOtpExpires = null;
    user.resetOtpAttempts = 0;

    await user.save();

    res.status(200).json({
      message: "OTP verified successfully.",
      resetToken,
    });

  } catch (error) {
    console.error("Verify OTP error:", error);

    res.status(500).json({
      message: "Unable to verify OTP.",
    });
  }
};

// ==========================================
// RESET PASSWORD
// ==========================================
export const resetPassword = async (req, res) => {
  try {
    const {
      email,
      resetToken,
      newPassword,
      confirmPassword,
    } = req.body;

    if (
      !email ||
      !resetToken ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      email: normalizedEmail,
      passwordResetTokenHash: resetTokenHash,
      passwordResetTokenExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token.",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    user.passwordResetTokenHash = null;
    user.passwordResetTokenExpires = null;
    user.resetOtpHash = null;
    user.resetOtpExpires = null;
    user.resetOtpAttempts = 0;

    await user.save();

    res.status(200).json({
      message: "Password updated successfully.",
    });

  } catch (error) {
    console.error("Reset password error:", error);

    res.status(500).json({
      message: "Unable to reset password.",
    });
  }
};