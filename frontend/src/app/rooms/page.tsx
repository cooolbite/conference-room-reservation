'use client';

import { useEffect, useState } from 'react';
import { fetchRooms, deleteRoom } from '@/lib/api';
import Link from 'next/link';
import Layout from '@/components/Layout';

interface MeetingRoom {
  id: string;
  name: string;
  capacity: number;
  hasProjector: boolean;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<MeetingRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  async function loadRooms() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRooms();
      setRooms(data);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลห้องประชุม');
      console.error('Error loading rooms:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(roomId: string) {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบห้องประชุมนี้?')) {
      return;
    }

    try {
      await deleteRoom(roomId);
      await loadRooms();
      alert('ลบห้องประชุมสำเร็จ');
    } catch (err: any) {
      alert('เกิดข้อผิดพลาดในการลบห้องประชุม: ' + err.message);
    }
  }

  return (
    <Layout>
      <div>
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-3 text-gray-900">
            Manage Rooms
          </h1>
          <p className="text-sm text-gray-700">
            Create, edit, and manage meeting rooms
          </p>
        </div>

        <div className="mb-8">
          <Link 
            href="/rooms/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            + Create New Room
          </Link>
        </div>

        {loading && (
          <div className="py-12">
            <div className="text-sm text-gray-500">Loading rooms...</div>
          </div>
        )}
        
        {error && (
          <div className="py-12">
            <div className="text-sm text-red-600">
              <p className="font-medium mb-1">Error</p>
              <p className="text-gray-500">{error}</p>
            </div>
          </div>
        )}
        
        {!loading && !error && (
          <div>
            {rooms.length === 0 ? (
              <div className="py-12">
                <p className="text-sm text-gray-500">No rooms available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="border border-gray-300 rounded-lg p-6 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold tracking-tight text-gray-900">
                        {room.name}
                      </h3>
                      {room.isAvailable && (
                        <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded uppercase tracking-wider">
                          Available
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-700 mb-5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">Capacity:</span>
                        <span className="text-gray-700">{room.capacity} {room.capacity === 1 ? 'person' : 'people'}</span>
                      </div>
                      
                      {room.hasProjector && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span className="text-gray-700">Projector available</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 pt-2 border-t border-gray-200">
                      <Link 
                        href={`/rooms/${room.id}/edit`}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        Edit →
                      </Link>
                      <button 
                        onClick={() => handleDelete(room.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

