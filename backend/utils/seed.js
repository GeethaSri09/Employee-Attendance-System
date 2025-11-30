import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import connectDB from "../config/db.js";

dotenv.config();
await connectDB();
const users = [
  { 
    name: "Manager One",
    email: "manager@example.com",
    password: "123456",
    role: "manager",
    employeeId: "M001",
    department: "Admin"
  }
];

for (const u of users) {
  const exists = await User.findOne({ email: u.email });
  if (!exists) {
    const hashed = await bcrypt.hash(u.password, 10);
    await User.create({ ...u, password: hashed });
    console.log("Created", u.email);
  } else {
    console.log("Already exists:", u.email);
  }
}

console.log("Seed done");
process.exit(0);

