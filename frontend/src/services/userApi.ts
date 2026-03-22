import { axiosInstance } from './axiosConfig';
import { NetworkModule } from '../routes/network';

export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get(NetworkModule.USER);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getUserById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`${NetworkModule.USER}/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const createUser = async (payload: any) => {
  try {
    const response = await axiosInstance.post(NetworkModule.USER, payload);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateUser = async (id: number, payload: any) => {
  try {
    const response = await axiosInstance.put(`${NetworkModule.USER}/${id}`, payload);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const deleteUser = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`${NetworkModule.USER}/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};
