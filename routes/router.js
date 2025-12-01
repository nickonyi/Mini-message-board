import { Router } from "express";
import { getMessages } from "../controllers/controller.js";
import { formData } from "../controllers/controller.js";
import { createPosts } from "../controllers/controller.js";
import { messages } from "../controllers/controller.js";
const router = Router();

router.get("/", getMessages);
router.get("/new", formData);
router.post("/new", createPosts);

export default router;
