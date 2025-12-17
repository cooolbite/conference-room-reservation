const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

/**
 * GET /api/v1/rooms
 * ดึงรายการห้องประชุมทั้งหมด
 */
router.get('/', roomController.getAllRooms);

/**
 * POST /api/v1/rooms
 * สร้างห้องประชุมใหม่
 * Body: { name, capacity, hasProjector?, isAvailable? }
 */
router.post('/', roomController.createRoom);

module.exports = router;

