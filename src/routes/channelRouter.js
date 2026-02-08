import { Router } from "express";
import { requireAuth } from "../lib/auth.js";
import {
  createDM,
  createGroup,
  deleteChannel,
  getChannel,
  listChannels,
  updateChannel,
} from "../controllers/channelController.js";
import {
  validateChannelId,
  validateChannelUpdate,
  validateDM,
  validateGroup,
} from "../validators/channelValidators.js";

const channelRouter = Router();

channelRouter.get("/", requireAuth, listChannels);

channelRouter.get("/:channelId", requireAuth, validateChannelId, getChannel);

channelRouter.post("/dms", requireAuth, validateDM, createDM);

channelRouter.post("/groups", requireAuth, validateGroup, createGroup);

channelRouter.put(
  "/:channelId",
  requireAuth,
  validateChannelUpdate,
  updateChannel,
);

channelRouter.delete(
  "/:channelId",
  requireAuth,
  validateChannelId,
  deleteChannel,
);

export default channelRouter;
