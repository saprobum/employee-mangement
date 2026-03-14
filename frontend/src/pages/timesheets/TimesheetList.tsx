import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../components/table/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '../../components/common/Button';
import { Card, CardTitle, CardContent, StatCard } from '../../components/common/Card';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { ConfirmModal } from '../../components/common/Modal';
import { useTimesheets, useTimesheetLoading, useTimesheetFilters, useFetchTimesheets, useSetFilters, useDeleteTimesheet, useSubmitTimesheet, useTimesheetStats, useFetchStats } from '../../store/timesheetStore';
import { useUser } from '../../store/authStore';
import type { Timesheet } from '../../types/timesheet';

const TimesheetList: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();
  const timesheets = useTimesheets();
  const loading = useTimesheetLoading();
  const filters = useTimesheetFilters();
  const stats = useTimesheetStats();
  const fetchTimesheets = useFetchTimesheets();
  const fetchStats = useFetchStats();
  const setFilters = useSetFilters();
  const deleteTimesheet = useDeleteTimesheet();
  const submitTimesheet = useSubmitTimesheet();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [timesheetToDelete, setTimesheetToDelete] = useState<number | null>(null);
  const [submitConfirmOpen, setSubmitConfirmOpen] = useState(false);
  const [timesheetToSubmit, setTimesheetToSubmit] = useState<number | null>(null);

  // Fetch timesheets on mount
  useEffect(() => {
    // For admin/HR, fetch all timesheets (no employeeId filter)
    // For employees, fetch only their own timesheets
    const employeeId = (user?.role === 'EMPLOYEE') ? user.id : undefined;
    fetchTimesheets(employeeId);
    fetchStats(user?.id || 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, user?.role]);

  // Create columns
  const columns = useMemo<ColumnDef<Timesheet>[]>(
    () => [
      {
        accessorKey: 'period',
        header: 'Period',
        cell: ({ row }) => {
          const start = new Date(row.original.startDate).toLocaleDateString();
          const end = new Date(row.original.endDate).toLocaleDateString();
          return `${start} - ${end}`;
        },
        size: 180,
      },
      // Only show employee name for admin/HR
      ...(user?.role !== 'EMPLOYEE' ? [{
        accessorKey: 'employeeName',
        header: 'Employee',
        cell: ({ getValue }) => getValue<string>(),
        size: 150,
      } as ColumnDef<Timesheet>] : []),
      {
        accessorKey: 'totalHours',
        header: 'Total Hours',
        cell: ({ getValue }) => `${getValue<number>()} hrs`,
        size: 100,
      },
      {
        accessorKey: 'tasks',
        header: 'Tasks',
        cell: ({ row }) => row.original.tasks.length,
        size: 80,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const status = getValue<string>();
          const statusStyles: Record<string, string> = {
            DRAFT: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
            SUBMITTED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          };
          return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status] || statusStyles.DRAFT}`}>
              {status}
            </span>
          );
        },
        size: 100,
      },
      {
        accessorKey: 'submittedAt',
        header: 'Submitted',
        cell: ({ getValue }) => getValue<string>() ? new Date(getValue<string>()).toLocaleDateString() : '-',
        size: 120,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const timesheet = row.original;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/timesheets/${timesheet.id}`)}
                title="View Details"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </Button>
              {timesheet.status === 'DRAFT' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/timesheets/${timesheet.id}/edit`)}
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTimesheetToSubmit(timesheet.id);
                      setSubmitConfirmOpen(true);
                    }}
                    title="Submit for Approval"
                    className="text-green-600 hover:text-green-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTimesheetToDelete(timesheet.id);
                      setDeleteConfirmOpen(true);
                    }}
                    title="Delete"
                    className="text-red-600 hover:text-red-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </>
              )}
              {timesheet.status === 'SUBMITTED' && (
                <span className="text-xs text-gray-500">Pending Approval</span>
              )}
            </div>
          );
        },
        size: 150,
      },
    ],
    [navigate]
  );

  const handleConfirmDelete = async () => {
    try {
      if (timesheetToDelete) {
        await deleteTimesheet(timesheetToDelete);
      }
      setDeleteConfirmOpen(false);
      setTimesheetToDelete(null);
    } catch (error) {
      console.error('Error deleting timesheet:', error);
    }
  };

  const handleConfirmSubmit = async () => {
    try {
      if (timesheetToSubmit) {
        await submitTimesheet(timesheetToSubmit);
      }
      setSubmitConfirmOpen(false);
      setTimesheetToSubmit(null);
    } catch (error) {
      console.error('Error submitting timesheet:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumb items={[{ label: 'Timesheets' }]} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            My Timesheets
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and submit your weekly timesheets for approval.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/timesheets/add')}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Submit Timesheet
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total" value={stats.total} color="blue" />
        <StatCard title="Draft" value={stats.draft} color="blue" />
        <StatCard title="Submitted" value={stats.submitted} color="yellow" />
        <StatCard title="Approved" value={stats.approved} color="green" />
        <StatCard title="Rejected" value={stats.rejected} color="red" />
        <StatCard title="Total Hours" value={stats.totalHours} color="purple" />
      </div>

      {/* Filters */}
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={filters.status || 'All'}
                onChange={(e) => setFilters({ status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="All">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardTitle as="h2">Timesheet History</CardTitle>
        <CardContent>
          <DataTable
            columns={columns}
            data={timesheets}
            isLoading={loading}
            pagination={{
              pageSize: 10,
              totalItems: timesheets.length,
            }}
            emptyMessage="No timesheets found. Submit your first timesheet to get started."
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setTimesheetToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Timesheet"
        message="Are you sure you want to delete this timesheet? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />

      {/* Submit Confirmation Modal */}
      <ConfirmModal
        isOpen={submitConfirmOpen}
        onClose={() => {
          setSubmitConfirmOpen(false);
          setTimesheetToSubmit(null);
        }}
        onConfirm={handleConfirmSubmit}
        title="Submit Timesheet"
        message="Once submitted, you won't be able to edit this timesheet. Are you sure you want to submit it for approval?"
        confirmText="Submit"
        variant="warning"
      />
    </div>
  );
};

export default TimesheetList;
