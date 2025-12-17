'use client';

import { useEffect, useState } from 'react';
import { fetchRooms, deleteRoom } from '@/lib/api';
import Link from 'next/link';

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRooms();
  }, []);

  async function loadRooms() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRooms();
      setRooms(data);
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลห้องประชุม');
      console.error('Error loading rooms:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(roomId) {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบห้องประชุมนี้?')) {
      return;
    }

    try {
      await deleteRoom(roomId);
      await loadRooms(); // โหลดข้อมูลใหม่
      alert('ลบห้องประชุมสำเร็จ');
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการลบห้องประชุม: ' + err.message);
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{ marginRight: '1rem' }}>← กลับหน้าแรก</Link>
        <h1 style={{ display: 'inline-block', margin: 0 }}>จัดการห้องประชุม</h1>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <Link href="/rooms/create" style={{ 
          padding: '0.5rem 1rem', 
          backgroundColor: '#0070f3', 
          color: 'white', 
          textDecoration: 'none',
          borderRadius: '4px',
          display: 'inline-block'
        }}>
          + สร้างห้องประชุมใหม่
        </Link>
      </div>

      {loading && <p>กำลังโหลดข้อมูล...</p>}
      
      {error && (
        <div style={{ color: 'red', marginTop: '1rem' }}>
          <p><strong>เกิดข้อผิดพลาด:</strong> {error}</p>
        </div>
      )}
      
      {!loading && !error && (
        <div>
          {rooms.length === 0 ? (
            <p>ยังไม่มีห้องประชุม</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0' }}>
                  <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>ชื่อห้อง</th>
                  <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>ความจุ</th>
                  <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>อุปกรณ์</th>
                  <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{room.name}</td>
                    <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{room.capacity} คน</td>
                    <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                      {room.equipment && room.equipment.length > 0 
                        ? room.equipment.join(', ') 
                        : 'ไม่มี'}
                    </td>
                    <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                      <Link href={`/rooms/${room.id}/edit`} style={{ marginRight: '0.5rem', color: '#0070f3' }}>
                        แก้ไข
                      </Link>
                      <button 
                        onClick={() => handleDelete(room.id)}
                        style={{ 
                          backgroundColor: '#dc3545', 
                          color: 'white', 
                          border: 'none', 
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

