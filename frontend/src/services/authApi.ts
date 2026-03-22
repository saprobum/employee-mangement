import { axiosInstance } from './axiosConfig';
import { NetworkModule, AuthURL } from '../routes/network';

export const login = async (payload: { username?: string; email?: string; password: string }) => {
  try {
    const response = await axiosInstance.post(`${NetworkModule.AUTH}${AuthURL.LOGIN}`, payload);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const register = async (payload: any) => {
  try {
    const response = await axiosInstance.post(`${NetworkModule.AUTH}${AuthURL.REGISTER}`, payload);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await axiosInstance.post(`${NetworkModule.AUTH}${AuthURL.REFRESH_TOKEN}`, {});
    return response.data;
  } catch (error) {
    return error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};
