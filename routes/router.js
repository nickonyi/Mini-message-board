import { Router } from "express";
import { getMessages } from "../controllers/controller.js";
import { formData } from "../controllers/controller.js";
import { createPosts } from "../controllers/controller.js";
import { getMessageDetails } from "../controllers/controller.js";
const router = Router();

router.get("/", getMessages);
router.get("/new", formData);
router.post("/new", createPosts);
router.get("/message/:id", getMessageDetails);

export default router;
