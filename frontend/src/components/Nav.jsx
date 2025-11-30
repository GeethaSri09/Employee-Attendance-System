/*import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Nav() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const nav = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    nav("/");
  };

  return (
    <nav style={{
      background: "#fff",
      borderBottom: "1px solid #eef2f7",
      padding: "10px 20px",
      marginBottom: "20px"
    }}>
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", gap: "15px" }}>
          
          {!token && (
            <>
              <Link to="/">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}

          {token && role === "employee" && (
            <>
              <Link to="/dashboard">Dashboard</Link>
            </>
          )}

          {token && role === "manager" && (
            <>
              <Link to="/manager">Manager</Link>
              <Link to="/all-employees">All Employees</Link>
              <Link to="/reports">Reports</Link>
            </>
          )}
        </div>
        <div>
          {token ? (
            <button 
              onClick={logout}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600"
              }}>
              Logout
            </button>
          ) : (
            <span style={{ color: "#6b7280" }}>Welcome</span>
          )}
        </div>

      </div>
    </nav>
  );
}*/import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Nav() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const nav = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    nav("/");
  };

  return (
    <nav style={{
      background: "#fff",
      borderBottom: "1px solid #eef2f7",
      padding: "10px 20px",
      marginBottom: "20px"
    }}>
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>

        {/* LEFT SIDE LINKS */}
        <div style={{ display: "flex", gap: "15px" }}>

          {/* Login / Register (when no token) */}
          {!token && (
            <>
              <Link to="/">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}

          {/* Employee Links */}
          {token && role === "employee" && (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/profile">Profile</Link>
            </>
          )}

          {/* Manager Links */}
          {token && role === "manager" && (
            <>
              <Link to="/manager">Manager</Link>
              <Link to="/all-employees">All Employees</Link>
              <Link to="/reports">Reports</Link>
              <Link to="/profile">Profile</Link>
            </>
          )}

        </div>

        {/* RIGHT SIDE  (Logout or Welcome) */}
        <div>
          {token ? (
            <button 
              onClick={logout}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600"
              }}>
              Logout
            </button>
          ) : (
            <span style={{ color: "#6b7280" }}>Welcome</span>
          )}
        </div>

      </div>
    </nav>
  );
}



