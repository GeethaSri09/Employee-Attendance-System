import React, {useEffect, useState} from "react";
import axios from "axios";
import moment from "moment";

export default function AttendanceHistory(){
  const [records, setRecords] = useState([]);
  const [month, setMonth] = useState(moment().format("YYYY-MM")); // YYYY-MM
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ fetchHistory(); }, [month]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(import.meta.env.VITE_API_URL + "/api/attendance/my-history", { headers: { Authorization: "Bearer "+token }});
      setRecords(res.data || []);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  };

  const filtered = records.filter(r => r.date?.startsWith(month));
  const daysInMonth = moment(month + "-01").daysInMonth();
  const startOfMonth = moment(month + "-01");
  const Badge = ({status}) => {
    if(status === "present") return <span className="badge present">Present</span>
    if(status === "absent") return <span className="badge absent">Absent</span>
    if(status === "late") return <span className="badge late">Late</span>
    if(status === "half-day" || status === "half") return <span className="badge half">Half-day</span>
    return <span className="badge present">—</span>
  };

  return (
    <div className="container">
      <h2>My Attendance History</h2>

      <div className="month-filter">
        <label className="muted">Select month</label>
        <input type="month" value={month} onChange={e=>setMonth(e.target.value)} />
      </div>
      <div style={{display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:8, marginBottom:18}}>
        <div className="muted" style={{fontWeight:700}}>Sun</div>
        <div className="muted" style={{fontWeight:700}}>Mon</div>
        <div className="muted" style={{fontWeight:700}}>Tue</div>
        <div className="muted" style={{fontWeight:700}}>Wed</div>
        <div className="muted" style={{fontWeight:700}}>Thu</div>
        <div className="muted" style={{fontWeight:700}}>Fri</div>
        <div className="muted" style={{fontWeight:700}}>Sat</div>

        {(() => {
          const cells = [];
          const firstDay = startOfMonth.day(); // 0..6
          for(let i=0;i<firstDay;i++) cells.push(<div key={"b"+i}></div>);
          for(let d=1; d<=daysInMonth; d++){
            const dateStr = startOfMonth.clone().date(d).format("YYYY-MM-DD");
            const rec = filtered.find(r => r.date === dateStr);
            cells.push(
              <div key={dateStr} className="card-small" style={{minHeight:72}}>
                <div style={{fontWeight:700}}>{d}</div>
                <div style={{marginTop:6}}>
                  {rec ? <Badge status={rec.status} /> : <span className="muted">No data</span>}
                </div>
              </div>
            );
          }
          return cells;
        })()}
      </div>

      <h3>Table view</h3>
      {loading ? <div>Loading…</div> : (
        <table className="table-small">
          <thead><tr><th>Date</th><th>Check In</th><th>Check Out</th><th>Hours</th><th>Status</th></tr></thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={5} className="muted">No records for this month</td></tr>}
            {filtered.map(r => (
              <tr key={r._id}>
                <td>{r.date}</td>
                <td>{r.checkInTime || "—"}</td>
                <td>{r.checkOutTime || "—"}</td>
                <td>{r.totalHours ?? 0}</td>
                <td><Badge status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
