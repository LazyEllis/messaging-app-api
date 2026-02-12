import { validationResult } from "express-validator";
import { ForbiddenError, NotFoundError } from "./errors.js";
import prisma from "./prisma.js";

export const validate = (validators) => [
  validators,
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    next();
  },
];

export const getChannel = async (channelId, userId) => {
  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId,
    },
    include: {
      recipients: true,
    },
  });

  if (!channel) {
    throw new NotFoundError("Channel Not Found");
  }

  if (!channel.recipients.some((recipient) => recipient.id === userId)) {
    throw new ForbiddenError(
      "You do not have permission to access this resource",
    );
  }

  return channel;
};
