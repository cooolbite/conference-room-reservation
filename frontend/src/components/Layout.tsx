'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          <nav className="flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold tracking-tight text-gray-900 hover:text-gray-700 transition-colors">
              Meeting Room
            </Link>
            <div className="flex items-center gap-8">
              <Link 
                href="/rooms"
                className={`text-sm font-semibold transition-colors ${
                  pathname === '/rooms' ? 'text-gray-900 border-b-2 border-gray-900 pb-1' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Rooms
              </Link>
              <Link 
                href="/booking"
                className={`text-sm font-semibold transition-colors ${
                  pathname === '/booking' ? 'text-gray-900 border-b-2 border-gray-900 pb-1' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Booking
              </Link>
              <Link 
                href="/availability"
                className={`text-sm font-semibold transition-colors ${
                  pathname === '/availability' ? 'text-gray-900 border-b-2 border-gray-900 pb-1' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Availability
              </Link>
              <Link 
                href="/bookings"
                className={`text-sm font-semibold transition-colors ${
                  pathname === '/bookings' ? 'text-gray-900 border-b-2 border-gray-900 pb-1' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                My Bookings
              </Link>
              <Link 
                href="/daily"
                className={`text-sm font-semibold transition-colors ${
                  pathname === '/daily' ? 'text-gray-900 border-b-2 border-gray-900 pb-1' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Daily View
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <div className="text-sm font-medium mb-2">Meeting Room Booking System</div>
              <div className="text-xs text-gray-500">© 2024 All rights reserved.</div>
            </div>
            <div className="flex gap-8">
              <Link href="/rooms" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">
                Rooms
              </Link>
              <Link href="/booking" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">
                Booking
              </Link>
              <Link href="/availability" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">
                Availability
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

