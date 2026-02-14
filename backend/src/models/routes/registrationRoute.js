import express from "express";
import {
  createRegistration,
  getAllRegistrations,
  getEventRegistrations,
  updateAttendance,
  verifyTicket
} from "../controllers/registrationController.js";

const router = express.Router();

router.post("/", createRegistration);
router.get("/", getAllRegistrations);
router.get("/verify/:ticketId", verifyTicket);
router.get("/event/:id", getEventRegistrations);
router.patch("/:id/attendance", updateAttendance);

export default router;
