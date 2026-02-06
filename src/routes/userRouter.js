import { Router } from "express";
import { requireAuth } from "../lib/auth.js";
import {
  validatePasswordUpdate,
  validateUserCreation,
  validateUserId,
  validateUserUpdate,
} from "../validators/userValidators.js";
import {
  createUser,
  getCurrentUser,
  getUser,
  listUsers,
  updateCurrentUser,
  updateCurrentUserPassword,
} from "../controllers/userController.js";

const userRouter = Router();

userRouter.get("/", requireAuth, listUsers);

userRouter.post("/", validateUserCreation, createUser);

userRouter.get("/@me", requireAuth, getCurrentUser);

userRouter.get("/:userId", requireAuth, validateUserId, getUser);

userRouter.put("/@me", requireAuth, validateUserUpdate, updateCurrentUser);

userRouter.put(
  "/@me/password",
  requireAuth,
  validatePasswordUpdate,
  updateCurrentUserPassword,
);

export default userRouter;
