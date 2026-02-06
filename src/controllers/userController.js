import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NotFoundError } from "../lib/errors.js";
import prisma from "../lib/prisma.js";

export const listUsers = async (req, res) => {
  const { id } = req.user;

  const users = await prisma.user.findMany({
    where: {
      NOT: {
        id,
      },
    },
    omit: {
      email: true,
      password: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  res.json(users);
};

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    omit: {
      password: true,
    },
  });

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  res.json({ user, token });
};

export const getUser = async (req, res) => {
  const { userId } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      email: true,
      password: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User Not Found");
  }

  res.json(user);
};

export const getCurrentUser = async (req, res) => {
  const { id } = req.user;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    omit: {
      password: true,
    },
  });

  res.json(user);
};

export const updateCurrentUser = async (req, res) => {
  const { id } = req.user;
  const { name, email } = req.body;

  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      name,
      email,
    },
    omit: {
      password: true,
    },
  });

  res.json(user);
};

export const updateCurrentUserPassword = async (req, res) => {
  const { id } = req.user;
  const { password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      password: hashedPassword,
    },
  });

  res.status(204).end();
};
