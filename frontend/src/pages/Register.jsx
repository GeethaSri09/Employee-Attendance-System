import React, {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register(){
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");

  const nav = useNavigate();

  const register = async () => {
    try {
      await axios.post(import.meta.env.VITE_API_URL + "/api/auth/register", {
        name,
        email,
        password,
        employeeId,
        department
      });
      alert("Registered successfully!");
      nav("/");
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    }
  };

  return (
    <div className="container">
      <div className="center-wrap">
        <div className="card1">
          <h2>Register</h2>

          <div className="form-row">
            <label className="muted">Name</label>
            <input type="text" value={name} onChange={e=>setName(e.target.value)} />
          </div>

          <div className="form-row">
            <label className="muted">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>

          <div className="form-row">
            <label className="muted">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>

          <div className="form-row">
            <label className="muted">Employee ID</label>
            <input type="text" value={employeeId} onChange={e=>setEmployeeId(e.target.value)} />
          </div>

          <div className="form-row">
            <label className="muted">Department</label>
            <input type="text" value={department} onChange={e=>setDepartment(e.target.value)} />
          </div>

          <button className="btn" onClick={register}>Register</button>

        </div>
      </div>
    </div>
  );
}
