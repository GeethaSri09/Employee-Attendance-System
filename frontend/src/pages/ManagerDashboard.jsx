import React, {useEffect, useState} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function ManagerDashboard(){
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [range, setRange] = useState("last7"); // "daily" | "last7" | "month"
  const [chartData, setChartData] = useState([]);

  useEffect(()=>{ fetchSummary(); fetchAll(); },[]);

  useEffect(()=> { computeChart(); }, [records, range]);

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(import.meta.env.VITE_API_URL + "/api/attendance/summary", { headers: { Authorization: "Bearer "+token }});
      setSummary(res.data);
    } catch (e) { console.error(e) }
  };

  const fetchAll = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(import.meta.env.VITE_API_URL + "/api/attendance/all", { headers: { Authorization: "Bearer "+token }});
      setRecords(res.data || []);
    } catch (e) { console.error(e) }
  };
  const computeChart = () => {
    if (!records) { setChartData([]); return; }
    if (range === "daily") {
      
      const today = new Date().toISOString().slice(0,10);
      const hoursMap = {};
      for (let h=0; h<24; h++) hoursMap[String(h).padStart(2,'0')+":00"] = 0;
      records.forEach(r => {
        if (r.date === today && r.checkInTime) {
          const hour = r.checkInTime.split(":")[0];
          const key = hour + ":00";
          hoursMap[key] = (hoursMap[key] || 0) + 1;
        }
      });
      const arr = Object.keys(hoursMap).map(k => ({ label:k, count: hoursMap[k] }));
      setChartData(arr);
    } else if (range === "month") {
      const now = new Date();
      const monthPrefix = now.toISOString().slice(0,7); 
      const map = {};
      records.forEach(r => {
        if (r.date && r.date.startsWith(monthPrefix)) {
          map[r.date] = (map[r.date] || 0) + 1;
        }
      });
      const arr = Object.keys(map).sort().map(d => ({ label: d, count: map[d] }));
      setChartData(arr);
    } else {
      const map = {};
      records.forEach(r => {
        if (r.date) map[r.date] = (map[r.date] || 0) + 1;
      });
      const keys = Object.keys(map).sort();
      const last7 = keys.slice(-7);
      const arr = last7.map(d => ({ label: d, count: map[d] }));
      setChartData(arr);
    }
  };
  const getYDomain = () => {
    if (!chartData || chartData.length === 0) return [0, 5];
    const max = Math.max(...chartData.map(x => x.count));
    if (max <= 1) return [0, 3];
    return [0, Math.ceil(max * 1.2)];
  };

  return (
    <div className="container">
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <h2>Manager Dashboard</h2>
      </div>
      <div style={{display:'flex', gap:12, marginTop:12}}>
        <div className="card-small"><div className="muted">Total Employees</div><div style={{fontWeight:700,fontSize:18}}>{summary?summary.totalEmployees:0}</div></div>
        <div className="card-small"><div className="muted">Present Today</div><div style={{fontWeight:700,fontSize:18}}>{summary?summary.presentToday:0}</div></div>
        <div className="card-small"><div className="muted">Absent Today</div><div style={{fontWeight:700,fontSize:18}}>{summary?summary.absentToday:0}</div></div>
        <div className="card-small"><div className="muted">Late Today</div><div style={{fontWeight:700,fontSize:18}}>{summary?summary.lateToday:0}</div></div>
        <div className="card-small"><div className="muted">Hours (month)</div><div style={{fontWeight:700,fontSize:18}}>{summary?Number(summary.totalHoursThisMonth).toFixed(2):'0.00'}</div></div>
      </div>
      <div style={{
        marginTop: '24px',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <label style={{
          color: '#4a5568',
          fontSize: '14px',
          fontWeight: '500',
          margin: 0
        }}>
          Date Range:
        </label>
        <select 
          value={range} 
          onChange={e => setRange(e.target.value)}
          style={{
            padding: '8px 28px 8px 12px',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            backgroundColor: 'white',
            color: '#2d3748',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.15s ease-in-out',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            appearance: 'none',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'12\' height=\'12\' viewBox=\'0 0 12 7\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1L6 6L11 1\' stroke=\'%236B7280\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            minWidth: '180px',
            ':hover': {
              borderColor: '#cbd5e0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            },
            ':focus': {
              borderColor: '#4299e1',
              boxShadow: '0 0 0 1px #4299e1'
            }
          }}
        >
          <option value="daily">Daily (hours)</option>
          <option value="last7">Last 7 days</option>
          <option value="month">This month</option>
        </select>
      </div>
      <div style={{
        margin: '24px auto',
        maxWidth: '800px',
        width: 'calc(100% - 40px)',
        padding: '0 20px',
        boxSizing: 'border-box'
      }}>
        <div className="card" style={{padding: '20px' }}>
          <h4 style={{ marginTop: 0, marginBottom: '16px', color: '#2d3748' }}>Attendance Overview</h4>
          <div style={{height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%" style={{ margin: '0 auto' }}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis domain={getYDomain()} allowDecimals={false}/>
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div style={{marginTop:18}}>
        <div className="card" style={{
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <h4 style={{ marginTop: 0, color: '#2c3e50', paddingBottom: '10px', borderBottom: '1px solid #e9ecef' }}>Recent Records</h4>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.9em',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  textAlign: 'left',
                  fontWeight: 'bold'
                }}>
                  <th style={{ padding: '12px 15px' }}>Date</th>
                  <th style={{ padding: '12px 15px' }}>Employee</th>
                  <th style={{ padding: '12px 15px' }}>Check In</th>
                  <th style={{ padding: '12px 15px' }}>Check Out</th>
                  <th style={{ padding: '12px 15px' }}>Hours</th>
                </tr>
              </thead>
              <tbody>
                {records.slice(0, 10).map(r => (
                  <tr 
                    key={r._id}
                    style={{
                      borderBottom: '1px solid #e9ecef',
                      transition: 'all 0.3s',
                      ':hover': {
                        backgroundColor: '#f8f9fa'
                      }
                    }}
                  >
                    <td style={{ padding: '12px 15px', borderRight: '1px solid #e9ecef' }}>{r.date}</td>
                    <td style={{ padding: '12px 15px', borderRight: '1px solid #e9ecef' }}>{r.userId?.name || '—'}</td>
                    <td style={{ padding: '12px 15px', borderRight: '1px solid #e9ecef' }}>{r.checkInTime || '—'}</td>
                    <td style={{ padding: '12px 15px', borderRight: '1px solid #e9ecef' }}>{r.checkOutTime || '—'}</td>
                    <td style={{ padding: '12px 15px' }}>{r.totalHours ? Number(r.totalHours).toFixed(2) : '0.00'}</td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#6c757d', fontStyle: 'italic' }}>
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
