import { Router } from "express";
import { requireAuth } from "../lib/auth.js";
import { validateRequestParams } from "../validators/recipientValidators.js";
import {
  addGroupRecipient,
  deleteGroupRecipient,
} from "../controllers/recipientController.js";

const recipientRouter = Router({ mergeParams: true });

recipientRouter.put(
  "/:recipientId",
  requireAuth,
  validateRequestParams,
  addGroupRecipient,
);

recipientRouter.delete(
  "/:recipientId",
  requireAuth,
  validateRequestParams,
  deleteGroupRecipient,
);

export default recipientRouter;
