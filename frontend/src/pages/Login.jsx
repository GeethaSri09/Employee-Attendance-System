import React, {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login(){
  const [email,setEmail]=useState("");
  const [pw,setPw]=useState("");
  const nav = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + "/api/auth/login", { email, password: pw });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user?.role || "employee");
      if (res.data.user?.role === "manager") {
        nav("/manager");
      } else {
        nav("/dashboard");
      }
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    }
  };


  return (
    <div className="container">
      <div className="center-wrap">
        <div className="card1">
          <h2>Login</h2>

          <div className="form-row">
            <label className="muted">Email</label>
            <input type="email" placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>

          <div className="form-row">
            <label className="muted">Password</label>
            <input type="password" placeholder="Enter password" value={pw} onChange={e=>setPw(e.target.value)} />
          </div>

          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:12}}>
  <button className="btn" onClick={login}>Login</button>

  <div className="login-footer" style={{display:"flex", alignItems:"center", gap:8}}>
    <div className="muted" style={{margin:0}}>No account?</div>
    <a className="small-link" href="/register" style={{textDecoration:"underline", marginLeft:0}}>Register</a>
  </div>
</div>


        </div>
      </div>
    </div>
  );
}
