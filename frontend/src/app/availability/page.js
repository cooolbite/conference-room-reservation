'use client';

import { useState, useEffect } from 'react';
import { fetchRooms, checkAvailability, fetchAvailableRooms } from '@/lib/api';
import Link from 'next/link';

export default function AvailabilityPage() {
  const [formData, setFormData] = useState({
    roomId: '',
    startTime: '',
    endTime: '',
  });
  const [rooms, setRooms] = useState([]);
  const [checkResult, setCheckResult] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('room'); // 'room' หรือ 'all'

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

  async function handleCheckRoomAvailability() {
    if (!formData.roomId || !formData.startTime || !formData.endTime) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setCheckResult(null);
      
      const result = await checkAvailability(
        formData.roomId,
        formData.startTime,
        formData.endTime
      );
      
      setCheckResult(result);
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการตรวจสอบความพร้อมใช้งาน');
      console.error('Error checking availability:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckAllRooms() {
    if (!formData.startTime || !formData.endTime) {
      alert('กรุณาเลือกวันที่และเวลาเริ่มต้นและสิ้นสุด');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setAvailableRooms([]);
      
      const data = await fetchAvailableRooms(formData.startTime, formData.endTime);
      setAvailableRooms(data);
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการตรวจสอบความพร้อมใช้งาน');
      console.error('Error checking availability:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{ marginRight: '1rem' }}>← กลับหน้าแรก</Link>
        <h1 style={{ display: 'inline-block', margin: 0 }}>ตรวจสอบความพร้อมใช้งาน</h1>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => {
            setMode('room');
            setCheckResult(null);
            setAvailableRooms([]);
          }}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: mode === 'room' ? '#0070f3' : '#f0f0f0',
            color: mode === 'room' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            marginRight: '0.5rem'
          }}
        >
          ตรวจสอบห้องเดียว
        </button>
        <button
          onClick={() => {
            setMode('all');
            setCheckResult(null);
            setAvailableRooms([]);
          }}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: mode === 'all' ? '#0070f3' : '#f0f0f0',
            color: mode === 'all' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          ตรวจสอบทุกห้อง
        </button>
      </div>

      {mode === 'room' ? (
        <div>
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

          <button
            onClick={handleCheckRoomAvailability}
            disabled={loading || !formData.roomId || !formData.startTime || !formData.endTime}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: loading ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              marginBottom: '1rem'
            }}
          >
            {loading ? 'กำลังตรวจสอบ...' : 'ตรวจสอบความพร้อมใช้งาน'}
          </button>

          {checkResult && (
            <div style={{ 
              backgroundColor: checkResult.available ? '#d4edda' : '#f8d7da',
              padding: '1rem',
              borderRadius: '4px',
              marginTop: '1rem'
            }}>
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {checkResult.available ? '✓ ห้องพร้อมใช้งาน' : '✗ ห้องไม่พร้อมใช้งาน'}
              </p>
              {checkResult.message && <p>{checkResult.message}</p>}
            </div>
          )}
        </div>
      ) : (
        <div>
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

          <button
            onClick={handleCheckAllRooms}
            disabled={loading || !formData.startTime || !formData.endTime}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: loading ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              marginBottom: '1rem'
            }}
          >
            {loading ? 'กำลังตรวจสอบ...' : 'ตรวจสอบทุกห้อง'}
          </button>

          {availableRooms.length > 0 && (
            <div style={{ 
              backgroundColor: '#e7f3ff',
              padding: '1rem',
              borderRadius: '4px',
              marginTop: '1rem'
            }}>
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                ห้องที่พร้อมใช้งาน ({availableRooms.length} ห้อง):
              </p>
              <ul>
                {availableRooms.map(room => (
                  <li key={room.id} style={{ marginBottom: '0.5rem' }}>
                    <strong>{room.name}</strong> - ความจุ: {room.capacity} คน
                    {room.equipment && room.equipment.length > 0 && (
                      <span> - อุปกรณ์: {room.equipment.join(', ')}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {availableRooms.length === 0 && !loading && formData.startTime && formData.endTime && (
            <p style={{ marginTop: '1rem', color: '#666' }}>
              ไม่มีห้องที่พร้อมใช้งานในช่วงเวลานี้
            </p>
          )}
        </div>
      )}

      {error && (
        <div style={{ color: 'red', marginTop: '1rem' }}>
          <p><strong>เกิดข้อผิดพลาด:</strong> {error}</p>
        </div>
      )}
    </div>
  );
}

