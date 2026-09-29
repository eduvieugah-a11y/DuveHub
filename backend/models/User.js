import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["user", "admin", "organiser"],
      default: "user",
    },

    plan: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },

    premiumExpires: {
      type: Date,
      default: null,
    },

    // Password reset OTP
    resetOtpHash: {
      type: String,
      default: null,
    },

    resetOtpExpires: {
      type: Date,
      default: null,
    },

    resetOtpAttempts: {
      type: Number,
      default: 0,
    },

    // Temporary token after OTP verification
    passwordResetTokenHash: {
      type: String,
      default: null,
    },

    passwordResetTokenExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;