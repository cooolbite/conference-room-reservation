const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

/**
 * GET /api/v1/bookings
 * ดึงรายการการจองทั้งหมด
 */
router.get('/', bookingController.getAllBookings);

/**
 * GET /api/v1/bookings/:id
 * ดึงข้อมูลการจองตาม ID
 */
router.get('/:id', bookingController.getBookingById);

/**
 * POST /api/v1/bookings
 * สร้างการจองใหม่
 * Body: { roomId, userId, startTime, endTime, purpose? }
 */
router.post('/', bookingController.createBooking);

/**
 * PUT /api/v1/bookings/:id/cancel
 * ยกเลิกการจอง
 */
router.put('/:id/cancel', bookingController.cancelBooking);

module.exports = router;

