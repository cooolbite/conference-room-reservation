'use client';

import { useState, useEffect } from 'react';
import { fetchRooms, fetchAvailableRooms, createBooking } from '@/lib/api';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function BookingPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    roomId: '',
    userId: '',
    startTime: '',
    endTime: '',
    purpose: '',
  });
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
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
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการตรวจสอบความพร้อมใช้งาน');
      console.error('Error checking availability:', err);
    } finally {
      setCheckingAvailability(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await createBooking(formData);
      setSuccess('จองห้องประชุมสำเร็จ');
      setFormData({
        roomId: '',
        userId: '',
        startTime: '',
        endTime: '',
        purpose: '',
      });
      setAvailableRooms([]);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการจองห้องประชุม');
      console.error('Error creating booking:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl">
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-medium tracking-tight mb-3">
            Book a Room
          </h1>
          <p className="text-sm text-gray-600">
            Reserve a meeting room for your needs
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              User ID *
            </label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
              placeholder="Enter your User ID"
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Start Date & Time *
            </label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              End Date & Time *
            </label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
            />
          </div>

          <div>
            <button
              type="button"
              onClick={handleCheckAvailability}
              disabled={checkingAvailability || !formData.startTime || !formData.endTime}
              className="px-6 py-3 bg-gray-100 text-gray-900 text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkingAvailability ? 'Checking...' : 'Check Availability'}
            </button>

            {availableRooms.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200">
                <p className="text-sm font-medium mb-2">Available Rooms:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {availableRooms.map(room => (
                    <li key={room.id}>
                      {room.name} (Capacity: {room.capacity} {room.capacity === 1 ? 'person' : 'people'})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Select Room *
            </label>
            <select
              name="roomId"
              value={formData.roomId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
            >
              <option value="">-- Select a room --</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.name} (Capacity: {room.capacity} {room.capacity === 1 ? 'person' : 'people'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Purpose
            </label>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the purpose of this booking"
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors resize-none"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600">
              <p className="font-medium mb-1">Error</p>
              <p className="text-gray-500">{error}</p>
            </div>
          )}

          {success && (
            <div className="text-sm text-green-600">
              <p className="font-medium">{success}</p>
            </div>
          )}

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Booking...' : 'Book Room'}
            </button>
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}

