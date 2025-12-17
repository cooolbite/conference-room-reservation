'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRoom } from '@/lib/api';
import Link from 'next/link';

export default function CreateRoomPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    equipment: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // แปลง equipment จาก string เป็น array
      const equipmentArray = formData.equipment
        ? formData.equipment.split(',').map(item => item.trim()).filter(item => item)
        : [];

      const roomData = {
        name: formData.name,
        capacity: parseInt(formData.capacity),
        equipment: equipmentArray,
      };

      await createRoom(roomData);
      alert('สร้างห้องประชุมสำเร็จ');
      router.push('/rooms');
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการสร้างห้องประชุม');
      console.error('Error creating room:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '600px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/rooms" style={{ marginRight: '1rem' }}>← กลับ</Link>
        <h1 style={{ display: 'inline-block', margin: 0 }}>สร้างห้องประชุมใหม่</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            ชื่อห้อง *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
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
            ความจุ (คน) *
          </label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
            min="1"
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
            อุปกรณ์ (คั่นด้วย comma)
          </label>
          <input
            type="text"
            name="equipment"
            value={formData.equipment}
            onChange={handleChange}
            placeholder="เช่น โปรเจคเตอร์, ไวท์บอร์ด, ไมโครโฟน"
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
          <small style={{ color: '#666' }}>กรอกหลายรายการโดยคั่นด้วย comma</small>
        </div>

        {error && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>
            <p><strong>เกิดข้อผิดพลาด:</strong> {error}</p>
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
            {loading ? 'กำลังสร้าง...' : 'สร้างห้องประชุม'}
          </button>
          <Link href="/rooms" style={{ color: '#666' }}>ยกเลิก</Link>
        </div>
      </form>
    </div>
  );
}

