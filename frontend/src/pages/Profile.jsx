// frontend/src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", employeeId: "", department: "", password: "" });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { nav("/"); return; }
      const res = await axios.get(import.meta.env.VITE_API_URL + "/api/auth/me", {
        headers: { Authorization: "Bearer " + token }
      });
      setUser(res.data);
      setForm({ name: res.data.name || "", employeeId: res.data.employeeId || "", department: res.data.department || "", password: "" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message);
    }
  };

  const update = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      const payload = { name: form.name, employeeId: form.employeeId, department: form.department };
      if (form.password) payload.password = form.password;
      const res = await axios.put(import.meta.env.VITE_API_URL + "/api/auth/me", payload, {
        headers: { Authorization: "Bearer " + token }
      });
      setUser(res.data);
      setForm(f => ({ ...f, password: "" }));
      alert("Profile updated");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="container"><h2>Profile</h2><div>Loading…</div></div>;

  return (
    <div className="container">
      <h2 className="page-title">My Profile</h2>
  
      <div className="profile-card">
        <form onSubmit={update}>
          
          <div className="form-group">
            <label>Name</label>
            <input 
              value={form.name} 
              onChange={e=>setForm({...form, name: e.target.value})} 
            />
          </div>
  
          <div className="form-group">
            <label>Email (not editable)</label>
            <input value={user.email} readOnly className="readonly"/>
          </div>
  
          <div className="form-group">
            <label>Employee ID</label>
            <input 
              value={form.employeeId} 
              onChange={e=>setForm({...form, employeeId: e.target.value})} 
            />
          </div>
  
          <div className="form-group">
            <label>Department</label>
            <input 
              value={form.department} 
              onChange={e=>setForm({...form, department: e.target.value})} 
            />
          </div>
  
          <div className="form-group">
            <label>New password (optional)</label>
            <input 
              type="password" 
              value={form.password} 
              onChange={e=>setForm({...form, password: e.target.value})}
              placeholder="Leave blank to keep existing"
            />
          </div>
  
          <div className="profile-buttons">
            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </button>
  
            <button 
              className="btn secondary"
              type="button"
              onClick={()=>{
                setForm({
                  name: user.name || "",
                  employeeId: user.employeeId || "",
                  department: user.department || "",
                  password: ""
                })
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}  