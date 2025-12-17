'use client';

import Link from 'next/link';
import RoomList from '@/components/RoomList';
import Layout from '@/components/Layout';

export default function HomePage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="mb-24 lg:mb-32">
        <div className="max-w-3xl">
          <h1 className="text-5xl lg:text-6xl font-semibold tracking-tighter mb-6 leading-tight text-gray-900">
            Meeting Room Booking System
          </h1>
          <p className="text-lg text-gray-700 mb-12 leading-relaxed">
            จองห้องประชุมได้อย่างง่ายดาย พร้อมระบบจัดการที่ทันสมัยและใช้งานสะดวก
          </p>
          <Link 
            href="/booking"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Book a Room
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Rooms Section */}
      <section>
        <RoomList />
      </section>
    </Layout>
  );
}

