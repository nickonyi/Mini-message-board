import { Router } from "express";
import { getMessages } from "../controllers/controller.js";
import { messages } from "../controllers/controller.js";
const router = Router();

router.get("/", getMessages);

export default router;
