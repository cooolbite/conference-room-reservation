/**
 * API Utility Functions
 * ฟังก์ชัน utility สำหรับการ Fetch ข้อมูลจาก API
 */

// Base URL จาก environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

/**
 * สร้าง URL แบบเต็มสำหรับ API endpoint
 * @param {string} endpoint - API endpoint path (เช่น /api/health)
 * @returns {string} Full URL
 */
function getApiUrl(endpoint) {
  // ลบ slash ซ้ำถ้ามี
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const cleanBaseUrl = API_BASE_URL.endsWith('/') 
    ? API_BASE_URL.slice(0, -1) 
    : API_BASE_URL;
  
  return `${cleanBaseUrl}${cleanEndpoint}`;
}

/**
 * ฟังก์ชันสำหรับ Fetch ข้อมูลจาก API พร้อมจัดการ error
 * @param {string} endpoint - API endpoint path
 * @param {RequestInit} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<Response>} Response object
 */
async function fetchApi(endpoint, options = {}) {
  const url = getApiUrl(endpoint);
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * ฟังก์ชันสำหรับเรียก Health Check API
 * @returns {Promise<Object>} Health check response (status และ service)
 */
export async function fetchHealthCheck() {
  try {
    const endpoint = process.env.NEXT_PUBLIC_API_HEALTH_CHECK || '/api/health';
    const response = await fetchApi(endpoint, {
      method: 'GET',
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Health Check Error:', error);
    throw error;
  }
}

// ==================== การจัดการห้องประชุม (CRUD) ====================

/**
 * ดึงรายการห้องประชุมทั้งหมด
 * @returns {Promise<Array>} รายการห้องประชุม
 */
export async function fetchRooms() {
  try {
    const response = await fetchApi('/api/v1/rooms', {
      method: 'GET',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch Rooms Error:', error);
    throw error;
  }
}

/**
 * ดึงข้อมูลห้องประชุมตาม ID
 * @param {string|number} roomId - ID ของห้องประชุม
 * @returns {Promise<Object>} ข้อมูลห้องประชุม
 */
export async function fetchRoomById(roomId) {
  try {
    const response = await fetchApi(`/api/v1/rooms/${roomId}`, {
      method: 'GET',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch Room By ID Error:', error);
    throw error;
  }
}

/**
 * สร้างห้องประชุมใหม่
 * @param {Object} roomData - ข้อมูลห้องประชุม { name, capacity, equipment }
 * @returns {Promise<Object>} ข้อมูลห้องประชุมที่สร้างแล้ว
 */
export async function createRoom(roomData) {
  try {
    const response = await fetchApi('/api/v1/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Create Room Error:', error);
    throw error;
  }
}

/**
 * แก้ไขข้อมูลห้องประชุม
 * @param {string|number} roomId - ID ของห้องประชุม
 * @param {Object} roomData - ข้อมูลห้องประชุมที่ต้องการแก้ไข
 * @returns {Promise<Object>} ข้อมูลห้องประชุมที่แก้ไขแล้ว
 */
export async function updateRoom(roomId, roomData) {
  try {
    const response = await fetchApi(`/api/v1/rooms/${roomId}`, {
      method: 'PUT',
      body: JSON.stringify(roomData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Update Room Error:', error);
    throw error;
  }
}

/**
 * ลบห้องประชุม
 * @param {string|number} roomId - ID ของห้องประชุม
 * @returns {Promise<Object>} ผลลัพธ์การลบ
 */
export async function deleteRoom(roomId) {
  try {
    const response = await fetchApi(`/api/v1/rooms/${roomId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Delete Room Error:', error);
    throw error;
  }
}

// ==================== การจองห้องประชุม ====================

/**
 * สร้างการจองห้องประชุม
 * @param {Object} bookingData - ข้อมูลการจอง { roomId, userId, startTime, endTime, purpose }
 * @returns {Promise<Object>} ข้อมูลการจองที่สร้างแล้ว
 */
export async function createBooking(bookingData) {
  try {
    const response = await fetchApi('/api/v1/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
    const data = await response.json();
    // ถ้า response มี data property ให้ return data แทน
    return data.data || data;
  } catch (error) {
    console.error('Create Booking Error:', error);
    throw error;
  }
}

/**
 * ดึงรายการการจองทั้งหมด
 * @returns {Promise<Array>} รายการการจอง
 */
export async function fetchBookings() {
  try {
    const response = await fetchApi('/api/v1/bookings', {
      method: 'GET',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch Bookings Error:', error);
    throw error;
  }
}

/**
 * ดึงข้อมูลการจองตาม ID
 * @param {string|number} bookingId - ID ของการจอง
 * @returns {Promise<Object>} ข้อมูลการจอง
 */
export async function fetchBookingById(bookingId) {
  try {
    const response = await fetchApi(`/api/v1/bookings/${bookingId}`, {
      method: 'GET',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch Booking By ID Error:', error);
    throw error;
  }
}

// ==================== การตรวจสอบความพร้อมใช้งาน ====================

/**
 * ตรวจสอบความพร้อมใช้งานของห้องประชุม
 * @param {string|number} roomId - ID ของห้องประชุม
 * @param {string} startTime - เวลาเริ่มต้น (ISO format)
 * @param {string} endTime - เวลาสิ้นสุด (ISO format)
 * @returns {Promise<Object>} ผลลัพธ์การตรวจสอบ { available: boolean, message?: string }
 */
export async function checkAvailability(roomId, startTime, endTime) {
  try {
    const response = await fetchApi('/api/availability/check', {
      method: 'POST',
      body: JSON.stringify({ roomId, startTime, endTime }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Check Availability Error:', error);
    throw error;
  }
}

/**
 * ดึงรายการห้องที่พร้อมใช้งานในช่วงเวลาที่กำหนด
 * @param {string} startTime - เวลาเริ่มต้น (ISO format)
 * @param {string} endTime - เวลาสิ้นสุด (ISO format)
 * @returns {Promise<Array>} รายการห้องที่พร้อมใช้งาน
 */
export async function fetchAvailableRooms(startTime, endTime) {
  try {
    const response = await fetchApi('/api/availability/rooms', {
      method: 'POST',
      body: JSON.stringify({ startTime, endTime }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch Available Rooms Error:', error);
    throw error;
  }
}

// ==================== การยกเลิกการจอง ====================

/**
 * ยกเลิกการจอง
 * @param {string|number} bookingId - ID ของการจอง
 * @returns {Promise<Object>} ผลลัพธ์การยกเลิก
 */
export async function cancelBooking(bookingId) {
  try {
    const response = await fetchApi(`/api/v1/bookings/${bookingId}/cancel`, {
      method: 'PUT',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Cancel Booking Error:', error);
    throw error;
  }
}

// ==================== การยืนยันตัวตน (Optional) ====================

/**
 * ลงทะเบียนผู้ใช้ใหม่
 * @param {Object} userData - ข้อมูลผู้ใช้ { email, password, name }
 * @returns {Promise<Object>} ข้อมูลผู้ใช้ที่ลงทะเบียนแล้ว
 */
export async function register(userData) {
  try {
    const response = await fetchApi('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Register Error:', error);
    throw error;
  }
}

/**
 * เข้าสู่ระบบ
 * @param {Object} credentials - ข้อมูลเข้าสู่ระบบ { email, password }
 * @returns {Promise<Object>} ข้อมูลผู้ใช้และ token
 */
export async function login(credentials) {
  try {
    const response = await fetchApi('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login Error:', error);
    throw error;
  }
}

/**
 * ออกจากระบบ
 * @returns {Promise<Object>} ผลลัพธ์การออกจากระบบ
 */
export async function logout() {
  try {
    const response = await fetchApi('/api/auth/logout', {
      method: 'POST',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Logout Error:', error);
    throw error;
  }
}

export default {
  fetchApi,
  fetchHealthCheck,
  getApiUrl,
  // Rooms
  fetchRooms,
  fetchRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  // Bookings
  createBooking,
  fetchBookings,
  fetchBookingById,
  // Availability
  checkAvailability,
  fetchAvailableRooms,
  // Cancel
  cancelBooking,
  // Auth
  register,
  login,
  logout,
};

