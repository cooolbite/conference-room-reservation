'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchRooms } from '@/lib/api';

interface MeetingRoom {
  id: string;
  name: string;
  capacity: number;
  hasProjector: boolean;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function RoomList() {
  const [rooms, setRooms] = useState<MeetingRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRooms() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchRooms();
        setRooms(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูลห้องประชุม');
        console.error('Error fetching rooms:', err);
      } finally {
        setLoading(false);
      }
    }

    loadRooms();
  }, []);

  if (loading) {
    return (
      <div className="py-12">
        <div className="text-sm text-gray-700 font-medium">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="text-sm text-red-700">
          <p className="font-semibold mb-1">เกิดข้อผิดพลาด</p>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="py-12">
        <p className="text-sm text-gray-700 font-medium">ยังไม่มีห้องประชุม</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-12">
        <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-3 text-gray-900">
          Available Rooms
        </h2>
        <p className="text-sm text-gray-700">
          Showing {rooms.length} {rooms.length === 1 ? 'room' : 'rooms'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {rooms.map((room, index) => (
          <Link
            key={room.id}
            href={`/rooms/${room.id}`}
            className="group block"
          >
            <div className="border border-gray-300 rounded-lg p-6 bg-white hover:shadow-lg transition-all hover:border-gray-400">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                  {room.name}
                </h3>
                {room.isAvailable && (
                  <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded uppercase tracking-wider">
                    Available
                  </span>
                )}
              </div>
              
              <div className="space-y-2 text-sm text-gray-700 mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">Capacity:</span>
                  <span>{room.capacity} {room.capacity === 1 ? 'person' : 'people'}</span>
                </div>
                
                {room.hasProjector && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span>Projector available</span>
                  </div>
                )}
              </div>

              <div className="mt-4 text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                View details →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

