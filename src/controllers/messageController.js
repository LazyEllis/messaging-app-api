import { ForbiddenError, NotFoundError } from "../lib/errors.js";
import prisma from "../lib/prisma.js";
import { getChannel } from "../lib/utils.js";

export const listChannelMessages = async (req, res) => {
  const { id } = req.user;
  const { channelId } = req.params;

  await getChannel(channelId, id);

  const messages = await prisma.message.findMany({
    where: {
      channelId,
    },
    omit: {
      channelId: true,
      authorId: true,
      replyToId: true,
    },
    include: {
      author: {
        omit: {
          email: true,
          password: true,
        },
      },
      replyTo: {
        select: {
          id: true,
          content: true,
        },
      },
    },
  });

  res.json(messages);
};

export const getMessage = async (req, res) => {
  const { id } = req.user;
  const { channelId, messageId } = req.params;

  await getChannel(channelId, id);

  const message = await prisma.message.findUnique({
    where: {
      id: messageId,
      channelId,
    },
    omit: {
      channelId: true,
      authorId: true,
      replyToId: true,
    },
    include: {
      author: {
        omit: {
          email: true,
          password: true,
        },
      },
      replyTo: {
        select: {
          id: true,
          content: true,
        },
      },
    },
  });

  if (!message) {
    throw new NotFoundError("Message Not Found");
  }

  res.json(message);
};

export const createMessage = async (req, res) => {
  const { id } = req.user;
  const { channelId } = req.params;
  const { content, replyToId } = req.body;

  await getChannel(channelId, id);

  const message = await prisma.message.create({
    data: {
      content,
      replyToId,
      channelId,
      authorId: id,
    },
    omit: {
      channelId: true,
      authorId: true,
      replyToId: true,
    },
    include: {
      author: {
        omit: {
          email: true,
          password: true,
        },
      },
      replyTo: {
        select: {
          id: true,
          content: true,
        },
      },
    },
  });

  res.status(201).json(message);
};

export const updateMessage = async (req, res) => {
  const { id } = req.user;
  const { channelId, messageId } = req.params;
  const { content } = req.body;

  await getChannel(channelId, id);

  const message = await prisma.message.findUnique({
    where: {
      id: messageId,
      channelId,
    },
  });

  if (!message) {
    throw new NotFoundError("Message Not Found");
  }

  if (message.authorId !== id) {
    throw new ForbiddenError(
      "You do not have permission to perform this action",
    );
  }

  const updatedMessage = await prisma.message.update({
    where: {
      id: messageId,
    },
    data: {
      content,
      updatedAt: new Date(),
    },
    omit: {
      channelId: true,
      authorId: true,
      replyToId: true,
    },
    include: {
      author: {
        omit: {
          email: true,
          password: true,
        },
      },
      replyTo: {
        select: {
          id: true,
          content: true,
        },
      },
    },
  });

  res.json(updatedMessage);
};

export const deleteMessage = async (req, res) => {
  const { id } = req.user;
  const { channelId, messageId } = req.params;

  const channel = await getChannel(channelId, id);

  const message = await prisma.message.findUnique({
    where: {
      id: messageId,
      channelId,
    },
  });

  if (!message) {
    throw new NotFoundError("Message Not Found");
  }

  if (message.authorId !== id && channel.ownerId !== id) {
    throw new ForbiddenError(
      "You do not have permission to perform this action",
    );
  }

  await prisma.message.delete({
    where: {
      id: messageId,
    },
  });

  res.status(204).end();
};
