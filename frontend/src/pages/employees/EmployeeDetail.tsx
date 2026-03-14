import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { useSelectedEmployee, useEmployeeActions } from '../../store/employeeStore';

const EmployeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const selectedEmployee = useSelectedEmployee();
  const { fetchEmployee, selectEmployee } = useEmployeeActions();

  useEffect(() => {
    if (id) {
      fetchEmployee(parseInt(id));
    }
    return () => {
      selectEmployee(null);
    };
  }, [id, fetchEmployee, selectEmployee]);

  if (!selectedEmployee) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const employee = selectedEmployee;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Breadcrumb
          items={[
            { label: 'Employees', href: '/employees' },
            { label: `${employee.firstName} ${employee.lastName}` },
          ]}
        />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {employee.firstName} {employee.lastName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{employee.jobTitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate(`/employees/${employee.id}/edit`)}
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              }
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/employees')}
            >
              Back to List
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <img
              src={employee.avatar}
              alt={`${employee.firstName} ${employee.lastName}`}
              className="w-24 h-24 rounded-full"
            />
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">{employee.contact.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">{employee.contact.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                  <p className="font-medium text-gray-900 dark:text-white">{employee.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    employee.status === 'Active' ? 'bg-green-100 text-green-800' :
                    employee.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {employee.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employment Details */}
      <Card>
        <CardTitle as="h2">Employment Details</CardTitle>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Job Title</p>
              <p className="font-medium text-gray-900 dark:text-white">{employee.jobTitle}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
              <p className="font-medium text-gray-900 dark:text-white">{employee.employment.department}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manager</p>
              <p className="font-medium text-gray-900 dark:text-white">{employee.employment.manager || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Salary</p>
              <p className="font-medium text-gray-900 dark:text-white">
                ${employee.employment.salary.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Start Date</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(employee.employment.startDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Employment Status</p>
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                employee.employment.status === 'Active' ? 'bg-green-100 text-green-800' :
                employee.employment.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {employee.employment.status}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardTitle as="h2">Address</CardTitle>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Street</p>
              <p className="font-medium text-gray-900 dark:text-white">{employee.address.street}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">City</p>
              <p className="font-medium text-gray-900 dark:text-white">{employee.address.city}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">State</p>
              <p className="font-medium text-gray-900 dark:text-white">{employee.address.state}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">ZIP Code</p>
              <p className="font-medium text-gray-900 dark:text-white">{employee.address.zipCode}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Country</p>
              <p className="font-medium text-gray-900 dark:text-white">{employee.address.country}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      {employee.contact.emergencyContact && (
        <Card>
          <CardTitle as="h2">Emergency Contact</CardTitle>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {employee.contact.emergencyContact.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Relationship</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {employee.contact.emergencyContact.relationship}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {employee.contact.emergencyContact.phone}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skills */}
      <Card>
        <CardTitle as="h2">Skills</CardTitle>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {employee.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm"
              >
                {skill.name} - {skill.level} ({skill.yearsExperience} yrs)
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDetail;
