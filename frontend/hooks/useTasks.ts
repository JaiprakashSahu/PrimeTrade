import { useState, useCallback } from 'react';
import { taskAPI } from '@/lib/api';
import toast from 'react-hot-toast';

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

export interface TaskFormData {
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
}

export interface UseTasks {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: (params?: { search?: string; status?: string }) => Promise<void>;
  createTask: (data: TaskFormData) => Promise<void>;
  updateTask: (id: string, data: TaskFormData) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTasks = (): UseTasks => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks with optional search and filter parameters
  const fetchTasks = useCallback(async (params?: { search?: string; status?: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await taskAPI.getAll(params);
      setTasks(response.data?.tasks || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch tasks';
      setError(errorMessage);
      toast.error(errorMessage);
      setTasks([]); // Ensure tasks is always an array
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new task
  const createTask = useCallback(async (data: TaskFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await taskAPI.create(data);
      const newTask = response.data?.task;
      
      if (newTask) {
        // Add new task to the beginning of the list
        setTasks((prevTasks) => [newTask, ...prevTasks]);
      }
      
      toast.success('Task created successfully');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create task';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err; // Re-throw to allow caller to handle
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing task
  const updateTask = useCallback(async (id: string, data: TaskFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await taskAPI.update(id, data);
      const updatedTask = response.data?.task;
      
      if (updatedTask) {
        // Update task in the list
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task._id === id ? updatedTask : task))
        );
      }
      
      toast.success('Task updated successfully');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update task';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err; // Re-throw to allow caller to handle
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a task
  const deleteTask = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await taskAPI.delete(id);
      
      // Remove task from the list
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      
      toast.success('Task deleted successfully');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete task';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err; // Re-throw to allow caller to handle
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};
