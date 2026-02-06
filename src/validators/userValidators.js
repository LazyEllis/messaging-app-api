import bcrypt from "bcryptjs";
import { body, param } from "express-validator";
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

export const validateUserUpdate = validate([
  body("name").trim().notEmpty().withMessage("You must enter your name."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("You must enter your email.")
    .isEmail()
    .withMessage("Your must enter a valid email.")
    .toLowerCase()
    .bail()
    .custom(async (value, { req }) => {
      const user = await prisma.user.findUnique({
        where: {
          email: value,
          NOT: {
            id: req.user.id,
          },
        },
      });

      if (user) {
        throw new Error("This email is already in use.");
      }
    }),
]);

export const validateUserId = validate([
  param("userId")
    .toInt()
    .isInt()
    .withMessage("The User ID should be an integer."),
]);

export const validatePasswordUpdate = validate([
  body("oldPassword")
    .exists()
    .withMessage("You must enter your old password to continue.")
    .bail()
    .custom(async (value, { req }) => {
      const { id } = req.user;

      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      const match = await bcrypt.compare(value, user.password);

      if (!match) {
        throw new Error("The old password is incorrect.");
      }
    }),
  body("password")
    .isStrongPassword()
    .withMessage(
      "Your password must be at least 8 characters containing at least a lowercase and uppercase letter, a number and a symbol.",
    )
    .custom((value, { req }) => req.body.oldPassword !== value)
    .withMessage("The new password must be different from the old one."),
  body("passwordConfirmation")
    .custom((value, { req }) => req.body.password === value)
    .withMessage("The passwords must match."),
]);
