'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchRoomById, updateRoom } from '@/lib/api';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function EditRoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.id as string;

  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    equipment: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        capacity: room.capacity?.toString() || '',
        equipment: room.equipment && Array.isArray(room.equipment) 
          ? room.equipment.join(', ') 
          : '',
      });
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลห้องประชุม');
      console.error('Error loading room:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
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
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการแก้ไขห้องประชุม');
      console.error('Error updating room:', err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="py-12">
          <div className="text-sm text-gray-700 font-medium">Loading room data...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl">
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-3 text-gray-900">
            Edit Room
          </h1>
          <p className="text-sm text-gray-700">
            Update meeting room information
          </p>
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-700">
            <p className="font-semibold mb-1">Error</p>
            <p className="text-gray-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Room Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter room name"
              className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-gray-600 transition-colors placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Capacity (people) *
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              min="1"
              placeholder="Enter capacity"
              className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-gray-600 transition-colors placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Equipment (comma separated)
            </label>
            <input
              type="text"
              name="equipment"
              value={formData.equipment}
              onChange={handleChange}
              placeholder="e.g., Projector, Whiteboard, Microphone"
              className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-gray-600 transition-colors placeholder:text-gray-400"
            />
            <p className="text-xs text-gray-600 mt-1">Separate multiple items with commas</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link href="/rooms" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}

