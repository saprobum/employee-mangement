import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { employeeApi } from '../services/employeeApi';
import type { Employee } from '../types/employee';

interface EmployeeState {
  // State
  employees: Employee[];
  selectedEmployee: Employee | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalEmployees: number;

  // Filters
  filters: {
    search: string;
    department: string;
    status: string;
  };

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentPage: (page: number) => void;
  setFilters: (filters: Partial<EmployeeState['filters']>) => void;
  resetFilters: () => void;

  // CRUD Operations
  fetchEmployees: () => Promise<void>;
  fetchEmployee: (id: number) => Promise<void>;
  createEmployee: (employeeData: Partial<Employee>) => Promise<Employee>;
  updateEmployee: (id: number, employeeData: Partial<Employee>) => Promise<Employee>;
  deleteEmployee: (id: number) => Promise<void>;
  deleteEmployees: (ids: number[]) => Promise<void>;

  // Helper actions
  selectEmployee: (employee: Employee | null) => void;
  clearError: () => void;
  refreshEmployees: () => Promise<void>;
}

export const useEmployeeStore = create<EmployeeState>()(
  persist(
    (set, get) => ({
      // Initial state
      employees: [],
      selectedEmployee: null,
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      totalEmployees: 0,
      filters: {
        search: '',
        department: 'All',
        status: 'All',
      },

      // Basic Actions
      setLoading: (loading) => set((state) => ({ ...state, loading })),
      setError: (error) => set((state) => ({ ...state, error })),
      setCurrentPage: (currentPage) => set((state) => ({ ...state, currentPage })),
      setFilters: (newFilters) => {
        set((state) => ({
          ...state,
          filters: { ...state.filters, ...newFilters },
          currentPage: 1,
        }));
      },
      resetFilters: () => set((state) => ({
        ...state,
        filters: {
          search: '',
          department: 'All',
          status: 'All',
        },
        currentPage: 1,
      })),
      clearError: () => set((state) => ({ ...state, error: null })),
      selectEmployee: (employee) => set((state) => ({ ...state, selectedEmployee: employee })),

      // READ - Fetch all employees with filters
      fetchEmployees: async () => {
        const state = get();
        const { filters, currentPage } = state;

        set({ loading: true, error: null });

        try {
          const result = await employeeApi.getEmployees({
            search: filters.search,
            department: filters.department,
            status: filters.status,
            page: currentPage,
            limit: 10,
          });

          set((prevState) => ({
            ...prevState,
            employees: result.employees,
            totalPages: result.totalPages,
            totalEmployees: result.total,
            loading: false,
          }));
        } catch (error: any) {
          console.error('Error fetching employees:', error);
          set((prevState) => ({
            ...prevState,
            employees: [],
            loading: false,
            error: error.message || 'Failed to fetch employees',
          }));
        }
      },

      // READ - Fetch single employee
      fetchEmployee: async (id: number) => {
        set({ loading: true, error: null });

        try {
          const employee = await employeeApi.getEmployee(id);

          set((prevState) => ({
            ...prevState,
            selectedEmployee: employee,
            loading: false,
          }));
        } catch (error: any) {
          console.error('Error fetching employee:', error);
          set((prevState) => ({
            ...prevState,
            selectedEmployee: null,
            loading: false,
            error: error.message || 'Failed to fetch employee details',
          }));
        }
      },

      // CREATE - Add new employee
      createEmployee: async (employeeData: Partial<Employee>) => {
        set({ loading: true, error: null });

        try {
          const newEmployee = await employeeApi.createEmployee(employeeData);
          
          set((prevState) => ({
            ...prevState,
            employees: [newEmployee, ...prevState.employees],
            totalEmployees: prevState.totalEmployees + 1,
            loading: false,
          }));

          return newEmployee;
        } catch (error: any) {
          console.error('Error creating employee:', error);
          set((prevState) => ({
            ...prevState,
            loading: false,
            error: error.message || 'Failed to create employee',
          }));
          throw error;
        }
      },

      // UPDATE - Update existing employee
      updateEmployee: async (id: number, employeeData: Partial<Employee>) => {
        set({ loading: true, error: null });

        try {
          const updatedEmployee = await employeeApi.updateEmployee(id, employeeData);
          
          set((prevState) => ({
            ...prevState,
            employees: prevState.employees.map(emp => 
              emp.id === id ? updatedEmployee : emp
            ),
            selectedEmployee: prevState.selectedEmployee?.id === id ? updatedEmployee : prevState.selectedEmployee,
            loading: false,
          }));

          return updatedEmployee;
        } catch (error: any) {
          console.error('Error updating employee:', error);
          set((prevState) => ({
            ...prevState,
            loading: false,
            error: error.message || 'Failed to update employee',
          }));
          throw error;
        }
      },

      // DELETE - Delete single employee
      deleteEmployee: async (id: number) => {
        set({ loading: true, error: null });

        try {
          await employeeApi.deleteEmployee(id);
          
          set((prevState) => ({
            ...prevState,
            employees: prevState.employees.filter(emp => emp.id !== id),
            totalEmployees: prevState.totalEmployees - 1,
            selectedEmployee: prevState.selectedEmployee?.id === id ? null : prevState.selectedEmployee,
            loading: false,
          }));
        } catch (error: any) {
          console.error('Error deleting employee:', error);
          set((prevState) => ({
            ...prevState,
            loading: false,
            error: error.message || 'Failed to delete employee',
          }));
          throw error;
        }
      },

      // DELETE - Bulk delete employees
      deleteEmployees: async (ids: number[]) => {
        set({ loading: true, error: null });

        try {
          await employeeApi.deleteEmployees(ids);
          
          set((prevState) => ({
            ...prevState,
            employees: prevState.employees.filter(emp => !ids.includes(emp.id)),
            totalEmployees: prevState.totalEmployees - ids.length,
            loading: false,
          }));
        } catch (error: any) {
          console.error('Error deleting employees:', error);
          set((prevState) => ({
            ...prevState,
            loading: false,
            error: error.message || 'Failed to delete employees',
          }));
          throw error;
        }
      },

      refreshEmployees: async () => {
        await get().fetchEmployees();
      },
    }),
    {
      name: 'employee-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        filters: state.filters,
        currentPage: state.currentPage,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to rehydrate state:', error);
        }
        if (state && !error) {
          setTimeout(() => {
            state.fetchEmployees();
          }, 0);
        }
      },
    }
  )
);

// Selector hooks
export const useEmployees = () => useEmployeeStore((state) => state.employees);
export const useSelectedEmployee = () => useEmployeeStore((state) => state.selectedEmployee);
export const useEmployeeLoading = () => useEmployeeStore((state) => state.loading);
export const useEmployeeError = () => useEmployeeStore((state) => state.error);
export const useEmployeeCurrentPage = () => useEmployeeStore((state) => state.currentPage);
export const useEmployeeTotalPages = () => useEmployeeStore((state) => state.totalPages);
export const useEmployeeTotalEmployees = () => useEmployeeStore((state) => state.totalEmployees);
export const useEmployeeFilters = () => useEmployeeStore((state) => state.filters);

// Individual action selectors
export const useSetCurrentPage = () => useEmployeeStore((state) => state.setCurrentPage);
export const useSetFilters = () => useEmployeeStore((state) => state.setFilters);
export const useResetFilters = () => useEmployeeStore((state) => state.resetFilters);
export const useFetchEmployees = () => useEmployeeStore((state) => state.fetchEmployees);
export const useFetchEmployee = () => useEmployeeStore((state) => state.fetchEmployee);
export const useCreateEmployee = () => useEmployeeStore((state) => state.createEmployee);
export const useUpdateEmployee = () => useEmployeeStore((state) => state.updateEmployee);
export const useDeleteEmployee = () => useEmployeeStore((state) => state.deleteEmployee);
export const useDeleteEmployees = () => useEmployeeStore((state) => state.deleteEmployees);
export const useSelectEmployee = () => useEmployeeStore((state) => state.selectEmployee);
export const useClearError = () => useEmployeeStore((state) => state.clearError);
export const useRefreshEmployees = () => useEmployeeStore((state) => state.refreshEmployees);

// Combined actions hook
export const useEmployeeActions = () => useEmployeeStore((state) => ({
  setCurrentPage: state.setCurrentPage,
  setFilters: state.setFilters,
  resetFilters: state.resetFilters,
  fetchEmployees: state.fetchEmployees,
  fetchEmployee: state.fetchEmployee,
  createEmployee: state.createEmployee,
  updateEmployee: state.updateEmployee,
  deleteEmployee: state.deleteEmployee,
  deleteEmployees: state.deleteEmployees,
  selectEmployee: state.selectEmployee,
  clearError: state.clearError,
  refreshEmployees: state.refreshEmployees,
}));
