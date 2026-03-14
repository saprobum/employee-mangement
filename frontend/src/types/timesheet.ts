// Timesheet types for employee daily task updates

export interface Timesheet {
  id: number;
  employeeId: number;
  employeeName: string;
  startDate: string;
  endDate: string;
  tasks: TimesheetTask[];
  totalHours: number;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: number;
  comments?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimesheetTask {
  id: number;
  date: string;
  projectId: number;
  projectName: string;
  taskId: number;
  taskName: string;
  hours: number;
  description: string;
}

export interface TimesheetFormData {
  startDate: string;
  endDate: string;
  tasks: TimesheetTaskFormData[];
  comments?: string;
}

export interface TimesheetTaskFormData {
  date: string;
  projectId: string;
  taskId: string;
  taskName: string;
  hours: number;
  description: string;
}

export interface TimesheetFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface TimesheetResponse {
  timesheets: Timesheet[];
  total: number;
  page: number;
  totalPages: number;
}

export type TimesheetStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
