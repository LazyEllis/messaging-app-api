import { body } from "express-validator";

export const sanitizeEmail = body("email").trim().toLowerCase();
