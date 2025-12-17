'use client';

import { useEffect, useState } from 'react';
import { fetchBookings, cancelBooking } from '@/lib/api';
import Layout from '@/components/Layout';

interface Booking {
  id: string;
  roomId: string;
  userId: string;
  startTime: string;
  endTime: string;
  status: string;
  room?: {
    name: string;
  };
  user?: {
    name: string;
  };
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBookings();
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลการจอง');
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(bookingId: string) {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองนี้?')) {
      return;
    }

    try {
      await cancelBooking(bookingId);
      await loadBookings();
      alert('ยกเลิกการจองสำเร็จ');
    } catch (err: any) {
      alert('เกิดข้อผิดพลาดในการยกเลิกการจอง: ' + err.message);
    }
  }

  function formatDateTime(dateTimeString: string) {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <Layout>
      <div>
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-medium tracking-tight mb-3">
            My Bookings
          </h1>
          <p className="text-sm text-gray-600">
            View and manage your room bookings
          </p>
        </div>

        {loading && (
          <div className="py-12">
            <div className="text-sm text-gray-500">Loading bookings...</div>
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
            {bookings.length === 0 ? (
              <div className="py-12">
                <p className="text-sm text-gray-500">No bookings found</p>
              </div>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border-b border-gray-200 pb-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-medium tracking-tight mb-2">
                          {booking.room?.name || booking.roomId || 'Unknown Room'}
                        </h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>
                            <span className="font-medium">User:</span> {booking.user?.name || booking.userId || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Start:</span> {formatDateTime(booking.startTime)}
                          </div>
                          <div>
                            <span className="font-medium">End:</span> {formatDateTime(booking.endTime)}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-xs font-medium px-2 py-1 ${
                          booking.status === 'cancelled' 
                            ? 'bg-red-100 text-red-800' 
                            : booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status === 'cancelled' ? 'Cancelled' :
                           booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                        </span>
                        {booking.status !== 'cancelled' && (
                          <button 
                            onClick={() => handleCancel(booking.id)}
                            className="text-xs text-red-600 hover:text-red-800 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
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

