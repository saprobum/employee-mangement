import type { Timesheet, TimesheetFormData, TimesheetFilters, TimesheetResponse } from '../types/timesheet';

// Mock timesheets database
let mockTimesheets: Timesheet[] = [];

// Initialize mock timesheets
const initializeMockTimesheets = (): Timesheet[] => {
  if (mockTimesheets.length === 0) {
    // Generate some sample timesheets
    mockTimesheets = [
      {
        id: 1,
        employeeId: 3,
        employeeName: 'John Employee',
        startDate: '2024-01-01',
        endDate: '2024-01-07',
        tasks: [
          {
            id: 1,
            date: '2024-01-01',
            projectId: 1,
            projectName: 'Website Redesign',
            taskId: 1,
            taskName: 'Frontend Development',
            hours: 8,
            description: 'Implemented responsive navigation'
          },
          {
            id: 2,
            date: '2024-01-02',
            projectId: 1,
            projectName: 'Website Redesign',
            taskId: 1,
            taskName: 'Frontend Development',
            hours: 7,
            description: 'Created landing page components'
          },
        ],
        totalHours: 15,
        status: 'APPROVED',
        submittedAt: '2024-01-08T10:00:00Z',
        approvedAt: '2024-01-09T14:00:00Z',
        approvedBy: 2,
        createdAt: '2024-01-08T10:00:00Z',
        updatedAt: '2024-01-09T14:00:00Z',
      },
      {
        id: 2,
        employeeId: 3,
        employeeName: 'John Employee',
        startDate: '2024-01-08',
        endDate: '2024-01-14',
        tasks: [
          {
            id: 3,
            date: '2024-01-08',
            projectId: 2,
            projectName: 'Mobile App',
            taskId: 2,
            taskName: 'API Integration',
            hours: 8,
            description: 'Integrated user authentication API'
          },
        ],
        totalHours: 8,
        status: 'SUBMITTED',
        submittedAt: '2024-01-15T09:00:00Z',
        createdAt: '2024-01-15T09:00:00Z',
        updatedAt: '2024-01-15T09:00:00Z',
      },
    ];
  }
  return mockTimesheets;
};

// Mock projects for dropdown
const mockProjects = [
  { id: 1, name: 'Website Redesign', tasks: [{ id: 1, name: 'Frontend Development' }, { id: 2, name: 'Backend Development' }] },
  { id: 2, name: 'Mobile App', tasks: [{ id: 3, name: 'UI Design' }, { id: 4, name: 'API Integration' }] },
  { id: 3, name: 'API Integration', tasks: [{ id: 5, name: 'REST API' }, { id: 6, name: 'GraphQL' }] },
  { id: 4, name: 'Cloud Migration', tasks: [{ id: 7, name: 'AWS Setup' }, { id: 8, name: 'Database Migration' }] },
];

export const timesheetApi = {
  // Simulate API delay
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  // CREATE - Submit new timesheet
  createTimesheet: async (formData: TimesheetFormData, employeeId: number, employeeName: string): Promise<Timesheet> => {
    await timesheetApi.delay(800);
    
    const timesheets = initializeMockTimesheets();
    const newId = Math.max(...timesheets.map(t => t.id), 0) + 1;
    
    // Calculate total hours
    const totalHours = formData.tasks.reduce((sum, task) => sum + task.hours, 0);
    
    const newTimesheet: Timesheet = {
      id: newId,
      employeeId,
      employeeName,
      startDate: formData.startDate,
      endDate: formData.endDate,
      tasks: formData.tasks.map((task, index) => ({
        id: index + 1,
        date: task.date,
        projectId: parseInt(task.projectId),
        projectName: mockProjects.find(p => p.id === parseInt(task.projectId))?.name || '',
        taskId: parseInt(task.taskId),
        taskName: task.taskName,
        hours: task.hours,
        description: task.description,
      })),
      totalHours,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    timesheets.push(newTimesheet);
    return newTimesheet;
  },

  // READ - Get all timesheets with filters
  getTimesheets: async (filters?: TimesheetFilters, employeeId?: number): Promise<TimesheetResponse> => {
    await timesheetApi.delay(500);
    
    const timesheets = initializeMockTimesheets();
    let filteredTimesheets = [...timesheets];

    // Filter by employee ID (for employees, they only see their own)
    if (employeeId) {
      filteredTimesheets = filteredTimesheets.filter(t => t.employeeId === employeeId);
    }

    // Apply status filter
    if (filters?.status && filters.status !== 'All') {
      filteredTimesheets = filteredTimesheets.filter(t => t.status === filters.status);
    }

    // Apply date range filter
    if (filters?.startDate) {
      filteredTimesheets = filteredTimesheets.filter(t => t.endDate >= filters.startDate!);
    }
    if (filters?.endDate) {
      filteredTimesheets = filteredTimesheets.filter(t => t.startDate <= filters.endDate!);
    }

    // Apply pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTimesheets = filteredTimesheets.slice(startIndex, endIndex);

    return {
      timesheets: paginatedTimesheets,
      total: filteredTimesheets.length,
      page,
      totalPages: Math.ceil(filteredTimesheets.length / limit),
    };
  },

  // READ - Get single timesheet by ID
  getTimesheet: async (id: number): Promise<Timesheet> => {
    await timesheetApi.delay(600);
    
    const timesheets = initializeMockTimesheets();
    const timesheet = timesheets.find(t => t.id === id);

    if (!timesheet) {
      throw new Error('Timesheet not found');
    }

    return timesheet;
  },

  // UPDATE - Update timesheet (add tasks, edit draft)
  updateTimesheet: async (id: number, formData: Partial<TimesheetFormData>): Promise<Timesheet> => {
    await timesheetApi.delay(800);
    
    const timesheets = initializeMockTimesheets();
    const index = timesheets.findIndex(t => t.id === id);

    if (index === -1) {
      throw new Error('Timesheet not found');
    }

    const timesheet = timesheets[index];
    
    // Only allow updates to DRAFT timesheets
    if (timesheet.status !== 'DRAFT') {
      throw new Error('Cannot update submitted/approved timesheets');
    }

    const updatedTimesheet: Timesheet = {
      ...timesheet,
      ...formData,
      tasks: formData.tasks?.map((task, i) => ({
        id: i + 1,
        date: task.date,
        projectId: parseInt(task.projectId),
        projectName: mockProjects.find(p => p.id === parseInt(task.projectId))?.name || '',
        taskId: parseInt(task.taskId),
        taskName: task.taskName,
        hours: task.hours,
        description: task.description,
      })) || timesheet.tasks,
      totalHours: formData.tasks?.reduce((sum, task) => sum + task.hours, 0) || timesheet.totalHours,
      updatedAt: new Date().toISOString(),
    };

    timesheets[index] = updatedTimesheet;
    return updatedTimesheet;
  },

  // UPDATE - Submit timesheet for approval
  submitTimesheet: async (id: number): Promise<Timesheet> => {
    await timesheetApi.delay(600);
    
    const timesheets = initializeMockTimesheets();
    const index = timesheets.findIndex(t => t.id === id);

    if (index === -1) {
      throw new Error('Timesheet not found');
    }

    const timesheet = timesheets[index];
    
    if (timesheet.status !== 'DRAFT') {
      throw new Error('Only draft timesheets can be submitted');
    }

    const updatedTimesheet: Timesheet = {
      ...timesheet,
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    timesheets[index] = updatedTimesheet;
    return updatedTimesheet;
  },

  // UPDATE - Approve timesheet (for managers/HR)
  approveTimesheet: async (id: number, approvedBy: number, comments?: string): Promise<Timesheet> => {
    await timesheetApi.delay(600);
    
    const timesheets = initializeMockTimesheets();
    const index = timesheets.findIndex(t => t.id === id);

    if (index === -1) {
      throw new Error('Timesheet not found');
    }

    const timesheet = timesheets[index];
    
    const updatedTimesheet: Timesheet = {
      ...timesheet,
      status: 'APPROVED',
      approvedAt: new Date().toISOString(),
      approvedBy,
      comments,
      updatedAt: new Date().toISOString(),
    };

    timesheets[index] = updatedTimesheet;
    return updatedTimesheet;
  },

  // UPDATE - Reject timesheet (for managers/HR)
  rejectTimesheet: async (id: number, rejectionReason: string): Promise<Timesheet> => {
    await timesheetApi.delay(600);
    
    const timesheets = initializeMockTimesheets();
    const index = timesheets.findIndex(t => t.id === id);

    if (index === -1) {
      throw new Error('Timesheet not found');
    }

    const timesheet = timesheets[index];
    
    const updatedTimesheet: Timesheet = {
      ...timesheet,
      status: 'REJECTED',
      rejectionReason,
      updatedAt: new Date().toISOString(),
    };

    timesheets[index] = updatedTimesheet;
    return updatedTimesheet;
  },

  // DELETE - Delete timesheet (only drafts)
  deleteTimesheet: async (id: number): Promise<void> => {
    await timesheetApi.delay(500);
    
    const timesheets = initializeMockTimesheets();
    const index = timesheets.findIndex(t => t.id === id);

    if (index === -1) {
      throw new Error('Timesheet not found');
    }

    const timesheet = timesheets[index];
    
    if (timesheet.status !== 'DRAFT') {
      throw new Error('Cannot delete submitted/approved timesheets');
    }

    timesheets.splice(index, 1);
  },

  // GET - Get projects for dropdown
  getProjects: async () => {
    await timesheetApi.delay(300);
    return mockProjects;
  },

  // GET - Get tasks by project ID
  getTasksByProject: async (projectId: number) => {
    await timesheetApi.delay(300);
    const project = mockProjects.find(p => p.id === projectId);
    return project?.tasks || [];
  },

  // GET - Get timesheet statistics for employee
  getTimesheetStats: async (employeeId: number) => {
    await timesheetApi.delay(400);
    
    const timesheets = initializeMockTimesheets();
    const employeeTimesheets = timesheets.filter(t => t.employeeId === employeeId);
    
    return {
      total: employeeTimesheets.length,
      draft: employeeTimesheets.filter(t => t.status === 'DRAFT').length,
      submitted: employeeTimesheets.filter(t => t.status === 'SUBMITTED').length,
      approved: employeeTimesheets.filter(t => t.status === 'APPROVED').length,
      rejected: employeeTimesheets.filter(t => t.status === 'REJECTED').length,
      totalHours: employeeTimesheets.reduce((sum, t) => sum + t.totalHours, 0),
    };
  },
};

export default timesheetApi;
