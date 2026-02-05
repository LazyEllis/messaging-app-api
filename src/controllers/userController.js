import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

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
