import passport from "passport";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../lib/errors.js";

export const generateToken = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      throw new UnauthorizedError(info.message);
    }

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ token });
  })(req, res, next);
};
