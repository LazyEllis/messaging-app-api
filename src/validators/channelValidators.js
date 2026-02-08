import { body, param } from "express-validator";
import { validate } from "../lib/utils.js";
import prisma from "../lib/prisma.js";

const idValidator = [
  param("channelId")
    .isInt()
    .withMessage("The Channel ID should be an integer.")
    .toInt(),
];

const groupValidator = [
  body("name").trim().notEmpty().withMessage("A group must have a name."),
  body("recipients")
    .isArray({ min: 2 })
    .withMessage(
      "A group must have at least two other recipients besides the owner.",
    )
    .custom((recipients) => {
      const recipientIds = recipients.map((recipient) => recipient.id);
      const hasUniqueIds = recipientIds.every(
        (id, index) => recipientIds.indexOf(id) === index,
      );
      return hasUniqueIds;
    })
    .withMessage("A group must not contain duplicate recipients."),
  body("recipients.*.id")
    .isInt()
    .withMessage("The ID of a recipient should be an integer.")
    .toInt()
    .custom((value, { req }) => req.user.id !== value)
    .withMessage("You cannot set yourself as a channel recipient.")
    .bail()
    .custom(async (value) => {
      const user = await prisma.user.findUnique({
        where: {
          id: value,
        },
      });

      if (!user) {
        throw new Error(
          "The ID of the recipient must belong to an existing user.",
        );
      }
    }),
];

export const validateChannelId = validate(idValidator);

export const validateDM = validate([
  body("recipient")
    .isInt()
    .withMessage("The ID of the recipient should be an integer.")
    .toInt()
    .custom((value, { req }) => req.user.id !== value)
    .withMessage("You cannot set yourself as a channel recipient.")
    .bail()
    .custom(async (value) => {
      const user = await prisma.user.findUnique({
        where: {
          id: value,
        },
      });

      if (!user) {
        throw new Error(
          "The ID of the recipient must belong to an existing user.",
        );
      }
    }),
]);

export const validateGroup = validate(groupValidator);

export const validateChannelUpdate = validate([
  ...idValidator,
  ...groupValidator,
]);
