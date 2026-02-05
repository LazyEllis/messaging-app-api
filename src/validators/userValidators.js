import { body } from "express-validator";
import { validate } from "../lib/utils.js";
import prisma from "../lib/prisma.js";

export const validateUserCreation = validate([
  body("name").trim().notEmpty().withMessage("You must enter your name."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("You must enter your email.")
    .isEmail()
    .withMessage("Your must enter a valid email.")
    .toLowerCase()
    .bail()
    .custom(async (value) => {
      const user = await prisma.user.findUnique({
        where: {
          email: value,
        },
      });

      if (user) {
        throw new Error("This email is already in use.");
      }
    }),
  body("password")
    .isStrongPassword()
    .withMessage(
      "Your password must be at least 8 characters containing at least a lowercase and uppercase letter, a number and a symbol.",
    ),
  body("passwordConfirmation")
    .custom((value, { req }) => req.body.password === value)
    .withMessage("The passwords must match."),
]);
