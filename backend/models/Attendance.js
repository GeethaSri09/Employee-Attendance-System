import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  checkInTime: { type: String },
  checkOutTime: { type: String },
  totalHours: { type: Number, default: 0 },
  status: { type: String, enum: ["present","absent","late","half-day"], default: "present" }
}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);
