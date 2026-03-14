import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Accordion from './Accordion';
import { useSelectedEmployee, useEmployeeLoading, useEmployeeError, useFetchEmployee, useSelectEmployee, useClearError } from '../store/employeeStore';

const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State from store
  const selectedEmployee = useSelectedEmployee();
  const storeLoading = useEmployeeLoading();
  const storeError = useEmployeeError();

  // Actions from store (using individual selectors)
  const fetchEmployee = useFetchEmployee();
  const clearError = useClearError();
  const selectEmployee = useSelectEmployee();

  useEffect(() => {
    if (id) {
      clearError();
      fetchEmployee(parseInt(id));
    }
  }, [id, fetchEmployee, clearError]);

  const employee = selectedEmployee;
  const isLoading = storeLoading;
  const currentError = storeError;

  const handleBack = () => {
    selectEmployee(null);
    navigate('/');
  };

  if (isLoading && !employee) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-gray-600 dark:text-gray-400">Loading employee details...</span>
      </div>
    );
  }

  if (currentError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <span className="block sm:inline">{currentError}</span>
          <button
            onClick={() => fetchEmployee(parseInt(id!))}
            className="mt-2 sm:mt-0 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Employee Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300">
            The employee you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to Employee List
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Employee Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <div className="flex flex-col md:flex-row items-center">
            <img 
              className="w-24 h-24 rounded-full border-4 border-white object-cover" 
              src={employee.avatar} 
              alt={`${employee.firstName} ${employee.lastName}`} 
            />
            <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
              <h1 className="text-3xl font-bold">
                {employee.firstName} {employee.lastName}
              </h1>
              <p className="text-xl opacity-90">{employee.jobTitle}</p>
              <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                <span className="bg-blue-400 bg-opacity-50 px-3 py-1 rounded-full text-sm">
                  {employee.department}
                </span>
                <span className="bg-green-400 bg-opacity-50 px-3 py-1 rounded-full text-sm">
                  Hired: {new Date(employee.hireDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="lg:col-span-2">
              <Accordion title="Personal Information" defaultOpen={true}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="Full Name" value={`${employee.firstName} ${employee.lastName}`} />
                  <DetailItem label="Job Title" value={employee.jobTitle} />
                  <DetailItem label="Department" value={employee.department} />
                  <DetailItem label="Hire Date" value={new Date(employee.hireDate).toLocaleDateString()} />
                  <DetailItem label="Status" value={
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      employee.status === 'Active' ? 'bg-green-100 text-green-800' :
                      employee.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {employee.status}
                    </span>
                  } />
                  <DetailItem label="Manager" value={employee.employment.manager || 'N/A'} />
                </div>
              </Accordion>

              {/* Contact Information */}
              <Accordion title="Contact Information" defaultOpen={true}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="Email" value={employee.contact.email} />
                  <DetailItem label="Phone" value={employee.contact.phone} />
                  <DetailItem label="Address" value={`${employee.address.street}, ${employee.address.city}, ${employee.address.state} ${employee.address.zipCode}`} />
                  <DetailItem label="Country" value={employee.address.country} />
                  {employee.contact.emergencyContact && (
                    <>
                      <DetailItem label="Emergency Contact" value={employee.contact.emergencyContact.name} />
                      <DetailItem label="Relationship" value={employee.contact.emergencyContact.relationship} />
                      <DetailItem label="Emergency Phone" value={employee.contact.emergencyContact.phone} />
                    </>
                  )}
                </div>
              </Accordion>

              {/* Employment Details */}
              <Accordion title="Employment Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="Position" value={employee.employment.position} />
                  <DetailItem label="Start Date" value={new Date(employee.employment.startDate).toLocaleDateString()} />
                  {employee.employment.endDate && (
                    <DetailItem label="End Date" value={new Date(employee.employment.endDate).toLocaleDateString()} />
                  )}
                  <DetailItem label="Salary" value={`$${employee.employment.salary.toLocaleString()}`} />
                  <DetailItem label="Employment Status" value={employee.employment.status} />
                </div>
              </Accordion>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Skills */}
              <Accordion title="Skills" defaultOpen={true}>
                <div className="space-y-3">
                  {employee.skills.map((skill, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-100">
                        {skill.level} ({skill.yearsExperience} yrs)
                      </span>
                    </div>
                  ))}
                </div>
              </Accordion>

              {/* Certifications */}
              <Accordion title="Certifications">
                <div className="space-y-4">
                  {employee.certifications.map(cert => (
                    <div key={cert.id} className="border-l-4 border-blue-500 pl-3 py-1">
                      <h4 className="font-semibold text-gray-800 dark:text-white">{cert.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{cert.issuer}</p>
                      <div className="flex justify-between text-xs mt-1">
                        <span>Issued: {new Date(cert.dateIssued).toLocaleDateString()}</span>
                        {cert.expiryDate && (
                          <span>Expires: {new Date(cert.expiryDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Accordion>
            </div>
          </div>

          {/* Projects */}
          <Accordion title="Projects">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Dates</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {employee.projects.map(project => (
                    <tr key={project.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {project.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {project.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(project.startDate).toLocaleDateString()}
                        {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString()}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {project.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Accordion>

          {/* Performance Reviews */}
          <Accordion title="Performance Reviews">
            <div className="space-y-4">
              {employee.performanceReviews.map(review => (
                <div key={review.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">
                        Review by {review.reviewer}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      <span className="font-bold">{review.rating}/5</span>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">{review.comments}</p>
                </div>
              ))}
            </div>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

// Helper component for detail items
const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="border-b border-gray-100 dark:border-gray-700 pb-2">
    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{value}</dd>
  </div>
);

export default EmployeeDetails;