import express from "express";
import {
  registerUser,
  loginUser,
  updateProfile,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile/:userId", updateProfile);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);
export default router;