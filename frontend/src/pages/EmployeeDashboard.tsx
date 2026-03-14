import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EmployeeList from '../components/EmployeeList';
import EmployeeDetails from '../components/EmployeeDetails';
import { useSelectedEmployee, useFetchEmployee, useSelectEmployee } from '../store/employeeStore';

const EmployeeDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const selectedEmployee = useSelectedEmployee();
  const fetchEmployee = useFetchEmployee();
  const selectEmployee = useSelectEmployee();

  // When on /employee/:id route, fetch employee if not in store
  useEffect(() => {
    if (id && !selectedEmployee) {
      fetchEmployee(parseInt(id));
    }
  }, [id, selectedEmployee, fetchEmployee]);

  // Clear selected employee when returning to root
  useEffect(() => {
    if (!id && selectedEmployee) {
      selectEmployee(null);
    }
  }, [id, selectedEmployee, selectEmployee]);

  // If employee ID in URL or employee selected, show details
  if (id || selectedEmployee) {
    return <EmployeeDetails />;
  }

  return <EmployeeList />;
};

export default EmployeeDashboard;