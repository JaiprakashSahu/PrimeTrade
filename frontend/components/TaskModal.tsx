'use client';

import { useState } from 'react';
import { X, Clock, Bell, Flag, Tag, User, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { taskAPI } from '@/lib/api';
import toast from 'react-hot-toast';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'completed']).default('todo'),
  dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TaskModal({ isOpen, onClose, onSuccess }: TaskModalProps) {
  const [selectedDay, setSelectedDay] = useState<'today' | 'tomorrow'>('today');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      await taskAPI.create(data);
      toast.success('Task created successfully!');
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-gray-100 rounded-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <input
              {...register('title')}
              type="text"
              placeholder="Name of task"
              className="text-xl font-semibold outline-none flex-1"
            />
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Day Selection */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={20} />
              <span className="text-sm">Day</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedDay('today')}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                  selectedDay === 'today'
                    ? 'bg-black text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setSelectedDay('tomorrow')}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                  selectedDay === 'tomorrow'
                    ? 'bg-black text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Tomorrow
              </button>
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Notification */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Bell size={20} />
              <span className="text-sm">Notification</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-4 py-1.5 rounded-full text-sm border border-gray-300 hover:bg-gray-50"
              >
                In 1 hour
              </button>
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Priority */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Flag size={20} />
              <span className="text-sm">Priority</span>
            </div>
            <button
              type="button"
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              <Plus size={16} />
              Add priority
            </button>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Tag size={20} />
              <span className="text-sm">Tags</span>
            </div>
            <button
              type="button"
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              <Plus size={16} />
              Add tags
            </button>
          </div>

          {/* Assign */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <User size={20} />
              <span className="text-sm">Assign</span>
            </div>
            <button
              type="button"
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              <Plus size={16} />
              Add assignee
            </button>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#F4D03F] resize-none"
              placeholder="Add a description..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#F4D03F] hover:bg-[#E8C12F] text-black px-8 py-2.5 rounded-lg font-medium transition-colors"
            >
              Create task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
