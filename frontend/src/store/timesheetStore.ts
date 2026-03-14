import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { timesheetApi } from '../services/timesheetApi';
import type { Timesheet, TimesheetFormData, TimesheetFilters } from '../types/timesheet';

interface TimesheetState {
  // State
  timesheets: Timesheet[];
  selectedTimesheet: Timesheet | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalTimesheets: number;
  stats: {
    total: number;
    draft: number;
    submitted: number;
    approved: number;
    rejected: number;
    totalHours: number;
  };

  // Filters
  filters: TimesheetFilters;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentPage: (page: number) => void;
  setFilters: (filters: Partial<TimesheetFilters>) => void;

  // CRUD Operations
  fetchTimesheets: (employeeId?: number) => Promise<void>;
  fetchTimesheet: (id: number) => Promise<void>;
  createTimesheet: (formData: TimesheetFormData, employeeId: number, employeeName: string) => Promise<Timesheet>;
  updateTimesheet: (id: number, formData: Partial<TimesheetFormData>) => Promise<Timesheet>;
  submitTimesheet: (id: number) => Promise<Timesheet>;
  deleteTimesheet: (id: number) => Promise<void>;
  fetchStats: (employeeId: number) => Promise<void>;
  
  // Helper actions
  selectTimesheet: (timesheet: Timesheet | null) => void;
  clearError: () => void;
}

export const useTimesheetStore = create<TimesheetState>()(
  persist(
    (set, get) => ({
      // Initial state
      timesheets: [],
      selectedTimesheet: null,
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      totalTimesheets: 0,
      stats: {
        total: 0,
        draft: 0,
        submitted: 0,
        approved: 0,
        rejected: 0,
        totalHours: 0,
      },
      filters: {
        status: 'All',
        page: 1,
        limit: 10,
      },

      // Basic Actions
      setLoading: (loading) => set((state) => ({ ...state, loading })),
      setError: (error) => set((state) => ({ ...state, error })),
      setCurrentPage: (page) => set((state) => ({ ...state, currentPage: page })),
      setFilters: (newFilters) => {
        set((state) => ({
          ...state,
          filters: { ...state.filters, ...newFilters },
          currentPage: 1,
        }));
      },
      clearError: () => set((state) => ({ ...state, error: null })),
      selectTimesheet: (timesheet) => set((state) => ({ ...state, selectedTimesheet: timesheet })),

      // READ - Fetch all timesheets
      fetchTimesheets: async (employeeId?: number) => {
        const state = get();
        const { filters, currentPage } = state;

        set({ loading: true, error: null });

        try {
          const result = await timesheetApi.getTimesheets({
            ...filters,
            page: currentPage,
          }, employeeId);

          set((prevState) => ({
            ...prevState,
            timesheets: result.timesheets,
            totalPages: result.totalPages,
            totalTimesheets: result.total,
            loading: false,
          }));
        } catch (error: any) {
          console.error('Error fetching timesheets:', error);
          set((prevState) => ({
            ...prevState,
            timesheets: [],
            loading: false,
            error: error.message || 'Failed to fetch timesheets',
          }));
        }
      },

      // READ - Fetch single timesheet
      fetchTimesheet: async (id: number) => {
        set({ loading: true, error: null });

        try {
          const timesheet = await timesheetApi.getTimesheet(id);

          set((prevState) => ({
            ...prevState,
            selectedTimesheet: timesheet,
            loading: false,
          }));
        } catch (error: any) {
          console.error('Error fetching timesheet:', error);
          set((prevState) => ({
            ...prevState,
            selectedTimesheet: null,
            loading: false,
            error: error.message || 'Failed to fetch timesheet',
          }));
        }
      },

      // CREATE - Submit new timesheet
      createTimesheet: async (formData: TimesheetFormData, employeeId: number, employeeName: string) => {
        set({ loading: true, error: null });

        try {
          const newTimesheet = await timesheetApi.createTimesheet(formData, employeeId, employeeName);
          
          set((prevState) => ({
            ...prevState,
            timesheets: [newTimesheet, ...prevState.timesheets],
            totalTimesheets: prevState.totalTimesheets + 1,
            loading: false,
          }));

          return newTimesheet;
        } catch (error: any) {
          console.error('Error creating timesheet:', error);
          set((prevState) => ({
            ...prevState,
            loading: false,
            error: error.message || 'Failed to create timesheet',
          }));
          throw error;
        }
      },

      // UPDATE - Update timesheet
      updateTimesheet: async (id: number, formData: Partial<TimesheetFormData>) => {
        set({ loading: true, error: null });

        try {
          const updatedTimesheet = await timesheetApi.updateTimesheet(id, formData);
          
          set((prevState) => ({
            ...prevState,
            timesheets: prevState.timesheets.map(t => 
              t.id === id ? updatedTimesheet : t
            ),
            selectedTimesheet: prevState.selectedTimesheet?.id === id ? updatedTimesheet : prevState.selectedTimesheet,
            loading: false,
          }));

          return updatedTimesheet;
        } catch (error: any) {
          console.error('Error updating timesheet:', error);
          set((prevState) => ({
            ...prevState,
            loading: false,
            error: error.message || 'Failed to update timesheet',
          }));
          throw error;
        }
      },

      // UPDATE - Submit timesheet for approval
      submitTimesheet: async (id: number) => {
        set({ loading: true, error: null });

        try {
          const updatedTimesheet = await timesheetApi.submitTimesheet(id);
          
          set((prevState) => ({
            ...prevState,
            timesheets: prevState.timesheets.map(t => 
              t.id === id ? updatedTimesheet : t
            ),
            selectedTimesheet: prevState.selectedTimesheet?.id === id ? updatedTimesheet : prevState.selectedTimesheet,
            loading: false,
          }));

          return updatedTimesheet;
        } catch (error: any) {
          console.error('Error submitting timesheet:', error);
          set((prevState) => ({
            ...prevState,
            loading: false,
            error: error.message || 'Failed to submit timesheet',
          }));
          throw error;
        }
      },

      // DELETE - Delete timesheet
      deleteTimesheet: async (id: number) => {
        set({ loading: true, error: null });

        try {
          await timesheetApi.deleteTimesheet(id);
          
          set((prevState) => ({
            ...prevState,
            timesheets: prevState.timesheets.filter(t => t.id !== id),
            totalTimesheets: prevState.totalTimesheets - 1,
            selectedTimesheet: prevState.selectedTimesheet?.id === id ? null : prevState.selectedTimesheet,
            loading: false,
          }));
        } catch (error: any) {
          console.error('Error deleting timesheet:', error);
          set((prevState) => ({
            ...prevState,
            loading: false,
            error: error.message || 'Failed to delete timesheet',
          }));
          throw error;
        }
      },

      // GET - Fetch timesheet statistics
      fetchStats: async (employeeId: number) => {
        try {
          const stats = await timesheetApi.getTimesheetStats(employeeId);
          set((prevState) => ({
            ...prevState,
            stats,
          }));
        } catch (error: any) {
          console.error('Error fetching stats:', error);
        }
      },
    }),
    {
      name: 'timesheet-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        filters: state.filters,
        currentPage: state.currentPage,
      }),
    }
  )
);

// Selector hooks
export const useTimesheets = () => useTimesheetStore((state) => state.timesheets);
export const useSelectedTimesheet = () => useTimesheetStore((state) => state.selectedTimesheet);
export const useTimesheetLoading = () => useTimesheetStore((state) => state.loading);
export const useTimesheetError = () => useTimesheetStore((state) => state.error);
export const useTimesheetFilters = () => useTimesheetStore((state) => state.filters);
export const useTimesheetStats = () => useTimesheetStore((state) => state.stats);

// Action hooks
export const useFetchTimesheets = () => useTimesheetStore((state) => state.fetchTimesheets);
export const useFetchTimesheet = () => useTimesheetStore((state) => state.fetchTimesheet);
export const useCreateTimesheet = () => useTimesheetStore((state) => state.createTimesheet);
export const useUpdateTimesheet = () => useTimesheetStore((state) => state.updateTimesheet);
export const useSubmitTimesheet = () => useTimesheetStore((state) => state.submitTimesheet);
export const useDeleteTimesheet = () => useTimesheetStore((state) => state.deleteTimesheet);
export const useFetchStats = () => useTimesheetStore((state) => state.fetchStats);
export const useSetFilters = () => useTimesheetStore((state) => state.setFilters);
export const useSelectTimesheet = () => useTimesheetStore((state) => state.selectTimesheet);
