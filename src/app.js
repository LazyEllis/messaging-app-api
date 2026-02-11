import express from "express";
import cors from "cors";
import "dotenv/config";
import "./lib/passport.js";
import userRouter from "./routes/userRouter.js";
import authRouter from "./routes/authRouter.js";
import channelRouter from "./routes/channelRouter.js";
import recipientRouter from "./routes/recipientRouter.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL }));

app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/channels", channelRouter);
app.use("/channels/:channelId/recipients", recipientRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
