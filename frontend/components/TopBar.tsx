'use client';

import { Search, Plus, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface TopBarProps {
  onNewTask: () => void;
}

export default function TopBar({ onNewTask }: TopBarProps) {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <Search size={20} className="text-gray-400" />
        <input
          type="search"
          placeholder="Search"
          className="flex-1 outline-none text-sm bg-gray-50 px-4 py-2 rounded-lg"
        />
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onNewTask}
          className="bg-[#F4D03F] hover:bg-[#E8C12F] text-black px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm"
        >
          <Plus size={18} />
          New task
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Mail size={20} className="text-gray-600" />
        </button>
        <div className="w-10 h-10 bg-[#F4D03F] rounded-full flex items-center justify-center">
          <span className="text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
      </div>
    </header>
  );
}
