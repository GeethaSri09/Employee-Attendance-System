import React, {useEffect, useState} from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function EmployeeDashboard(){
  const [records,setRecords]=useState([]);
  const [summary,setSummary]=useState(null);
  const [loading,setLoading]=useState(false);

  useEffect(()=>{ fetchAll(); },[]);

  const fetchAll = async ()=>{
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const hist = await axios.get(import.meta.env.VITE_API_URL + "/api/attendance/my-history", { headers: { Authorization: "Bearer "+token }});
      const sum = await axios.get(import.meta.env.VITE_API_URL + "/api/attendance/my-summary", { headers: { Authorization: "Bearer "+token }});
      setRecords(hist.data || []);
      setSummary(sum.data || null);
    } catch (e) { console.error(e) } finally { setLoading(false) }
  };

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#2d3748', margin: 0 }}>Employee Dashboard</h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link 
            to="/mark" 
            style={{
              padding: '8px 16px',
              backgroundColor: '#4299e1',
              color: 'white',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'background-color 0.2s',
              ':hover': {
                backgroundColor: '#3182ce'
              }
            }}
          >
            Mark Attendance
          </Link>
          <Link 
            to="/attendance-history" 
            style={{
              padding: '8px 16px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              textDecoration: 'none',
              color: '#4a5568',
              fontWeight: '500',
              transition: 'all 0.2s',
              ':hover': {
                backgroundColor: '#f7fafc',
                borderColor: '#cbd5e0'
              }
            }}
          >
            View History
          </Link>
        </div>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {[
          { title: 'Present Days', value: summary?.present || 0, color: '#38a169' },
          { title: 'Absent Days', value: summary?.absent || 0, color: '#e53e3e' },
          { title: 'Late Arrivals', value: summary?.late || 0, color: '#dd6b20' },
          { 
            title: 'Total Hours', 
            value: summary ? Number(summary.totalHours).toFixed(2) : '0.00',
            color: '#3182ce',
            unit: 'hrs'
          }
        ].map((item, index) => (
          <div key={index} style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{
              color: '#718096',
              fontSize: '14px',
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              {item.title}
            </div>
            <div style={{
              color: item.color,
              fontSize: '24px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {item.value}
              {item.unit && <span style={{ fontSize: '14px', color: '#718096' }}>{item.unit}</span>}
            </div>
          </div>
        ))}
      </div>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: 0, color: '#2d3748' }}>Recent Attendance</h3>
          <span style={{
            fontSize: '14px',
            color: '#718096',
            backgroundColor: '#f7fafc',
            padding: '4px 10px',
            borderRadius: '12px',
            fontWeight: '500'
          }}>
            Last 7 Days
          </span>
        </div>
        
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '40px 0',
            color: '#718096'
          }}>
            Loading attendance records...
          </div>
        ) : records.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 0',
            color: '#a0aec0',
            border: '1px dashed #e2e8f0',
            borderRadius: '8px',
            backgroundColor: '#f8fafc'
          }}>
            No attendance records found
          </div>
        ) : (
          <div style={{
            overflowX: 'auto',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: '#f7fafc',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    color: '#4a5568',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>Date</th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    color: '#4a5568',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>Check In</th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    color: '#4a5568',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>Check Out</th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    color: '#4a5568',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>Hours</th>
                </tr>
              </thead>
              <tbody>
                {records.slice(0, 7).map((record, index) => (
                  <tr 
                    key={record._id}
                    style={{
                      borderBottom: index === records.length - 1 ? 'none' : '1px solid #edf2f7',
                      ':hover': {
                        backgroundColor: '#f8fafc'
                      }
                    }}
                  >
                    <td style={{
                      padding: '14px 16px',
                      color: '#2d3748',
                      fontWeight: '500',
                      whiteSpace: 'nowrap'
                    }}>
                      {record.date}
                    </td>
                    <td style={{
                      padding: '14px 16px',
                      color: record.checkInTime ? '#2d3748' : '#a0aec0',
                      fontFamily: 'monospace',
                      whiteSpace: 'nowrap'
                    }}>
                      {record.checkInTime || '—'}
                    </td>
                    <td style={{
                      padding: '14px 16px',
                      color: record.checkOutTime ? '#2d3748' : '#a0aec0',
                      fontFamily: 'monospace',
                      whiteSpace: 'nowrap'
                    }}>
                      {record.checkOutTime || '—'}
                    </td>
                    <td style={{
                      padding: '14px 16px',
                      textAlign: 'right',
                      color: '#4299e1',
                      fontWeight: '600',
                      fontFamily: 'monospace',
                      whiteSpace: 'nowrap'
                    }}>
                      {record.totalHours ? Number(record.totalHours).toFixed(2) : '0.00'} <span style={{ color: '#a0aec0', fontWeight: 'normal' }}>hrs</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
