import React, {useEffect, useState} from "react";
import axios from "axios";

export default function AllEmployees(){
  const [records, setRecords] = useState([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [empId, setEmpId] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ fetch(); },[]);

  const fetch = async (q={})=>{
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if ((q.start !== undefined ? q.start : start)) params.set('start', q.start || start);
      if ((q.end !== undefined ? q.end : end)) params.set('end', q.end || end);
      if ((q.empId !== undefined ? q.empId : empId)) params.set('employeeId', q.empId || empId);
      if ((q.status !== undefined ? q.status : status)) params.set('status', q.status || status);
      const query = params.toString() ? '?'+params.toString() : '';
      const res = await axios.get(import.meta.env.VITE_API_URL + "/api/attendance/all" + query, { headers: { Authorization: "Bearer "+token }});
      setRecords(res.data || []);
    } catch (e){ console.error(e) } finally { setLoading(false) }
  };

  const onSearch = () => fetch({ start, end, empId, status });

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2>All Employees Attendance</h2>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        marginBottom: '25px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div style={{ minWidth: '180px', flex: '1' }}>
          <label style={{
            display: 'block',
            marginBottom: '6px',
            fontWeight: '500',
            color: '#495057',
            fontSize: '0.9em'
          }}>Start Date</label>
          <input 
            type="date" 
            value={start} 
            onChange={e=>setStart(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '0.9em'
            }}
          />
        </div>
        
        <div style={{ minWidth: '180px', flex: '1' }}>
          <label style={{
            display: 'block',
            marginBottom: '6px',
            fontWeight: '500',
            color: '#495057',
            fontSize: '0.9em'
          }}>End Date</label>
          <input 
            type="date" 
            value={end} 
            onChange={e=>setEnd(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '0.9em'
            }}
          />
        </div>
        
        <div style={{ minWidth: '180px', flex: '1' }}>
          <label style={{
            display: 'block',
            marginBottom: '6px',
            fontWeight: '500',
            color: '#495057',
            fontSize: '0.9em'
          }}>Employee ID</label>
          <input 
            placeholder="EMP001" 
            value={empId} 
            onChange={e=>setEmpId(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '0.9em'
            }}
          />
        </div>
        
        <div style={{ minWidth: '180px', flex: '1' }}>
          <label style={{
            display: 'block',
            marginBottom: '6px',
            fontWeight: '500',
            color: '#495057',
            fontSize: '0.9em'
          }}>Status</label>
          <select 
            value={status} 
            onChange={e=>setStatus(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              backgroundColor: 'white',
              fontSize: '0.9em',
              height: '36px'
            }}
          >
            <option value=''>All Status</option>
            <option value='present'>Present</option>
            <option value='absent'>Absent</option>
            <option value='late'>Late</option>
            <option value='half-day'>Half-day</option>
          </select>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          alignItems: 'flex-end',
          minWidth: '200px',
          flex: '1'
        }}>
          <button 
            onClick={onSearch}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9em',
              flex: '1',
              transition: 'background-color 0.2s',
              ':hover': {
                backgroundColor: '#0069d9'
              }
            }}
          >
            Apply 
          </button>
          
          <button 
            onClick={()=>{
              setStart(''); 
              setEnd(''); 
              setEmpId(''); 
              setStatus('');
              fetch({start:'',end:'',empId:'',status:''});
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9em',
              flex: '1',
              transition: 'background-color 0.2s',
              ':hover': {
                backgroundColor: '#5a6268'
              }
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {loading ? <div>Loading...</div> : (
        <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        margin: '20px 0',
        fontSize: '0.9em',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
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
              <th style={{ padding: '12px 15px' }}>Dept</th>
              <th style={{ padding: '12px 15px' }}>Check In</th>
              <th style={{ padding: '12px 15px' }}>Check Out</th>
              <th style={{ padding: '12px 15px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr 
                key={r._id}
                style={{
                  borderBottom: '1px solid #dddddd',
                  transition: 'all 0.3s',
                  ':hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                <td style={{ padding: '12px 15px', borderRight: '1px solid #e0e0e0' }}>{r.date}</td>
                <td style={{ padding: '12px 15px', borderRight: '1px solid #e0e0e0' }}>{r.userId?.name} ({r.userId?.employeeId})</td>
                <td style={{ padding: '12px 15px', borderRight: '1px solid #e0e0e0' }}>{r.userId?.department}</td>
                <td style={{ padding: '12px 15px', borderRight: '1px solid #e0e0e0' }}>{r.checkInTime||'—'}</td>
                <td style={{ padding: '12px 15px', borderRight: '1px solid #e0e0e0' }}>{r.checkOutTime||'—'}</td>
                <td style={{ padding: '12px 15px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: r.status === 'present' ? '#d4edda' : 
                                    r.status === 'absent' ? '#f8d7da' : 
                                    r.status === 'late' ? '#fff3cd' : '#e2e3e5',
                    color: r.status === 'present' ? '#155724' : 
                           r.status === 'absent' ? '#721c24' : 
                           r.status === 'late' ? '#856404' : '#383d41',
                    fontWeight: '500',
                    fontSize: '0.85em'
                  }}>
                    {r.status || '—'}
                  </span>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td 
                  colSpan={6} 
                  style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#6c757d',
                    fontStyle: 'italic'
                  }}
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

