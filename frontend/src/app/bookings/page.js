'use client';

import { useEffect, useState } from 'react';
import { fetchBookings, cancelBooking } from '@/lib/api';
import Link from 'next/link';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBookings();
      setBookings(data);
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลการจอง');
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(bookingId) {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองนี้?')) {
      return;
    }

    try {
      await cancelBooking(bookingId);
      await loadBookings(); // โหลดข้อมูลใหม่
      alert('ยกเลิกการจองสำเร็จ');
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการยกเลิกการจอง: ' + err.message);
    }
  }

  function formatDateTime(dateTimeString) {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleString('th-TH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{ marginRight: '1rem' }}>← กลับหน้าแรก</Link>
        <h1 style={{ display: 'inline-block', margin: 0 }}>รายการการจอง</h1>
      </div>

      {loading && <p>กำลังโหลดข้อมูล...</p>}
      
      {error && (
        <div style={{ color: 'red', marginTop: '1rem' }}>
          <p><strong>เกิดข้อผิดพลาด:</strong> {error}</p>
        </div>
      )}
      
      {!loading && !error && (
        <div>
          {bookings.length === 0 ? (
            <p>ยังไม่มีการจอง</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0' }}>
                  <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>ห้องประชุม</th>
                  <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>ผู้ใช้</th>
                  <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>เวลาเริ่มต้น</th>
                  <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>เวลาสิ้นสุด</th>
                  <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>สถานะ</th>
                  <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{booking.id}</td>
                    <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                      {booking.room?.name || booking.roomId || 'N/A'}
                    </td>
                    <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                      {booking.user?.name || booking.userId || 'N/A'}
                    </td>
                    <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                      {formatDateTime(booking.startTime)}
                    </td>
                    <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                      {formatDateTime(booking.endTime)}
                    </td>
                    <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor: booking.status === 'cancelled' ? '#dc3545' : 
                                       booking.status === 'confirmed' ? '#28a745' : '#ffc107',
                        color: 'white',
                        fontSize: '0.875rem'
                      }}>
                        {booking.status === 'cancelled' ? 'ยกเลิกแล้ว' :
                         booking.status === 'confirmed' ? 'ยืนยันแล้ว' : 'รอยืนยัน'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                      {booking.status !== 'cancelled' && (
                        <button 
                          onClick={() => handleCancel(booking.id)}
                          style={{ 
                            backgroundColor: '#dc3545', 
                            color: 'white', 
                            border: 'none', 
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          ยกเลิก
                        </button>
                      )}
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

