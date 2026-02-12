import { body, param } from "express-validator";
import { validate } from "../lib/utils.js";
import prisma from "../lib/prisma.js";

const channelIdValidator = [
  param("channelId")
    .isInt()
    .withMessage("The Channel ID should be an integer.")
    .toInt(),
];

const messageIdValidator = [
  param("messageId")
    .isInt()
    .withMessage("The Message ID should be an integer.")
    .toInt(),
];

const contentValidator = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("You must enter content for your message."),
];

const replyToIdValidator = [
  body("replyToId")
    .default(null)
    .isInt()
    .withMessage("The Reply To ID should be an integer.")
    .toInt()
    .bail()
    .custom(async (value, { req }) => {
      const { channelId } = req.params;

      const message = await prisma.message.findUnique({
        where: {
          id: value,
        },
      });

      if (!message) {
        throw new Error("The Reply To ID must belong to an existing message.");
      }

      if (message.channelId !== channelId) {
        throw new Error(
          "The message being replied to must belong to the same channel as the current message.",
        );
      }
    })
    .optional({ values: null }),
];

export const validateChannelId = validate(channelIdValidator);

export const validateRequestParams = validate([
  ...channelIdValidator,
  ...messageIdValidator,
]);

export const validateMessageCreation = validate([
  ...channelIdValidator,
  ...contentValidator,
  ...replyToIdValidator,
]);

export const validateMessageUpdate = validate([
  ...channelIdValidator,
  ...messageIdValidator,
  ...contentValidator,
]);
