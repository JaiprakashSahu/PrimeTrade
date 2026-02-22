'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleCreateTask = () => {
    toast.info('Task creation feature coming soon!');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#F4D03F] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl font-bold">TF</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8] flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 p-6 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#F4D03F] rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">TF</span>
          </div>
          <span className="text-xl font-bold">TaskFlow</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          <div className="flex items-center gap-3 px-4 py-3 bg-[#F4D03F]/10 border-l-4 border-[#F4D03F] rounded-r-lg">
            <span className="text-lg">📊</span>
            <span className="font-medium">Dashboard</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg cursor-pointer">
            <span className="text-lg">✓</span>
            <span>My tasks</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg cursor-pointer">
            <span className="text-lg">🔔</span>
            <span>Notifications</span>
          </div>
        </nav>

        {/* Bottom section */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg cursor-pointer">
            <span className="text-lg">⚙️</span>
            <span>Settings</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
          >
            <LogOut size={20} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <input
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-96 px-4 py-2 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-[#F4D03F]"
          />
          <div className="flex items-center gap-4">
            <button 
              type="button"
              onClick={handleCreateTask}
              className="bg-[#F4D03F] hover:bg-[#E8C12F] text-black px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              New task
            </button>
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">{user.name.charAt(0).toUpperCase()}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-gray-600 text-sm font-medium mb-2">Total Tasks</h3>
              <p className="text-3xl font-bold">0</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-gray-600 text-sm font-medium mb-2">Completed</h3>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-gray-600 text-sm font-medium mb-2">Pending</h3>
              <p className="text-3xl font-bold text-orange-600">0</p>
            </div>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-[#F4D03F]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📝</span>
            </div>
            <h3 className="text-xl font-bold mb-2">No tasks yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first task</p>
            <button 
              type="button"
              onClick={handleCreateTask}
              className="bg-[#F4D03F] hover:bg-[#E8C12F] text-black px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Create your first task
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
