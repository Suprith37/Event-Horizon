import express from "express";
import { getEvents, createEvent } from "../controllers/eventController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getEvents);
router.post("/", protect, createEvent);

export default router;
