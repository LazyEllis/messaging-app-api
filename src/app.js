import express from "express";
import http from "node:http";
import cors from "cors";
import "dotenv/config";
import "./lib/passport.js";
import { init } from "./lib/socket.js";
import userRouter from "./routes/userRouter.js";
import authRouter from "./routes/authRouter.js";
import channelRouter from "./routes/channelRouter.js";
import recipientRouter from "./routes/recipientRouter.js";
import messageRouter from "./routes/messageRouter.js";
import indexRouter from "./routes/indexRouter.js";

const app = express();
const server = http.createServer(app);
const io = init(server, { cors: { origin: process.env.FRONTEND_URL } });

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL }));

app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/channels", channelRouter);
app.use("/channels/:channelId/recipients", recipientRouter);
app.use("/channels/:channelId/messages", messageRouter);
app.use("/", indexRouter);

io.on("connection", (socket) => {
  socket.on("join-channel", (channelId) => {
    socket.join(`channel-${channelId}`);
  });

  socket.on("leave-channel", (channelId) => {
    socket.leave(`channel-${channelId}`);
  });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
