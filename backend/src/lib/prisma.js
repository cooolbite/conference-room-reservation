const { PrismaClient } = require('@prisma/client');

let prisma;

// ตรวจสอบว่ามี DATABASE_URL หรือไม่
if (process.env.DATABASE_URL) {
  try {
    prisma = new PrismaClient({
      log: ['error', 'warn'],
    });
  } catch (error) {
    console.error('Error initializing Prisma Client:', error);
    prisma = null;
  }
} else {
  console.log('DATABASE_URL not found, Prisma client will not be initialized');
  prisma = null;
}

module.exports = prisma;

