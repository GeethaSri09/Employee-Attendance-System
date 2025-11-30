import Attendance from "../models/Attendance.js";
import moment from "moment";
import User from "../models/User.js";

// Check-in (user)
export const checkIn = async (req, res) => {
  try {
    const date = moment().format("YYYY-MM-DD");
    const existing = await Attendance.findOne({ userId: req.user.id, date });
    if (existing && existing.checkInTime) {
      
      return res.status(400).json({ message: "Already checked-in today" });
    }
    const timeNow = moment().format("HH:mm");
    if (existing) {
      existing.checkInTime = timeNow;
      existing.status = existing.status || "present";
      await existing.save();
      return res.json(existing);
    }
    const attendance = await Attendance.create({
      userId: req.user.id,
      date,
      checkInTime: timeNow,
      status: "present"
    });
    return res.json(attendance);
  } catch (err) {
    console.error("checkIn error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Check-out (user)
export const checkOut = async (req, res) => {
  try {
    const date = moment().format("YYYY-MM-DD");
    const rec = await Attendance.findOne({ userId: req.user.id, date });
    if (!rec || !rec.checkInTime) {
      return res.status(400).json({ message: "No check-in found for today" });
    }
    if (rec.checkOutTime) {
      return res.status(400).json({ message: "Already checked-out today" });
    }

    const timeNow = moment().format("HH:mm");
    rec.checkOutTime = timeNow;
    const start = moment(`${rec.date} ${rec.checkInTime}`, "YYYY-MM-DD HH:mm");
    const end = moment(`${rec.date} ${rec.checkOutTime}`, "YYYY-MM-DD HH:mm");
    let diffMinutes = end.diff(start, "minutes");
    if (diffMinutes < 0) diffMinutes = 0;
    rec.totalHours = Number((diffMinutes / 60).toFixed(2));
    await rec.save();
    return res.json(rec);
  } catch (err) {
    console.error("checkOut error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Today's record for current logged-in user
export const today = async (req, res) => {
  try {
    const date = moment().format("YYYY-MM-DD");
    const rec = await Attendance.findOne({ userId: req.user.id, date });
    return res.json(rec || null);
  } catch (err) {
    console.error("today error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// My history (all records for this user)
export const myHistory = async (req, res) => {
  try {
    const records = await Attendance.find({ userId: req.user.id }).sort({ date: -1 });
    return res.json(records);
  } catch (err) {
    console.error("myHistory error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// My summary for a month
export const mySummary = async (req, res) => {
  try {
    const month = req.query.month || moment().format("YYYY-MM");
    const dateRegex = `^${month}`; 

    const records = await Attendance.find({
      userId: req.user.id,
      date: { $regex: dateRegex }
    });

    let present = 0, absent = 0, late = 0, half = 0;
    let totalHours = 0;

    for (const r of records) {
      const s = (r.status || "").toLowerCase();
      if (s === "present") present++;
      else if (s === "absent") absent++;
      else if (s === "late") late++;
      else if (s === "half-day" || s === "half") half++;

      totalHours += Number(r.totalHours || 0);
    }

    return res.json({
      month,
      totalDays: records.length,
      present,
      absent,
      late,
      halfDay: half,
      totalHours: Number(totalHours.toFixed(2)),
      records
    });
  } catch (err) {
    console.error("mySummary error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// All attendance with filters
export const allAttendance = async (req, res) => {
  try {
    const { start, end, employeeId, status } = req.query;
    const filter = {};

    if (start && end) filter.date = { $gte: start, $lte: end };
    else if (start) filter.date = { $gte: start };
    else if (end) filter.date = { $lte: end };

    if (employeeId) {
      const user = await User.findOne({ employeeId });
      if (!user) return res.json([]);
      filter.userId = user._id;
    }

    if (status) filter.status = status;

    const records = await Attendance.find(filter)
      .populate("userId", "name employeeId department")
      .sort({ date: -1 });

    return res.json(records);
  } catch (err) {
    console.error("allAttendance error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Team summary (manager)
export const teamSummary = async (req, res) => {
  try {
    const today = moment().format("YYYY-MM-DD");
    const monthPrefix = moment().format("YYYY-MM");

    const totalEmployees = await User.countDocuments({ role: "employee" });
    const todayRecords = await Attendance.find({ date: today }).populate("userId", "name employeeId department role");

    const presentToday = todayRecords.length;
    const lateToday = todayRecords.filter(r => (r.status || "").toLowerCase() === "late").length;

    const presentIds = todayRecords.map(r => String(r.userId._id));
    const allEmployees = await User.find({ role: "employee" }).select("_id name employeeId department");
    const absentToday = allEmployees.filter(u => !presentIds.includes(String(u._id))).length;

    const monthRecords = await Attendance.find({ date: { $regex: `^${monthPrefix}` } });
    const totalHoursThisMonth = monthRecords.reduce((s, r) => s + (Number(r.totalHours) || 0), 0);

    const deptMap = {};
    todayRecords.forEach(r => {
      const dept = r.userId?.department || "Unknown";
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });

    return res.json({
      totalEmployees,
      presentToday,
      absentToday,
      lateToday,
      totalHoursThisMonth: Number(totalHoursThisMonth.toFixed(2)),
      deptWise: deptMap
    });
  } catch (err) {
    console.error("teamSummary error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Employee attendance by id (manager)
export const employeeAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ userId: req.params.id }).sort({ date: -1 });
    return res.json(records);
  } catch (err) {
    console.error("employeeAttendance error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Today's status for all users (manager view)
export const todayStatus = async (req, res) => {
  try {
    const date = moment().format("YYYY-MM-DD");
    const records = await Attendance.find({ date }).populate("userId", "name employeeId");
    return res.json(records);
  } catch (err) {
    console.error("todayStatus error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Export attendance to CSV (manager)
export const exportAttendance = async (req, res) => {
  try {
    const { start, end, employeeId } = req.query;
    const filter = {};
    if (start && end) filter.date = { $gte: start, $lte: end };
    else if (start) filter.date = { $gte: start };
    else if (end) filter.date = { $lte: end };

    if (employeeId) {
      const user = await User.findOne({ employeeId });
      if (user) filter.userId = user._id;
      else {
        const header = ["date","employeeName","employeeId","department","checkIn","checkOut","totalHours","status"];
        res.setHeader("Content-Disposition", "attachment; filename=attendance-report.csv");
        res.setHeader("Content-Type", "text/csv");
        return res.send(header.join(",") + "\n");
      }
    }

    const records = await Attendance.find(filter).populate("userId", "name employeeId department").sort({ date: 1 });

    const rows = records.map(r => ({
      date: r.date,
      employeeName: r.userId?.name || "",
      employeeId: r.userId?.employeeId || "",
      department: r.userId?.department || "",
      checkIn: r.checkInTime || "",
      checkOut: r.checkOutTime || "",
      totalHours: r.totalHours || 0,
      status: r.status || ""
    }));

    const header = ["date","employeeName","employeeId","department","checkIn","checkOut","totalHours","status"];
    const lines = [header.join(",")].concat(rows.map(row => header.map(h => String(row[h] ?? "").replace(/,/g, " ")).join(",")));
    const csv = lines.join("\n");

    res.setHeader("Content-Disposition", "attachment; filename=attendance-report.csv");
    res.setHeader("Content-Type", "text/csv");
    return res.send(csv);
  } catch (err) {
    console.error("exportAttendance error:", err);
    return res.status(500).json({ message: err.message });
  }
};




