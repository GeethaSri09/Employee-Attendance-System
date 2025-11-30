import React, {useState} from "react";
import axios from "axios";

export default function Reports(){
  const [start,setStart] = useState("");
  const [end,setEnd] = useState("");
  const [empId,setEmpId] = useState("");
  const [loading, setLoading] = useState(false);

  const exportCSV = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const q = new URLSearchParams();
      if (start) q.set("start", start);
      if (end) q.set("end", end);
      if (empId) q.set("employeeId", empId);
      const res = await axios.get(import.meta.env.VITE_API_URL + "/api/attendance/export?" + q.toString(), { headers: { Authorization: "Bearer "+token }, responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) { 
      alert(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Generate Attendance Report</h2>
      
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        padding: '25px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        marginBottom: '30px'
      }}>
        <h3 style={{ marginTop: 0, color: '#495057', borderBottom: '1px solid #e9ecef', paddingBottom: '10px' }}>Report Filters</h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#495057',
              fontSize: '0.95em'
            }}>Start Date</label>
            <input 
              type="date" 
              value={start} 
              onChange={e=>setStart(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '0.95em',
                backgroundColor: '#fff'
              }}
            />
          </div>
          
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#495057',
              fontSize: '0.95em'
            }}>End Date</label>
            <input 
              type="date" 
              value={end} 
              onChange={e=>setEnd(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '0.95em',
                backgroundColor: '#fff'
              }}
            />
          </div>
          
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#495057',
              fontSize: '0.95em'
            }}>Employee ID</label>
            <input 
              placeholder="e.g., EMP001" 
              value={empId} 
              onChange={e=>setEmpId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '0.95em',
                backgroundColor: '#fff'
              }}
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button 
            onClick={() => { setStart(''); setEnd(''); setEmpId(''); }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.95em',
              transition: 'background-color 0.2s',
              ':hover': {
                backgroundColor: '#5a6268'
              }
            }}
          >
            Clear Filters
          </button>
          <button 
            onClick={exportCSV}
            disabled={loading}
            style={{
              padding: '10px 25px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.95em',
              transition: 'all 0.2s',
              opacity: loading ? 0.7 : 1,
              ':hover': {
                backgroundColor: '#218838',
                transform: loading ? 'none' : 'translateY(-1px)'
              },
              ':active': {
                transform: 'translateY(0)'
              }
            }}
          >
            {loading ? 'Generating...' : 'Export Report'}
          </button>
        </div>
      </div>
      
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ marginTop: 0, color: '#495057', borderBottom: '1px solid #e9ecef', paddingBottom: '10px' }}>Report Instructions</h3>
        <ul style={{
          color: '#6c757d',
          lineHeight: '1.6',
          paddingLeft: '20px',
          marginBottom: 0
        }}>
          <li>Select date range to filter the attendance records</li>
          <li>Optionally, filter by employee ID for specific user reports</li>
          <li>Click 'Export Report' to download the data in CSV format</li>
          <li>Use 'Clear Filters' to reset all selection criteria</li>
        </ul>
      </div>
    </div>
  );
}
