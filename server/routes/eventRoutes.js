import { Router } from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { createEvent, deleteEvent, getEvent, getEvents, updateEvent } from "../controllers/eventController.js";


const router=Router();
router.post("/", upload.array("images", 5), protect,createEvent);
router.get("/", getEvents);
router.get("/:id",  getEvent);
router.delete("/:id", protect, deleteEvent);
router.put("/:id", protect, updateEvent);

export default router;