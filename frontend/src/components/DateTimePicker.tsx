'use client';

import { useState, useRef, useEffect } from 'react';
import DatePicker from './DatePicker';

interface DateTimePickerProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}

export default function DateTimePicker({ name, value, onChange, required, className }: DateTimePickerProps) {
  const [dateValue, setDateValue] = useState('');
  const [timeValue, setTimeValue] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const timePickerRef = useRef<HTMLDivElement>(null);

  // สร้างช่วงเวลา 30 นาที (08:00 - 18:00) = 11 ชั่วโมง = 22 slots
  const timeSlots = Array.from({ length: 22 }, (_, i) => {
    const hour = 8 + Math.floor(i / 2); // เริ่มจาก 8
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  useEffect(() => {
    if (value) {
      const [date, time] = value.split('T');
      setDateValue(date || '');
      setTimeValue(time ? time.substring(0, 5) : '');
    } else {
      setDateValue('');
      setTimeValue('');
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setShowTimePicker(false);
      }
    }

    if (showTimePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTimePicker]);

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newDate = e.target.value;
    setDateValue(newDate);
    updateDateTime(newDate, timeValue);
  }

  function handleTimeSelect(time: string) {
    setTimeValue(time);
    updateDateTime(dateValue, time);
    setShowTimePicker(false);
  }

  function updateDateTime(date: string, time: string) {
    if (date && time) {
      const syntheticEvent = {
        target: {
          name,
          value: `${date}T${time}:00`,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    } else if (date) {
      // ถ้าเลือกแค่วันที่ ให้ส่งค่าวันที่พร้อมเวลา 00:00
      const syntheticEvent = {
        target: {
          name,
          value: `${date}T00:00:00`,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    } else {
      // ถ้ายังไม่ได้เลือก ให้ส่งค่าว่าง
      const syntheticEvent = {
        target: {
          name,
          value: '',
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  }

  return (
    <div className="relative">
      <div className="flex gap-2">
        {/* Date Input */}
        <div className="flex-1">
          <DatePicker
            name={`${name}_date`}
            value={dateValue}
            onChange={handleDateChange}
            required={required}
            className={className}
          />
        </div>
        
        {/* Time Input */}
        <div className="relative flex-1">
          <input
            type="text"
            name={`${name}_time`}
            value={timeValue}
            readOnly
            onClick={() => setShowTimePicker(!showTimePicker)}
            placeholder="HH:MM"
            required={required && !!dateValue}
            className={`w-full px-4 py-3 pr-10 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-gray-600 transition-colors cursor-pointer ${className}`}
          />
          <svg 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          
          {/* Time Picker Dropdown */}
          {showTimePicker && (
            <div
              ref={timePickerRef}
              className="absolute z-50 mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto"
            >
              <div className="p-3">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                  Select Time (08:00 - 18:00, 30-min intervals)
                </div>
                <div className="grid grid-cols-4 gap-1.5 max-h-64 overflow-y-auto">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleTimeSelect(time)}
                      className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
                        timeValue === time
                          ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                          : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name={name}
        value={dateValue && timeValue ? `${dateValue}T${timeValue}:00` : ''}
      />
    </div>
  );
}

