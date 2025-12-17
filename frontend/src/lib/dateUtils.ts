/**
 * Format date to dd/mm/yyyy format
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'N/A';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
}

/**
 * Format datetime to dd/mm/yyyy HH:mm format (24-hour)
 */
export function formatDateTime(dateTime: Date | string): string {
  const d = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
  if (isNaN(d.getTime())) return 'N/A';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Format date with weekday in Thai/English
 */
export function formatDateWithWeekday(date: Date | string, locale: 'en' | 'th' = 'en'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'N/A';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  const weekdayNames = {
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    th: ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'],
  };
  
  const weekday = weekdayNames[locale][d.getDay()];
  
  return `${weekday}, ${day}/${month}/${year}`;
}

/**
 * Format time to HH:mm format (24-hour)
 */
export function formatTime(dateTime: Date | string): string {
  const d = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
  if (isNaN(d.getTime())) return 'N/A';
  
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes}`;
}

