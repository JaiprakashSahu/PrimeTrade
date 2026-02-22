import React from 'react';
import { Check, Edit2, Trash2 } from 'lucide-react';

// Task type definition
export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const isCompleted = task.status === 'completed';

  // Format due date
  const formatDueDate = (dateString?: string) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Reset time for comparison
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    if (date.getTime() === today.getTime()) {
      return { text: 'Today', isUrgent: true };
    } else if (date.getTime() === tomorrow.getTime()) {
      return { text: 'Tomorrow', isUrgent: true };
    } else {
      return { 
        text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
        isUrgent: false 
      };
    }
  };

  const dueDate = formatDueDate(task.dueDate);

  // Status badge styles
  const getStatusStyle = (status: TaskStatus) => {
    switch (status) {
      case 'in-progress':
        return 'bg-[#F4D03F] text-black';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'todo':
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  // Status display text
  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case 'in-progress':
        return 'In progress';
      case 'completed':
        return 'Completed';
      case 'todo':
      default:
        return 'Not started';
    }
  };

  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 mb-2 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 hover:shadow-md transition-shadow cursor-pointer group">
      {/* Mobile: Top row with checkbox, title, and actions */}
      <div className="flex items-start gap-3 w-full sm:w-auto sm:flex-1">
        {/* Checkbox */}
        <div 
          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0 ${
            isCompleted ? 'border-[#F4D03F] bg-[#F4D03F]' : 'border-gray-300'
          }`}
        >
          {isCompleted && <Check size={14} className="sm:w-4 sm:h-4 text-black" />}
        </div>

        {/* Task Title and Description */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm sm:text-base font-medium truncate ${isCompleted ? 'line-through text-gray-400' : 'text-[#2C2C2C]'}`}>
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs sm:text-sm text-[#6B6B6B] truncate mt-0.5 sm:mt-1">
              {task.description}
            </p>
          )}
        </div>

        {/* Mobile: Action Buttons (always visible on mobile) */}
        <div className="flex sm:hidden items-center gap-1 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Edit task"
          >
            <Edit2 size={16} className="text-[#6B6B6B]" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task._id);
            }}
            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete task"
          >
            <Trash2 size={16} className="text-red-500" />
          </button>
        </div>
      </div>

      {/* Mobile: Bottom row with due date and status */}
      <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 w-full sm:w-auto pl-8 sm:pl-0">
        {/* Due Date */}
        {dueDate && (
          <span className={`text-xs sm:text-sm flex-shrink-0 ${dueDate.isUrgent ? 'text-orange-500 font-medium' : 'text-[#6B6B6B]'}`}>
            {dueDate.text}
          </span>
        )}

        {/* Status Badge */}
        <span className={`px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-medium rounded-full flex-shrink-0 ${getStatusStyle(task.status)}`}>
          {getStatusText(task.status)}
        </span>
      </div>

      {/* Desktop: Action Buttons (hover to show) */}
      <div className="hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Edit task"
        >
          <Edit2 size={18} className="text-[#6B6B6B]" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task._id);
          }}
          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Delete task"
        >
          <Trash2 size={18} className="text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
