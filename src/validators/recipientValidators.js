import { param } from "express-validator";
import { validate } from "../lib/utils.js";

export const validateRequestParams = validate([
  param("channelId")
    .isInt()
    .withMessage("The Channel ID should be an integer.")
    .toInt(),
  param("recipientId")
    .isInt()
    .withMessage("The Recipient ID should be an integer.")
    .toInt()
    .custom((value, { req }) => value !== req.user.id)
    .withMessage("You cannot set yourself as the recipient."),
]);
