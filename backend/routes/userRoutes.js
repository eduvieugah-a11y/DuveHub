import express from "express";

import {
  getUsers,
  getUser,
  deleteUser,
  upgradeToPremium,
} from "../controllers/userController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("admin"),
  getUsers
);

router.get(
  "/:id",
  protect,
  getUser
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteUser
);

router.put(
  "/premium/:id",
  protect,
  authorize("admin"),
  upgradeToPremium
);

export default router;