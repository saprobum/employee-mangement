import React from 'react';
import type { Employee } from '../types/employee';

interface EmployeeCardProps {
  employee: Employee;
  onClick: () => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onClick }) => {
  const statusColors = {
    Active: 'bg-green-100 text-green-800',
    Inactive: 'bg-red-100 text-red-800',
    'On Leave': 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-center">
          <img 
            className="w-16 h-16 rounded-full object-cover" 
            src={employee.avatar} 
            alt={`${employee.firstName} ${employee.lastName}`} 
          />
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {employee.firstName} {employee.lastName}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">{employee.jobTitle}</p>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {employee.department}
          </span>
          <span className={`px-2 py-1 text-xs rounded-full ${statusColors[employee.status]}`}>
            {employee.status}
          </span>
        </div>
        
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          <p>Hired: {new Date(employee.hireDate).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;