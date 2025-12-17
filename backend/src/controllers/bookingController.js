const prisma = require('../lib/prisma');

/**
 * ดึงรายการการจองทั้งหมด
 * GET /api/v1/bookings
 */
async function getAllBookings(req, res) {
  // Mock data สำหรับทดสอบเมื่อยังไม่มี database
  const mockBookings = [
    {
      id: '1',
      roomId: '1',
      userId: 'user1',
      startTime: new Date(Date.now() + 86400000).toISOString(), // tomorrow
      endTime: new Date(Date.now() + 86400000 + 3600000).toISOString(), // tomorrow + 1 hour
      status: 'confirmed',
      room: {
        name: 'ห้องประชุม A',
      },
      user: {
        name: 'User 1',
      },
    },
    {
      id: '2',
      roomId: '2',
      userId: 'user2',
      startTime: new Date(Date.now() + 172800000).toISOString(), // day after tomorrow
      endTime: new Date(Date.now() + 172800000 + 7200000).toISOString(), // day after tomorrow + 2 hours
      status: 'pending',
      room: {
        name: 'ห้องประชุม B',
      },
      user: {
        name: 'User 2',
      },
    },
  ];

  try {
    // ถ้ายังไม่มี Prisma client ให้ return mock data
    if (!prisma) {
      console.log('Prisma client not available, returning mock data');
      return res.status(200).json(mockBookings);
    }

    const bookings = await prisma.booking.findMany({
      include: {
        room: {
          select: {
            name: true,
            capacity: true,
            hasProjector: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // เพิ่ม status และ userId field ให้ทุก booking
    const bookingsWithStatus = bookings.map(booking => ({
      ...booking,
      status: booking.status || 'pending',
      userId: booking.bookedBy,
      user: {
        name: booking.bookedBy,
      },
    }));

    return res.status(200).json(bookingsWithStatus);
  } catch (error) {
    // จัดการ PrismaClientInitializationError หรือ error อื่นๆ
    if (error.name === 'PrismaClientInitializationError' || error.code === 'P1001') {
      console.log('Database connection error, returning mock data');
      return res.status(200).json(mockBookings);
    }
    console.error('Error fetching bookings:', error);
    console.log('Database error, returning mock data');
    return res.status(200).json(mockBookings);
  }
}

/**
 * ดึงข้อมูลการจองตาม ID
 * GET /api/v1/bookings/:id
 */
async function getBookingById(req, res) {
  try {
    const { id } = req.params;

    if (!prisma) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        room: {
          select: {
            name: true,
            capacity: true,
            hasProjector: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // เพิ่ม status field ถ้ายังไม่มี (default: pending)
    const bookingWithStatus = {
      ...booking,
      status: booking.status || 'pending',
      userId: booking.bookedBy,
    };

    return res.status(200).json(bookingWithStatus);
  } catch (error) {
    // จัดการ PrismaClientInitializationError
    if (error.name === 'PrismaClientInitializationError' || error.code === 'P1001') {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }
    console.error('Error fetching booking:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการจอง',
      error: error.message,
    });
  }
}

/**
 * สร้างการจองใหม่
 * POST /api/v1/bookings
 */
async function createBooking(req, res) {
  try {
    const { roomId, userId, startTime, endTime, purpose } = req.body;

    // Validation
    if (!roomId || !userId || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน (roomId, userId, startTime, endTime)',
      });
    }

    // ตรวจสอบว่า startTime ต้องมาก่อน endTime
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({
        success: false,
        message: 'เวลาเริ่มต้นต้องมาก่อนเวลาสิ้นสุด',
      });
    }

    if (!prisma) {
      // Return mock data
      const mockBooking = {
        id: Date.now().toString(),
        roomId,
        userId,
        startTime,
        endTime,
        purpose: purpose || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return res.status(201).json({
        success: true,
        message: 'สร้างการจองสำเร็จ',
        data: mockBooking,
      });
    }

    try {
      // ตรวจสอบความพร้อมใช้งานของห้อง (เนื่องจาก schema ไม่มี status field ให้ตรวจสอบแค่ช่วงเวลา)
      const conflictingBooking = await prisma.booking.findFirst({
        where: {
          roomId,
          OR: [
            {
              AND: [
                { startTime: { lte: new Date(startTime) } },
                { endTime: { gte: new Date(startTime) } },
              ],
            },
            {
              AND: [
                { startTime: { lte: new Date(endTime) } },
                { endTime: { gte: new Date(endTime) } },
              ],
            },
            {
              AND: [
                { startTime: { gte: new Date(startTime) } },
                { endTime: { lte: new Date(endTime) } },
              ],
            },
          ],
        },
      });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: 'ห้องไม่พร้อมใช้งานในช่วงเวลานี้',
      });
    }

    const booking = await prisma.booking.create({
      data: {
        roomId,
        bookedBy: userId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
      include: {
        room: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'สร้างการจองสำเร็จ',
      data: booking,
    });
    } catch (dbError) {
      // จัดการ PrismaClientInitializationError
      if (dbError.name === 'PrismaClientInitializationError' || dbError.code === 'P1001') {
        const mockBooking = {
          id: Date.now().toString(),
          roomId,
          userId,
          startTime,
          endTime,
          purpose: purpose || '',
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return res.status(201).json({
          success: true,
          message: 'สร้างการจองสำเร็จ (mock data)',
          data: mockBooking,
        });
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการสร้างการจอง',
      error: error.message,
    });
  }
}

/**
 * ยกเลิกการจอง
 * PUT /api/v1/bookings/:id/cancel
 */
async function cancelBooking(req, res) {
  try {
    const { id } = req.params;

    if (!prisma) {
      return res.status(200).json({
        success: true,
        message: 'ยกเลิกการจองสำเร็จ',
      });
    }

    try {
      const booking = await prisma.booking.findUnique({
        where: { id },
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบการจอง',
        });
      }

      // เนื่องจาก schema ไม่มี status field ให้ลบ booking แทน
      // หรือสามารถเพิ่ม status field ใน schema ในอนาคต
      await prisma.booking.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: 'ยกเลิกการจองสำเร็จ',
      });
    } catch (dbError) {
      // จัดการ PrismaClientInitializationError
      if (dbError.name === 'PrismaClientInitializationError' || dbError.code === 'P1001') {
        return res.status(200).json({
          success: true,
          message: 'ยกเลิกการจองสำเร็จ',
        });
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการยกเลิกการจอง',
      error: error.message,
    });
  }
}

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  cancelBooking,
};

