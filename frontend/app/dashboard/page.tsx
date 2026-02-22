'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import TaskModal from '@/components/TaskModal';
import { Calendar, ChevronLeft, ChevronRight, Check, Clock, Users, Search, Plus, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

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
    <div className="min-h-screen bg-[#F5F1E8]">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <Search size={20} className="text-gray-400" />
          <input
            type="search"
            placeholder="Search tasks..."
            className="flex-1 outline-none text-sm"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-[#F4D03F] hover:bg-[#E8C12F] text-black px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm">
            <Plus size={18} />
            New task
          </button>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Tasks</h3>
            <p className="text-4xl font-bold">0</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Completed</h3>
            <p className="text-4xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Pending</h3>
            <p className="text-4xl font-bold text-orange-600">0</p>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-xl shadow-sm">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-bold">My Tasks</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Filter by status:</span>
              <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#F4D03F]">
                <option>All</option>
                <option>Todo</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
          </div>

          {/* Empty State */}
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">No tasks yet</h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first task. Click the "New task"<br />
              button to begin organizing your work.
            </p>
            <button className="bg-[#F4D03F] hover:bg-[#E8C12F] text-black px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors">
              <Plus size={20} />
              Create your first task
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
