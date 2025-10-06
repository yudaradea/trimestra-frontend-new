import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || 'http://backend-trimestra-new.test/api',
  headers: {
    Accept: 'application/json',
  },
  withCredentials: false,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
// Response interceptor - FIXED
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';

      // Jangan logout kalau error dari login/register
      if (!url.includes('/login') && !url.includes('/register')) {
        const authStore = useAuthStore();
        authStore.logout();
        router.push('/login');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
