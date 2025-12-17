'use client';

import { useEffect, useState } from 'react';
import { fetchHealthCheck } from '@/lib/api';
import Link from 'next/link';

export default function HomePage() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadHealthCheck() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchHealthCheck();
        setHealthData(data);
      } catch (err) {
        setError(err.message || 'เกิดข้อผิดพลาดในการเรียก API');
        console.error('Error loading health check:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHealthCheck();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Meeting Room Booking System</h1>
      <h2>Health Check Status</h2>
      
      {loading && <p>กำลังโหลดข้อมูล...</p>}
      
      {error && (
        <div style={{ color: 'red', marginTop: '1rem' }}>
          <p><strong>เกิดข้อผิดพลาด:</strong> {error}</p>
        </div>
      )}
      
      {healthData && !loading && (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>Status:</strong> {healthData.status || 'N/A'}</p>
          <p><strong>Service:</strong> {healthData.service || 'N/A'}</p>
          {healthData.message && (
            <p><strong>Message:</strong> {healthData.message}</p>
          )}
        </div>
      )}

      <div style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h2>เมนูหลัก</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <Link href="/rooms" style={{ 
            padding: '1rem', 
            backgroundColor: '#0070f3', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            🏢 จัดการห้องประชุม (CRUD)
          </Link>
          
          <Link href="/booking" style={{ 
            padding: '1rem', 
            backgroundColor: '#28a745', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            📅 จองห้องประชุม
          </Link>
          
          <Link href="/availability" style={{ 
            padding: '1rem', 
            backgroundColor: '#ffc107', 
            color: 'black', 
            textDecoration: 'none',
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            🔍 ตรวจสอบความพร้อมใช้งาน
          </Link>
          
          <Link href="/bookings" style={{ 
            padding: '1rem', 
            backgroundColor: '#17a2b8', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            📋 รายการการจอง
          </Link>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <Link href="/auth/login" style={{ 
              flex: 1,
              padding: '0.75rem', 
              backgroundColor: '#6c757d', 
              color: 'white', 
              textDecoration: 'none',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              🔐 เข้าสู่ระบบ
            </Link>
            
            <Link href="/auth/register" style={{ 
              flex: 1,
              padding: '0.75rem', 
              backgroundColor: '#6c757d', 
              color: 'white', 
              textDecoration: 'none',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              ✍️ ลงทะเบียน
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}

