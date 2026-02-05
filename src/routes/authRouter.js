import { Router } from "express";
import { sanitizeEmail } from "../validators/authValidators.js";
import { generateToken } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/token", sanitizeEmail, generateToken);

export default authRouter;
