'use client';

import { useState, useRef, useEffect } from 'react';

interface DatePickerProps {
  name: string;
  value: string; // Format: YYYY-MM-DD
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  label?: string;
}

export default function DatePicker({ name, value, onChange, required, className, label }: DatePickerProps) {
  const [displayValue, setDisplayValue] = useState('');
  const dateInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  // Convert YYYY-MM-DD to DD/MM/YYYY for display
  function formatDisplayDate(dateString: string): string {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    return '';
  }

  // Convert DD/MM/YYYY to YYYY-MM-DD
  function parseDisplayDate(displayString: string): string {
    if (!displayString) return '';
    // Remove any non-digit characters except /
    const cleaned = displayString.replace(/[^\d/]/g, '');
    const parts = cleaned.split('/').filter(p => p);
    
    if (parts.length === 3) {
      const [day, month, year] = parts;
      if (day && month && year) {
        // Validate and format
        const d = parseInt(day, 10);
        const m = parseInt(month, 10);
        const y = parseInt(year, 10);
        
        if (d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= 1900 && y <= 2100) {
          return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        }
      }
    } else if (parts.length === 2) {
      // Partial input: DD/MM
      const [day, month] = parts;
      if (day && month) {
        const d = parseInt(day, 10);
        const m = parseInt(month, 10);
        if (d >= 1 && d <= 31 && m >= 1 && m <= 12) {
          // Don't update yet, wait for full input
          return '';
        }
      }
    }
    return '';
  }

  useEffect(() => {
    if (value) {
      setDisplayValue(formatDisplayDate(value));
    } else {
      setDisplayValue('');
    }
  }, [value]);

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);
    
    // Try to parse and update the date input
    const parsed = parseDisplayDate(inputValue);
    if (parsed && dateInputRef.current) {
      dateInputRef.current.value = parsed;
      const syntheticEvent = {
        target: {
          name,
          value: parsed,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  }

  function handleTextBlur() {
    // Validate and format on blur
    if (displayValue) {
      const parsed = parseDisplayDate(displayValue);
      if (parsed) {
        setDisplayValue(formatDisplayDate(parsed));
        if (dateInputRef.current) {
          dateInputRef.current.value = parsed;
        }
        const syntheticEvent = {
          target: {
            name,
            value: parsed,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      } else {
        // If invalid, revert to original value
        if (value) {
          setDisplayValue(formatDisplayDate(value));
        } else {
          setDisplayValue('');
        }
      }
    }
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e);
    // Update display value
    if (e.target.value) {
      setDisplayValue(formatDisplayDate(e.target.value));
    } else {
      setDisplayValue('');
    }
  }

  function handleCalendarClick() {
    dateInputRef.current?.showPicker?.();
  }

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {/* Text input for DD/MM/YYYY display */}
        <input
          ref={textInputRef}
          type="text"
          value={displayValue}
          onChange={handleTextChange}
          onBlur={handleTextBlur}
          placeholder="DD/MM/YYYY"
          required={required}
          className={`w-full px-4 py-2 pr-12 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-gray-600 transition-colors placeholder:text-gray-400 ${className}`}
        />
        
        {/* Hidden native date picker */}
        <input
          ref={dateInputRef}
          type="date"
          name={name}
          value={value}
          onChange={handleDateChange}
          required={required}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          style={{ colorScheme: 'dark' }}
        />
        
        {/* Calendar icon button */}
        <button
          type="button"
          onClick={handleCalendarClick}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors pointer-events-auto z-10"
          tabIndex={-1}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

