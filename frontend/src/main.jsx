import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import MarkAttendance from "./pages/MarkAttendance";
import ManagerDashboard from "./pages/ManagerDashboard";
import AllEmployees from "./pages/AllEmployees";
import Reports from "./pages/Reports";
import AttendanceHistory from "./pages/AttendanceHistory";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles.css";
import Profile from "./pages/Profile";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProtectedRoute roleRequired={null}><Profile/></ProtectedRoute>} />
        <Route path="/mark" element={<ProtectedRoute roleRequired="employee"><MarkAttendance/></ProtectedRoute>} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute roleRequired="employee">
            <EmployeeDashboard />
          </ProtectedRoute>
        } />
        <Route path="/manager" element={
          <ProtectedRoute roleRequired="manager">
            <ManagerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/all-employees" element={<ProtectedRoute roleRequired="manager"><AllEmployees/></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute roleRequired="manager"><Reports/></ProtectedRoute>} />
        <Route path="/attendance-history" element={<ProtectedRoute roleRequired="employee"><AttendanceHistory/></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

