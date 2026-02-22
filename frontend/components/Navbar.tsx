'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutGrid, 
  CheckSquare, 
  Bell, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation items
  const navItems = [
    { name: 'Dashboard', icon: LayoutGrid, path: '/dashboard' },
    { name: 'My tasks', icon: CheckSquare, path: '/dashboard' },
    { name: 'Notifications', icon: Bell, path: '/notifications' },
  ];

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen w-64 sm:w-60 bg-white border-r border-gray-200 
          flex flex-col transition-transform duration-300 z-40
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#F4D03F] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs sm:text-sm font-bold text-black">TF</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-[#2C2C2C]">TaskFlow</span>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <p className="text-sm font-medium text-[#2C2C2C] truncate">{user.name}</p>
            <p className="text-xs text-[#6B6B6B] truncate">{user.email}</p>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 py-4 sm:py-6">
          <ul className="space-y-1 px-2 sm:px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg transition-colors text-sm sm:text-base
                      ${active 
                        ? 'bg-[#FEF9E7] text-[#2C2C2C] border-l-4 border-[#F4D03F] -ml-2 sm:-ml-3 pl-[4px] sm:pl-[8px]' 
                        : 'text-[#6B6B6B] hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon size={18} className={`sm:w-5 sm:h-5 ${active ? 'text-[#F4D03F]' : ''}`} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-gray-200 p-2 sm:p-3">
          <ul className="space-y-1">
            <li>
              <Link
                href="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-[#6B6B6B] hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                <Settings size={18} className="sm:w-5 sm:h-5" />
                <span className="font-medium">Settings</span>
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-[#6B6B6B] hover:bg-red-50 hover:text-red-600 transition-colors text-sm sm:text-base"
              >
                <LogOut size={18} className="sm:w-5 sm:h-5" />
                <span className="font-medium">Log out</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navbar;
