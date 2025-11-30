import express from "express";
import auth from "../middleware/authMiddleware.js";
import { checkIn, checkOut,today, myHistory, mySummary, allAttendance, employeeAttendance, todayStatus, exportAttendance, teamSummary } from "../controllers/attendanceController.js";

const router = express.Router();
router.post("/checkin", auth, checkIn);
router.post("/checkout", auth, checkOut);
router.get("/today", auth, today);
router.get("/my-history", auth, myHistory);
router.get("/my-summary", auth, mySummary);

router.get("/all", auth, allAttendance);
router.get("/summary", auth, teamSummary);
router.get("/employee/:id", auth, employeeAttendance);
router.get("/today-status", auth, todayStatus);
router.get("/export", auth, exportAttendance);

export default router;
