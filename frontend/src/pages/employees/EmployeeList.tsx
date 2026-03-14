import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../components/table/DataTable';
import { createEmployeeColumns } from '../../components/employees';
import { Button } from '../../components/common/Button';
import { Card, CardTitle, CardContent } from '../../components/common/Card';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { ConfirmModal } from '../../components/common/Modal';
import { useEmployees, useEmployeeLoading, useEmployeeFilters, useFetchEmployees, useSetFilters, useSelectEmployee, useDeleteEmployee, useDeleteEmployees } from '../../store/employeeStore';
import type { Employee } from '../../types/employee';

const EmployeeList: React.FC = () => {
  const navigate = useNavigate();
  const employees = useEmployees();
  const loading = useEmployeeLoading();
  const filters = useEmployeeFilters();
  const fetchEmployees = useFetchEmployees();
  const setFilters = useSetFilters();
  const selectEmployee = useSelectEmployee();
  const deleteEmployee = useDeleteEmployee();
  const deleteEmployees = useDeleteEmployees();

  const [selectedRows, setSelectedRows] = useState<Employee[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  // Fetch employees on mount and when filters change
  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Create columns
  const columns = useMemo(
    () =>
      createEmployeeColumns(
        (employee: Employee) => {
          selectEmployee(employee);
          navigate(`/employees/${employee.id}`);
        },
        (employee: Employee) => {
          selectEmployee(employee);
          navigate(`/employees/${employee.id}/edit`);
        },
        (employee: Employee) => {
          setEmployeeToDelete(employee);
          setDeleteConfirmOpen(true);
        }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate]
  );

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedRows.length > 0) {
      setDeleteConfirmOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (employeeToDelete) {
        await deleteEmployee(employeeToDelete.id);
      } else if (selectedRows.length > 0) {
        const ids = selectedRows.map(emp => emp.id);
        await deleteEmployees(ids);
      }
      setDeleteConfirmOpen(false);
      setEmployeeToDelete(null);
      setSelectedRows([]);
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumb
            items={[{ label: 'Employees' }]}
          />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            Employee Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your team members and their account permissions here.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/employees/add')}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Add Employee
        </Button>
      </div>

      {/* Filters Card */}
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name..."
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({ department: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="All">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>

            {/* Reset Filters */}
            <div className="flex items-end">
              <Button
                variant="secondary"
                onClick={() => setFilters({ search: '', department: 'All', status: 'All' })}
                fullWidth
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card>
        <CardTitle as="h2">All Employees</CardTitle>
        <CardContent>
          {/* Bulk Actions */}
          {selectedRows.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between">
              <span className="text-sm text-blue-800 dark:text-blue-200">
                {selectedRows.length} employee(s) selected
              </span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">Export</Button>
                <Button variant="danger" size="sm" onClick={handleBulkDelete}>
                  Delete Selected
                </Button>
              </div>
            </div>
          )}

          {/* DataTable */}
          <DataTable
            columns={columns}
            data={employees}
            isLoading={loading}
            searchable
            searchPlaceholder="Search employees..."
            selectable
            onSelectionChange={setSelectedRows}
            pagination={{
              pageSize: 10,
              totalItems: employees.length,
            }}
            emptyMessage="No employees found. Add a new employee to get started."
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setEmployeeToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message={
          employeeToDelete
            ? `Are you sure you want to delete ${employeeToDelete.firstName} ${employeeToDelete.lastName}? This action cannot be undone.`
            : `Are you sure you want to delete ${selectedRows.length} employee(s)? This action cannot be undone.`
        }
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default EmployeeList;
