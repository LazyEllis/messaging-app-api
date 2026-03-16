import { Router } from "express";
import { send404Message } from "../controllers/indexController.js";

const indexRouter = Router();

indexRouter.all("/{*splat}", send404Message);

export default indexRouter;
