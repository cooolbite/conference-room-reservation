'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchRoomById, updateRoom } from '@/lib/api';
import Link from 'next/link';

export default function EditRoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.id;

  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    equipment: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRoom();
  }, [roomId]);

  async function loadRoom() {
    try {
      setLoading(true);
      setError(null);
      const room = await fetchRoomById(roomId);
      setFormData({
        name: room.name || '',
        capacity: room.capacity || '',
        equipment: room.equipment && Array.isArray(room.equipment) 
          ? room.equipment.join(', ') 
          : '',
      });
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลห้องประชุม');
      console.error('Error loading room:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const equipmentArray = formData.equipment
        ? formData.equipment.split(',').map(item => item.trim()).filter(item => item)
        : [];

      const roomData = {
        name: formData.name,
        capacity: parseInt(formData.capacity),
        equipment: equipmentArray,
      };

      await updateRoom(roomId, roomData);
      alert('แก้ไขห้องประชุมสำเร็จ');
      router.push('/rooms');
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการแก้ไขห้องประชุม');
      console.error('Error updating room:', err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
        <p>กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '600px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/rooms" style={{ marginRight: '1rem' }}>← กลับ</Link>
        <h1 style={{ display: 'inline-block', margin: 0 }}>แก้ไขห้องประชุม</h1>
      </div>

      {error && !loading && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          <p><strong>เกิดข้อผิดพลาด:</strong> {error}</p>
        </div>
      )}

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

        <div>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: saving ? '#ccc' : '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              marginRight: '0.5rem'
            }}
          >
            {saving ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
          </button>
          <Link href="/rooms" style={{ color: '#666' }}>ยกเลิก</Link>
        </div>
      </form>
    </div>
  );
}

