import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MarkAttendance() {
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchToday();
  }, []);

  const fetchToday = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      setLoading(true);
      const res = await axios.get(import.meta.env.VITE_API_URL + "/api/attendance/today", {
        headers: { Authorization: "Bearer " + token },
      });
      setToday(res.data || null);
    } catch (err) {
      console.error("fetchToday error:", err);
      setToday(null);
    } finally {
      setLoading(false);
    }
  };

  const checkIn = async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      await axios.post(import.meta.env.VITE_API_URL + "/api/attendance/checkin", {}, {
        headers: { Authorization: "Bearer " + token },
      });
      await fetchToday();
      alert("Checked in");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
      
      await fetchToday();
    } finally {
      setLoading(false);
    }
  };

  const checkOut = async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      await axios.post(import.meta.env.VITE_API_URL + "/api/attendance/checkout", {}, {
        headers: { Authorization: "Bearer " + token },
      });
      await fetchToday();
      alert("Checked out");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
      await fetchToday();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: '#2d3748', marginBottom: '8px' }}>Mark Attendance</h2>
        <p style={{ color: '#718096', margin: 0 }}>Record your daily attendance with a single click</p>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '32px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '20px',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '24px'
        }}>
          <div>
            <div style={{ color: '#718096', fontSize: '14px', marginBottom: '4px' }}>Today's Date</div>
            <div style={{ 
              fontSize: '20px', 
              fontWeight: '600',
              color: '#2d3748'
            }}>
              {today?.date ? new Date(today.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
          <div style={{
            backgroundColor: '#f7fafc',
            padding: '8px 12px',
            borderRadius: '9999px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#4a5568'
          }}>
            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div style={{ marginBottom: '32px' }}>
          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '120px',
              color: '#718096'
            }}>
              Loading...
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              {!today?.checkInTime ? (
                <button 
                  onClick={checkIn}
                  disabled={loading}
                  style={{
                    backgroundColor: '#4299e1',
                    color: 'white',
                    border: 'none',
                    padding: '12px 32px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    ':hover': {
                      backgroundColor: '#3182ce'
                    },
                    ':disabled': {
                      backgroundColor: '#cbd5e0',
                      cursor: 'not-allowed'
                    }
                  }}
                >
                  Check In
                </button>
              ) : today?.checkInTime && !today?.checkOutTime ? (
                <button 
                  onClick={checkOut}
                  disabled={loading}
                  style={{
                    backgroundColor: '#e53e3e',
                    color: 'white',
                    border: 'none',
                    padding: '12px 32px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    ':hover': {
                      backgroundColor: '#c53030'
                    },
                    ':disabled': {
                      backgroundColor: '#cbd5e0',
                      cursor: 'not-allowed'
                    }
                  }}
                >
                  Check Out
                </button>
              ) : (
                <div style={{
                  backgroundColor: '#38a169',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
                  </svg>
                  Attendance Completed
                </div>
              )}
            </div>
          )}
        </div>
        <div>
          <h3 style={{
            color: '#2d3748',
            fontSize: '18px',
            marginBottom: '16px',
            paddingBottom: '8px',
            borderBottom: '1px solid #e2e8f0'
          }}>
            Today's Record
          </h3>
          
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            padding: '16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px'
          }}>
            <div>
              <div style={{
                color: '#718096',
                fontSize: '14px',
                marginBottom: '4px'
              }}>
                Check In Time
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: '500',
                color: today?.checkInTime ? '#2d3748' : '#a0aec0',
                fontFamily: 'monospace'
              }}>
                {today?.checkInTime || '—'}
              </div>
            </div>
            
            <div>
              <div style={{
                color: '#718096',
                fontSize: '14px',
                marginBottom: '4px'
              }}>
                Check Out Time
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: '500',
                color: today?.checkOutTime ? '#2d3748' : '#a0aec0',
                fontFamily: 'monospace'
              }}>
                {today?.checkOutTime || '—'}
              </div>
            </div>
            
            <div>
              <div style={{
                color: '#718096',
                fontSize: '14px',
                marginBottom: '4px'
              }}>
                Total Hours
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#4299e1',
                fontFamily: 'monospace'
              }}>
                {today?.totalHours ? Number(today.totalHours).toFixed(2) : '0.00'} <span style={{ color: '#a0aec0', fontWeight: 'normal' }}>hrs</span>
              </div>
            </div>
            
            <div>
              <div style={{
                color: '#718096',
                fontSize: '14px',
                marginBottom: '4px'
              }}>
                Status
              </div>
              <div>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  backgroundColor: today?.status === 'present' ? '#ebf8f2' : 
                                  today?.status === 'absent' ? '#fff5f5' :
                                  today?.status === 'late' ? '#fffaf0' : '#f7fafc',
                  color: today?.status === 'present' ? '#2f855a' :
                         today?.status === 'absent' ? '#c53030' :
                         today?.status === 'late' ? '#c05621' : '#718096',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {today?.status || (today?.checkInTime ? 'Present' : 'Not marked')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

