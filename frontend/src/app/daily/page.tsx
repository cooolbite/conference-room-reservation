'use client';

import { useState, useEffect } from 'react';
import { fetchRooms, fetchBookings } from '@/lib/api';
import Layout from '@/components/Layout';
import DatePicker from '@/components/DatePicker';
import { formatDate, formatDateTime, formatDateWithWeekday, formatTime } from '@/lib/dateUtils';

interface Booking {
  id: string;
  roomId: string;
  userId: string;
  startTime: string;
  endTime: string;
  status?: string;
  room?: {
    name: string;
  };
}

interface MeetingRoom {
  id: string;
  name: string;
  capacity: number;
}

export default function DailyViewPage() {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [rooms, setRooms] = useState<MeetingRoom[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);

  // สร้างช่วงเวลารายชั่วโมง ตั้งแต่ 8:00 - 18:00 (11 ชั่วโมง)
  const timeSlots = Array.from({ length: 11 }, (_, i) => {
    const hour = 8 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      
      const [roomsData, bookingsData] = await Promise.all([
        fetchRooms(),
        fetchBookings(),
      ]);
      
      setRooms(roomsData);
      
      // กรอง bookings เฉพาะวันที่เลือก
      const selectedDateObj = new Date(selectedDate);
      const filteredBookings = bookingsData.filter((booking: Booking) => {
        const bookingDate = new Date(booking.startTime);
        return (
          bookingDate.getFullYear() === selectedDateObj.getFullYear() &&
          bookingDate.getMonth() === selectedDateObj.getMonth() &&
          bookingDate.getDate() === selectedDateObj.getDate()
        );
      });
      
      setBookings(filteredBookings);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }

  function getBookingForSlot(roomId: string, timeSlot: string): Booking | null {
    const slotTime = new Date(`${selectedDate}T${timeSlot}:00`);
    const nextSlotTime = new Date(slotTime.getTime() + 30 * 60 * 1000);
    
    return bookings.find((booking) => {
      if (booking.roomId !== roomId) return false;
      
      const startTime = new Date(booking.startTime);
      const endTime = new Date(booking.endTime);
      
      // ตรวจสอบว่าช่วงเวลานี้อยู่ในช่วงการจองหรือไม่
      return startTime < nextSlotTime && endTime > slotTime;
    }) || null;
  }


  function getBookingStartSlot(booking: Booking): number {
    const startTime = new Date(booking.startTime);
    const startHour = startTime.getHours();
    // คำนวณ slot จากชั่วโมง (8-18)
    const slotIndex = startHour - 8;
    return Math.max(0, Math.min(timeSlots.length - 1, slotIndex));
  }

  function getBookingEndSlot(booking: Booking): number {
    const endTime = new Date(booking.endTime);
    const endHour = endTime.getHours();
    const endMinute = endTime.getMinutes();
    // ถ้ามีนาที ให้นับเป็นชั่วโมงถัดไป
    const slotIndex = endMinute > 0 ? endHour - 8 + 1 : endHour - 8;
    return Math.min(timeSlots.length, Math.max(1, slotIndex));
  }

  function getBookingSpan(booking: Booking): number {
    const startSlot = getBookingStartSlot(booking);
    const endSlot = getBookingEndSlot(booking);
    return Math.max(1, endSlot - startSlot);
  }

  function goToPreviousDay() {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  }

  function goToNextDay() {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + 1);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  }

  function goToToday() {
    const today = new Date();
    setSelectedDate(today.toISOString().split('T')[0]);
  }

  return (
    <Layout>
      <div>
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-3 text-gray-900">
            Daily Schedule
          </h1>
          <p className="text-sm text-gray-700 mb-6">
            View room bookings by day and time slot
          </p>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Date Navigation Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousDay}
                  className="px-4 py-2 bg-gray-200 text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                  title="Previous Day"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="hidden sm:inline">Previous</span>
                </button>
                
                <button
                  onClick={goToToday}
                  className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                  title="Today"
                >
                  Today
                </button>
                
                <button
                  onClick={goToNextDay}
                  className="px-4 py-2 bg-gray-200 text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                  title="Next Day"
                >
                  <span className="hidden sm:inline">Next</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Date Input */}
              <div className="flex-1">
                <DatePicker
                  name="selectedDate"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                  label="Select Date"
                />
              </div>

              {/* Selected Date Display */}
              <div className="flex items-end">
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">Selected:</span>{' '}
                  {formatDateWithWeekday(selectedDate, 'en')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="py-12">
            <div className="text-sm text-gray-700 font-medium">Loading schedule...</div>
          </div>
        )}

        {error && (
          <div className="py-12">
            <div className="text-sm text-red-700">
              <p className="font-semibold mb-1">Error</p>
              <p className="text-gray-700">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="w-full shadow-sm border border-gray-300 rounded-lg overflow-hidden">
            <table className="w-full border-collapse bg-white table-fixed">
              <thead className="bg-gray-50">
                <tr className="border-b-2 border-gray-300">
                  <th className="w-32 px-3 py-3 text-left text-xs font-semibold text-gray-900 border-r border-gray-300">
                    Room
                  </th>
                  {timeSlots.map((time) => (
                    <th
                      key={time}
                      className="px-2 py-3 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 last:border-r-0"
                    >
                      {time}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => {
                  const roomBookings = bookings
                    .filter((b) => b.roomId === room.id)
                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
                  
                  const slotBookings: (Booking | null)[] = new Array(timeSlots.length).fill(null);
                  const slotSpans: number[] = new Array(timeSlots.length).fill(1);
                  
                  // จัดการ bookings ให้แสดงใน slot ที่ถูกต้อง
                  roomBookings.forEach((booking) => {
                    const startSlot = getBookingStartSlot(booking);
                    const span = getBookingSpan(booking);
                    
                    if (startSlot < timeSlots.length) {
                      slotBookings[startSlot] = booking;
                      slotSpans[startSlot] = span;
                      
                      // เคลียร์ slots ที่ถูกครอบคลุม
                      for (let i = startSlot + 1; i < startSlot + span && i < timeSlots.length; i++) {
                        slotBookings[i] = null;
                        slotSpans[i] = 0;
                      }
                    }
                  });
                  
                  return (
                    <tr key={room.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="w-32 px-3 py-3 text-sm font-semibold text-gray-900 border-r border-gray-300">
                        <div>
                          <div className="font-semibold text-gray-900 text-xs">{room.name}</div>
                          <div className="text-xs text-gray-600 mt-0.5">
                            {room.capacity} {room.capacity === 1 ? 'person' : 'people'}
                          </div>
                        </div>
                      </td>
                      {timeSlots.map((timeSlot, index) => {
                        const booking = slotBookings[index];
                        const span = slotSpans[index];
                        
                        if (span === 0) {
                          return null; // Skip slot ที่ถูกครอบคลุม
                        }
                        
                        if (booking) {
                          return (
                            <td
                              key={timeSlot}
                              colSpan={span}
                              className="px-1 py-1 border-r border-gray-200 align-top last:border-r-0"
                            >
                              <div
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowModal(true);
                                }}
                                className="bg-blue-100 border-l-4 border-blue-500 rounded-r px-2 py-2 text-xs h-full hover:bg-blue-200 transition-colors cursor-pointer group relative"
                                title={`${formatTime(booking.startTime)} - ${formatTime(booking.endTime)} | User: ${booking.userId}`}
                              >
                                <div className="font-semibold text-blue-900 mb-0.5 truncate">
                                  {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                                </div>
                                <div className="text-blue-700 text-xs font-medium truncate">
                                  {booking.userId}
                                </div>
                              </div>
                            </td>
                          );
                        }
                        
                        return (
                          <td
                            key={timeSlot}
                            className="px-1 py-1 border-r border-gray-200 bg-white hover:bg-gray-50 transition-colors last:border-r-0"
                          />
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

         {!loading && !error && bookings.length === 0 && rooms.length > 0 && (
           <div className="py-12 text-center border border-gray-300 rounded-lg bg-gray-50">
             <p className="text-sm text-gray-700 font-medium">
               No bookings found for{' '}
               <span className="font-semibold text-gray-900">
                 {formatDateWithWeekday(selectedDate, 'en')}
               </span>
             </p>
           </div>
         )}

        {!loading && !error && rooms.length > 0 && bookings.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">{bookings.length}</span> booking{bookings.length !== 1 ? 's' : ''} found
            </p>
          </div>
        )}

        {/* Booking Detail Modal */}
        {showModal && selectedBooking && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">Booking Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Room</label>
                  <p className="text-sm text-gray-900 font-medium mt-1">
                    {selectedBooking.room?.name || `Room ID: ${selectedBooking.roomId}`}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Booked By</label>
                  <p className="text-sm text-gray-900 font-medium mt-1">{selectedBooking.userId}</p>
                </div>

                 <div>
                   <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Start Time</label>
                   <p className="text-sm text-gray-900 font-medium mt-1">
                     {formatDateTime(selectedBooking.startTime)}
                   </p>
                 </div>

                 <div>
                   <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">End Time</label>
                   <p className="text-sm text-gray-900 font-medium mt-1">
                     {formatDateTime(selectedBooking.endTime)}
                   </p>
                 </div>

                {selectedBooking.status && (
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</label>
                    <p className="text-sm text-gray-900 font-medium mt-1 capitalize">{selectedBooking.status}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

