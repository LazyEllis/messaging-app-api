import { ConflictError, ForbiddenError, NotFoundError } from "../lib/errors.js";
import prisma from "../lib/prisma.js";

export const listChannels = async (req, res) => {
  const { id } = req.user;

  const channels = await prisma.channel.findMany({
    where: {
      recipients: {
        some: {
          id,
        },
      },
    },
    omit: {
      ownerId: true,
    },
    include: {
      owner: {
        omit: {
          email: true,
          password: true,
        },
      },
      recipients: {
        omit: {
          email: true,
          password: true,
        },
      },
    },
  });

  res.json(channels);
};

export const getChannel = async (req, res) => {
  const { id } = req.user;
  const { channelId } = req.params;

  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId,
    },
    omit: {
      ownerId: true,
    },
    include: {
      owner: {
        omit: {
          email: true,
          password: true,
        },
      },
      recipients: {
        omit: {
          email: true,
          password: true,
        },
      },
    },
  });

  if (!channel) {
    throw new NotFoundError("Channel Not Found");
  }

  if (!channel.recipients.some((recipient) => recipient.id === id)) {
    throw new ForbiddenError(
      "You do not have permission to access this resource",
    );
  }

  res.json(channel);
};

export const createDM = async (req, res) => {
  const { id } = req.user;
  const { recipient } = req.body;

  const existingChannel = await prisma.channel.findFirst({
    where: {
      type: "DM",
      recipients: {
        every: {
          id: { in: [id, recipient] },
        },
      },
    },
    omit: {
      ownerId: true,
    },
    include: {
      owner: {
        omit: {
          email: true,
          password: true,
        },
      },
      recipients: {
        omit: {
          email: true,
          password: true,
        },
      },
    },
  });

  if (existingChannel) {
    return res.json(existingChannel);
  }

  const channel = await prisma.channel.create({
    data: {
      type: "DM",
      recipients: {
        connect: [{ id }, { id: recipient }],
      },
    },
    omit: {
      ownerId: true,
    },
    include: {
      owner: {
        omit: {
          email: true,
          password: true,
        },
      },
      recipients: {
        omit: {
          email: true,
          password: true,
        },
      },
    },
  });

  res.status(201).json(channel);
};

export const createGroup = async (req, res) => {
  const { id } = req.user;
  const { name, recipients } = req.body;

  const channel = await prisma.channel.create({
    data: {
      type: "GROUP",
      name,
      ownerId: id,
      recipients: {
        connect: [{ id }, ...recipients],
      },
    },
    omit: {
      ownerId: true,
    },
    include: {
      owner: {
        omit: {
          email: true,
          password: true,
        },
      },
      recipients: {
        omit: {
          email: true,
          password: true,
        },
      },
    },
  });

  res.status(201).json(channel);
};

export const updateChannel = async (req, res) => {
  const { id } = req.user;
  const { channelId } = req.params;
  const { name, recipients } = req.body;

  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  if (!channel) {
    throw new NotFoundError("Channel Not Found");
  }

  if (channel.type === "DM") {
    throw new ConflictError("You cannot update the details of a DM Channel.");
  }

  if (channel.ownerId !== id) {
    throw new ForbiddenError(
      "You do not have permission to perform this action",
    );
  }

  const updatedChannel = await prisma.channel.update({
    where: {
      id: channelId,
    },
    data: {
      name,
      recipients: {
        set: [],
        connect: [{ id }, ...recipients],
      },
    },
    omit: {
      ownerId: true,
    },
    include: {
      owner: {
        omit: {
          email: true,
          password: true,
        },
      },
      recipients: {
        omit: {
          email: true,
          password: true,
        },
      },
    },
  });

  res.json(updatedChannel);
};

export const deleteChannel = async (req, res) => {
  const { id } = req.user;
  const { channelId } = req.params;

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

  if (!channel.recipients.some((recipient) => recipient.id === id)) {
    throw new ForbiddenError(
      "You do not have permission to access this resource",
    );
  }

  if (channel.type === "GROUP" && channel.ownerId !== id) {
    throw new ForbiddenError(
      "You do not have permission to perform this action",
    );
  }

  await prisma.channel.delete({
    where: {
      id: channelId,
    },
  });

  res.status(204).end();
};
