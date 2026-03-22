import { axiosInstance } from './axiosConfig';
import { NetworkModule, PostLoginURL } from '../routes/network';
import type { Employee } from '../types/employee';

export const getAllEmployees = async () => {
  try {
    const response = await axiosInstance.get(NetworkModule.EMPLOYEE);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getEmployeeById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`${NetworkModule.EMPLOYEE}/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getEmployeeByEmployeeId = async (employeeId: string) => {
  try {
    const response = await axiosInstance.get(
      `${NetworkModule.EMPLOYEE}${PostLoginURL.SEARCH_BY_EMPLOYEE_ID}/${employeeId}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getEmployeesByDepartment = async (department: string) => {
  try {
    const response = await axiosInstance.get(
      `${NetworkModule.EMPLOYEE}${PostLoginURL.DEPARTMENT}/${department}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const createEmployee = async (payload: Employee) => {
  try {
    const response = await axiosInstance.post(NetworkModule.EMPLOYEE, payload);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateEmployee = async (id: number, payload: Partial<Employee>) => {
  try {
    const response = await axiosInstance.put(`${NetworkModule.EMPLOYEE}/${id}`, payload);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const deleteEmployee = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`${NetworkModule.EMPLOYEE}/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};
