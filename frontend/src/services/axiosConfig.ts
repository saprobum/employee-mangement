import axios from 'axios';
import { NetworkInfo } from '../routes/network';

// Create axios instance with default configuration
export const axiosInstance = axios.create({
  baseURL: NetworkInfo.URL,
  // withCredentials: true,
  // timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["ngrok-skip-browser-warning"] = true;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: any) => {
    if (response.status < 200 || response.status >= 300) {
      return Promise.reject(response.data);
    }
    return response;
  },
  async (error: any) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// Export the configured axios instance
export default axiosInstance;



// Utility functions
export const setAuthToken = (token: string) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};
