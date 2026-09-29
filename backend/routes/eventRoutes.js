import express from "express";
import upload from "../middleware/upload.js";

import {
  createEvent,
  getEvents,
  getOrganiserEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("admin", "organiser"),
  upload.single("image"),
  createEvent
);

router.get("/", getEvents);

router.get(
  "/organiser/:organiserId",
  protect,
  authorize("admin", "organiser"),
  getOrganiserEvents
);

router.get("/:id", getEventById);

router.put(
  "/:id",
  protect,
  authorize("admin", "organiser"),
  updateEvent
);

router.delete(
  "/:id",
  protect,
  authorize("admin", "organiser"),
  deleteEvent
);

export default router;