const prisma = require('../lib/prisma');

/**
 * ดึงรายการห้องประชุมทั้งหมด
 * GET /api/v1/rooms
 */
async function getAllRooms(req, res) {
  // Mock data สำหรับทดสอบเมื่อยังไม่มี database
  const mockRooms = [
    {
      id: '1',
      name: 'ห้องประชุม A',
      capacity: 20,
      hasProjector: true,
      isAvailable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'ห้องประชุม B',
      capacity: 15,
      hasProjector: false,
      isAvailable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'ห้องประชุม C',
      capacity: 30,
      hasProjector: true,
      isAvailable: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  try {
    // ถ้ายังไม่มี Prisma client ให้ return mock data
    if (!prisma) {
      console.log('Prisma client not available, returning mock data');
      return res.status(200).json(mockRooms);
    }

    const rooms = await prisma.meetingRoom.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    
    // ถ้ายังไม่มี database connection ให้ return mock data
    console.log('Database error, returning mock data');
    return res.status(200).json(mockRooms);
  }
}

/**
 * สร้างห้องประชุมใหม่
 * POST /api/v1/rooms
 */
async function createRoom(req, res) {
  try {
    const { name, capacity, hasProjector, isAvailable } = req.body;

    // Validation
    if (!name || !capacity) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกชื่อห้องและความจุให้ครบถ้วน',
      });
    }

    if (typeof capacity !== 'number' || capacity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'ความจุต้องเป็นตัวเลขที่มากกว่า 0',
      });
    }

    // สร้างห้องประชุมใหม่
    const room = await prisma.meetingRoom.create({
      data: {
        name: name.trim(),
        capacity: parseInt(capacity),
        hasProjector: hasProjector || false,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'สร้างห้องประชุมสำเร็จ',
      data: room,
    });
  } catch (error) {
    console.error('Error creating room:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการสร้างห้องประชุม',
      error: error.message,
    });
  }
}

module.exports = {
  getAllRooms,
  createRoom,
};

