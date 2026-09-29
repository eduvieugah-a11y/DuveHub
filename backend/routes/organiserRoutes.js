import express from "express";

import {
  applyForOrganiser,
  getApplications,
  approveApplication,
  rejectApplication,
} from "../controllers/organiserController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/apply",
  protect,
  applyForOrganiser
);

router.get(
  "/",
  protect,
  authorize("admin"),
  getApplications
);

router.put(
  "/approve/:id",
  protect,
  authorize("admin"),
  approveApplication
);

router.put(
  "/reject/:id",
  protect,
  authorize("admin"),
  rejectApplication
);

export default router;