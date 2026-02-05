import passport from "passport";
import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import prisma from "./prisma.js";

const LOCAL_STRATEGY_CONFIG = { usernameField: "email" };

const JWT_STRATEGY_CONFIG = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new LocalStrategy(LOCAL_STRATEGY_CONFIG, async (email, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        return done(null, false, { message: "Incorrect email or password" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect email or password" });
      }

      return done(null, user);
    } catch (error) {
      done(error);
    }
  }),
);

passport.use(
  new JWTStrategy(JWT_STRATEGY_CONFIG, async (jwt_payload, done) => {
    try {
      return done(null, { id: jwt_payload.sub });
    } catch (error) {
      done(error);
    }
  }),
);
