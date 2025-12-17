'use client';

import { useState, useEffect } from 'react';
import { fetchRooms, checkAvailability, fetchAvailableRooms } from '@/lib/api';
import Layout from '@/components/Layout';

export default function AvailabilityPage() {
  const [formData, setFormData] = useState({
    roomId: '',
    startTime: '',
    endTime: '',
  });
  const [rooms, setRooms] = useState<any[]>([]);
  const [checkResult, setCheckResult] = useState<any>(null);
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'room' | 'all'>('room');

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

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
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
    } catch (err: any) {
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
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการตรวจสอบความพร้อมใช้งาน');
      console.error('Error checking availability:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl">
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-medium tracking-tight mb-3">
            Check Availability
          </h1>
          <p className="text-sm text-gray-600">
            Check room availability for your desired time slot
          </p>
        </div>

        <div className="mb-8 flex gap-4">
          <button
            onClick={() => {
              setMode('room');
              setCheckResult(null);
              setAvailableRooms([]);
            }}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              mode === 'room'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            Check Single Room
          </button>
          <button
            onClick={() => {
              setMode('all');
              setCheckResult(null);
              setAvailableRooms([]);
            }}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              mode === 'all'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            Check All Rooms
          </button>
        </div>

        {mode === 'room' ? (
          <div className="space-y-6">
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

            <button
              onClick={handleCheckRoomAvailability}
              disabled={loading || !formData.roomId || !formData.startTime || !formData.endTime}
              className="px-6 py-3 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Checking...' : 'Check Availability'}
            </button>

            {checkResult && (
              <div className={`p-4 border ${
                checkResult.available 
                  ? 'bg-green-50 border-green-200 text-green-900' 
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}>
                <p className="font-medium mb-1">
                  {checkResult.available ? '✓ Room Available' : '✗ Room Not Available'}
                </p>
                {checkResult.message && <p className="text-sm">{checkResult.message}</p>}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
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

            <button
              onClick={handleCheckAllRooms}
              disabled={loading || !formData.startTime || !formData.endTime}
              className="px-6 py-3 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Checking...' : 'Check All Rooms'}
            </button>

            {availableRooms.length > 0 && (
              <div className="p-4 bg-gray-50 border border-gray-200">
                <p className="text-sm font-medium mb-3">
                  Available Rooms ({availableRooms.length} {availableRooms.length === 1 ? 'room' : 'rooms'}):
                </p>
                <ul className="space-y-2">
                  {availableRooms.map(room => (
                    <li key={room.id} className="text-sm text-gray-600">
                      <strong className="text-gray-900">{room.name}</strong> - Capacity: {room.capacity} {room.capacity === 1 ? 'person' : 'people'}
                      {room.hasProjector && <span className="ml-2 text-gray-500">• Projector</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {availableRooms.length === 0 && !loading && formData.startTime && formData.endTime && (
              <p className="text-sm text-gray-500">
                No rooms available for this time slot
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="mt-6 text-sm text-red-600">
            <p className="font-medium mb-1">Error</p>
            <p className="text-gray-500">{error}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

