'use client';

import { useState, useEffect } from 'react';
import { fetchRooms, fetchAvailableRooms, createBooking } from '@/lib/api';
import Link from 'next/link';

export default function BookingPage() {
  const [rooms, setRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [formData, setFormData] = useState({
    roomId: '',
    userId: '',
    startTime: '',
    endTime: '',
    purpose: '',
  });
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadRooms();
  }, []);

  async function loadRooms() {
    try {
      const data = await fetchRooms();
      setRooms(data);
    } catch (err) {
      console.error('Error loading rooms:', err);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleCheckAvailability() {
    if (!formData.startTime || !formData.endTime) {
      alert('กรุณาเลือกวันที่และเวลาเริ่มต้นและสิ้นสุด');
      return;
    }

    try {
      setCheckingAvailability(true);
      setError(null);
      const data = await fetchAvailableRooms(formData.startTime, formData.endTime);
      setAvailableRooms(data);
      
      if (data.length === 0) {
        alert('ไม่มีห้องที่พร้อมใช้งานในช่วงเวลานี้');
      }
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการตรวจสอบความพร้อมใช้งาน');
      console.error('Error checking availability:', err);
    } finally {
      setCheckingAvailability(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await createBooking(formData);
      setSuccess('จองห้องประชุมสำเร็จ');
      // รีเซ็ตฟอร์ม
      setFormData({
        roomId: '',
        userId: '',
        startTime: '',
        endTime: '',
        purpose: '',
      });
      setAvailableRooms([]);
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการจองห้องประชุม');
      console.error('Error creating booking:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{ marginRight: '1rem' }}>← กลับหน้าแรก</Link>
        <h1 style={{ display: 'inline-block', margin: 0 }}>จองห้องประชุม</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            ผู้ใช้ (User ID) *
          </label>
          <input
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
            placeholder="กรุณากรอก User ID"
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            วันที่และเวลาเริ่มต้น *
          </label>
          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            วันที่และเวลาสิ้นสุด *
          </label>
          <input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <button
            type="button"
            onClick={handleCheckAvailability}
            disabled={checkingAvailability || !formData.startTime || !formData.endTime}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: checkingAvailability ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: checkingAvailability ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              marginBottom: '1rem'
            }}
          >
            {checkingAvailability ? 'กำลังตรวจสอบ...' : 'ตรวจสอบความพร้อมใช้งาน'}
          </button>

          {availableRooms.length > 0 && (
            <div style={{ 
              backgroundColor: '#e7f3ff', 
              padding: '1rem', 
              borderRadius: '4px',
              marginBottom: '1rem'
            }}>
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>ห้องที่พร้อมใช้งาน:</p>
              <ul>
                {availableRooms.map(room => (
                  <li key={room.id}>
                    {room.name} (ความจุ: {room.capacity} คน)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            เลือกห้องประชุม *
          </label>
          <select
            name="roomId"
            value={formData.roomId}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          >
            <option value="">-- เลือกห้องประชุม --</option>
            {rooms.map(room => (
              <option key={room.id} value={room.id}>
                {room.name} (ความจุ: {room.capacity} คน)
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            วัตถุประสงค์
          </label>
          <textarea
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            rows="4"
            placeholder="ระบุวัตถุประสงค์ในการใช้ห้องประชุม"
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {error && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>
            <p><strong>เกิดข้อผิดพลาด:</strong> {error}</p>
          </div>
        )}

        {success && (
          <div style={{ color: 'green', marginBottom: '1rem' }}>
            <p><strong>{success}</strong></p>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: loading ? '#ccc' : '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              marginRight: '0.5rem'
            }}
          >
            {loading ? 'กำลังจอง...' : 'จองห้องประชุม'}
          </button>
          <Link href="/" style={{ color: '#666' }}>ยกเลิก</Link>
        </div>
      </form>
    </div>
  );
}

