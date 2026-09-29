import OrganiserApplication from "../models/OrganiserApplication.js";
import User from "../models/User.js";

// Submit organiser application
export const applyForOrganiser = async (req, res) => {
  try {
    const {businessName, phone, category, reason, user} = req.body;
    const application = await OrganiserApplication.create({
        businessName,
        phone,
        category,
        reason,
        user,
    });

    res.status(201).json({
      message: "Application submitted successfully.",
      application,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get all organiser applications
export const getApplications = async (req, res) => {
  try {
    const applications = await OrganiserApplication.find();

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Approve organiser
export const approveApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await OrganiserApplication.findById(id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
      });
    }

    // Approve the application
    application.status = "approved";
    await application.save();

    // Make the user an organiser
    await User.findByIdAndUpdate(
      application.user,
      {
        role: "organiser",
      }
    );

    res.status(200).json({
      message: "Application approved successfully.",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Reject organiser
export const rejectApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await OrganiserApplication.findById(id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
      });
    }

    application.status = "rejected";
    await application.save();

    res.status(200).json({
      message: "Application rejected.",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};