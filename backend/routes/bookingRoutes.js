import express from "express";

import {
  createBooking,
  getUserBookings,
  getAllBookings,
  deleteBooking,
  getOrganiserBookings
} from "../controllers/bookingController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  createBooking
);

router.get(
  "/organiser/:organiserId",
  protect,
  authorize("admin", "organiser"),
  getOrganiserBookings
);

router.get(
  "/:userId",
  protect,
  getUserBookings
);

router.get(
  "/",
  protect,
  authorize("admin"),
  getAllBookings
);

router.delete(
  "/:id",
  protect,
  authorize("admin", "organiser"),
  deleteBooking
);

export default router;