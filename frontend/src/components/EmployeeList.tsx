import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Employee } from '../types/employee';
import EmployeeCard from './EmployeeCard';
import Pagination from './Pagination';
import SearchFilter from './SearchFilter';
import { useEmployees, useEmployeeLoading, useEmployeeError, useEmployeeCurrentPage, useEmployeeTotalPages, useEmployeeFilters, useFetchEmployees, useSelectEmployee, useSetFilters, useSetCurrentPage } from '../store/employeeStore';

const EmployeeList: React.FC = () => {
  const navigate = useNavigate();

  // State from store
  const employees = useEmployees();
  const loading = useEmployeeLoading();
  const error = useEmployeeError();
  const currentPage = useEmployeeCurrentPage();
  const totalPages = useEmployeeTotalPages();
  const filters = useEmployeeFilters();

  // Actions from store (using individual selectors to avoid infinite loops)
  const fetchEmployees = useFetchEmployees();
  const setFilters = useSetFilters();
  const setCurrentPage = useSetCurrentPage();
  const selectEmployee = useSelectEmployee();

  // Memoize departments to prevent re-creation on every render
  const departments = useMemo(() => {
    return ['All', ...Array.from(new Set(employees.map(emp => emp.department)))];
  }, [employees]);

  // Fetch employees when filters or page changes
  useEffect(() => {
    fetchEmployees();
  }, [filters, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEmployeeClick = (employee: Employee) => {
    // Store selected employee and navigate to employee route
    selectEmployee(employee);
    navigate(`/employee/${employee.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Employee Directory</h1>
      
      <SearchFilter 
        searchTerm={filters.search}
        onSearchChange={(search) => setFilters({ search })}
        departmentFilter={filters.department}
        onDepartmentChange={(department) => setFilters({ department })}
        statusFilter={filters.status}
        onStatusChange={(status) => setFilters({ status })}
        departments={departments}
      />
      
      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => fetchEmployees()}
            className="mt-2 sm:mt-0 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Loading State */}
      {loading && employees.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-4 text-gray-600 dark:text-gray-400">Loading employees...</span>
        </div>
      )}
      
      {/* Data Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {employees.map(employee => (
              <EmployeeCard 
                key={employee.id} 
                employee={employee} 
                onClick={() => handleEmployeeClick(employee)} 
              />
            ))}
          </div>
          
          {employees.length > 0 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
          
          {!loading && employees.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-300">No employees found matching your criteria</p>
              <button
                onClick={() => setFilters({ search: '', department: 'All', status: 'All' })}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear Filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EmployeeList;
