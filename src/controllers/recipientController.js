import { ConflictError, ForbiddenError, NotFoundError } from "../lib/errors.js";
import prisma from "../lib/prisma.js";

export const addGroupRecipient = async (req, res) => {
  const { id } = req.user;
  const { channelId, recipientId } = req.params;

  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  if (!channel) {
    throw new NotFoundError("Channel Not Found");
  }

  if (channel.type === "DM") {
    throw new ConflictError("You cannot update the details of a DM Channel");
  }

  if (channel.ownerId !== id) {
    throw new ForbiddenError(
      "You do not have permission to perform this action",
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: recipientId,
    },
  });

  if (!user) {
    throw new NotFoundError("User Not Found");
  }

  const updatedChannel = await prisma.channel.update({
    where: {
      id: channelId,
    },
    data: {
      recipients: {
        connect: {
          id: recipientId,
        },
      },
    },
    include: {
      recipients: {
        omit: {
          email: true,
          password: true,
        },
      },
    },
  });

  const recipient = updatedChannel.recipients.find(
    (recipient) => recipient.id === recipientId,
  );

  res.json(recipient);
};

export const deleteGroupRecipient = async (req, res) => {
  const { id } = req.user;
  const { channelId, recipientId } = req.params;

  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId,
    },
    include: {
      _count: {
        select: {
          recipients: true,
        },
      },
    },
  });

  if (!channel) {
    throw new NotFoundError("Channel Not Found");
  }

  if (channel.type === "DM") {
    throw new ConflictError("You cannot update the details of a DM Channel");
  }

  if (channel.ownerId !== id) {
    throw new ForbiddenError(
      "You do not have permission to perform this action",
    );
  }

  if (channel._count.recipients === 3) {
    throw new ConflictError(
      "You cannot have less than three recipients in a Group Channel",
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: recipientId,
    },
  });

  if (!user) {
    throw new NotFoundError("User Not Found");
  }

  await prisma.channel.update({
    where: {
      id: channelId,
    },
    data: {
      recipients: {
        disconnect: {
          id: recipientId,
        },
      },
    },
  });

  res.status(204).end();
};
