import { Router } from "express";
import { validateUserCreation } from "../validators/userValidators.js";
import { createUser } from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/", validateUserCreation, createUser);

export default userRouter;
