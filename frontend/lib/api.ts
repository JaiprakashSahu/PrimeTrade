import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Redirect to login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API methods
export const authAPI = {
  register: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },
  
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  }
};

// User API methods
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/api/user/profile');
    return response.data;
  },
  
  updateProfile: async (data: { name?: string; email?: string }) => {
    const response = await api.put('/api/user/profile', data);
    return response.data;
  }
};

// Task API methods
export const taskAPI = {
  create: async (data: {
    title: string;
    description?: string;
    status?: 'todo' | 'in-progress' | 'completed';
    dueDate?: string;
  }) => {
    const response = await api.post('/api/tasks', data);
    return response.data;
  },
  
  getAll: async (params?: { search?: string; status?: string }) => {
    const response = await api.get('/api/tasks', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/api/tasks/${id}`);
    return response.data;
  },
  
  update: async (id: string, data: {
    title?: string;
    description?: string;
    status?: 'todo' | 'in-progress' | 'completed';
    dueDate?: string;
  }) => {
    const response = await api.put(`/api/tasks/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/api/tasks/${id}`);
    return response.data;
  }
};

export default api;
