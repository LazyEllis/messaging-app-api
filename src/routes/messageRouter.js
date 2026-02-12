import { Router } from "express";
import { requireAuth } from "../lib/auth.js";
import {
  validateChannelId,
  validateMessageCreation,
  validateMessageUpdate,
  validateRequestParams,
} from "../validators/messageValidators.js";
import {
  createMessage,
  deleteMessage,
  getMessage,
  listChannelMessages,
  updateMessage,
} from "../controllers/messageController.js";

const messageRouter = Router({ mergeParams: true });

messageRouter.get("/", requireAuth, validateChannelId, listChannelMessages);

messageRouter.get(
  "/:messageId",
  requireAuth,
  validateRequestParams,
  getMessage,
);

messageRouter.post("/", requireAuth, validateMessageCreation, createMessage);

messageRouter.put(
  "/:messageId",
  requireAuth,
  validateMessageUpdate,
  updateMessage,
);

messageRouter.delete(
  "/:messageId",
  requireAuth,
  validateRequestParams,
  deleteMessage,
);

export default messageRouter;
