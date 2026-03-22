import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import AppRoutes from './routes/routes';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Auth
import Login from './pages/auth/Login';
// Protected Route
import ProtectedRoute from './components/ProtectedRoute';
import PermissionRoute from './components/PermissionRoute';

// Pages
import { Dashboard } from './pages/dashboard';
import { EmployeeList, EmployeeForm, EmployeeDetail } from './pages/employees';
import { TimesheetList, TimesheetForm } from './pages/timesheets';

// Placeholder components for routes not yet implemented
const UsersList: React.FC = () => <div className="p-6"><h1 className="text-2xl font-bold">User Management</h1></div>;
const RolesList: React.FC = () => <div className="p-6"><h1 className="text-2xl font-bold">Roles & Permissions</h1></div>;
const Settings: React.FC = () => <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1></div>;
const Departments: React.FC = () => <div className="p-6"><h1 className="text-2xl font-bold">Departments</h1></div>;
const Designations: React.FC = () => <div className="p-6"><h1 className="text-2xl font-bold">Designations</h1></div>;
const Vendors: React.FC = () => <div className="p-6"><h1 className="text-2xl font-bold">Vendors</h1></div>;
const Clients: React.FC = () => <div className="p-6"><h1 className="text-2xl font-bold">Clients</h1></div>;
const Projects: React.FC = () => <div className="p-6"><h1 className="text-2xl font-bold">Projects</h1></div>;
const Assets: React.FC = () => <div className="p-6"><h1 className="text-2xl font-bold">Assets</h1></div>;
const Documents: React.FC = () => <div className="p-6"><h1 className="text-2xl font-bold">Documents</h1></div>;
const Interviews: React.FC = () => <div className="p-6"><h1 className="text-2xl font-bold">Interviews</h1></div>;
const TalentAcquisition: React.FC = () => <div className="p-6"><h1 className="text-2xl font-bold">Talent Acquisition</h1></div>;
const Timesheets: React.FC = () => <div className="p-6"><h1 className="text-2xl font-bold">Timesheets</h1></div>;
const LeaveManagement: React.FC = () => <div className="p-6"><h1 className="text-2xl font-bold">Leave Management</h1></div>;
const ExpenseClaims: React.FC = () => <div className="p-6"><h1 className="text-2xl font-bold">Expense Claims</h1></div>;
const ServiceTickets: React.FC = () => <div className="p-6"><h1 className="text-2xl font-bold">Service Tickets</h1></div>;
const Skills: React.FC = () => <div className="p-6"><h1 className="text-2xl font-bold">Skills</h1></div>;
const Payroll: React.FC = () => <div className="p-6"><h1 className="text-2xl font-bold">Payroll</h1></div>;
const MyProfile: React.FC = () => <div className="p-6"><h1 className="text-2xl font-bold">My Profile</h1></div>;
const NotFound: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Page not found</p>
      <a href={AppRoutes.dashboard} className="text-blue-600 hover:text-blue-700 font-medium">
        Go to Dashboard →
      </a>
    </div>
  </div>
);

function App() {
  const { checkAuth, isLoading } = useAuthStore();

  // Check authentication on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <RouterRoutes>
        {/* Public Routes */}
        <Route path={AppRoutes.login} element={<Login />} />
        <Route path={AppRoutes.forgotPassword} element={<div className="p-6">Forgot Password (Coming Soon)</div>} />
        <Route path={AppRoutes.otpVerification} element={<div className="p-6">OTP Verification (Coming Soon)</div>} />
        <Route path={AppRoutes.createPassword} element={<div className="p-6">Create Password (Coming Soon)</div>} />
        <Route path={AppRoutes.linkExpired} element={<div className="p-6">Link Expired (Coming Soon)</div>} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to={AppRoutes.dashboard} replace />} />
          
          {/* Dashboard */}
          <Route path={AppRoutes.dashboard} element={<Dashboard />} />

          {/* Employees - Permission based */}
          <Route path={AppRoutes.employeeList} element={
            <PermissionRoute permission="EMPLOYEE_VIEW">
              <EmployeeList />
            </PermissionRoute>
          } />
          <Route path={AppRoutes.employeeForm} element={
            <PermissionRoute permission="EMPLOYEE_CREATE">
              <EmployeeForm />
            </PermissionRoute>
          } />
          <Route path={AppRoutes.employeeEdit} element={
            <PermissionRoute permission="EMPLOYEE_EDIT">
              <EmployeeForm />
            </PermissionRoute>
          } />
          <Route path={AppRoutes.employeeDetail} element={
            <PermissionRoute permission="EMPLOYEE_VIEW">
              <EmployeeDetail />
            </PermissionRoute>
          } />

          {/* Timesheets */}
          <Route path={AppRoutes.timesheetList} element={
            <PermissionRoute permission="TIMESHEET_VIEW">
              <TimesheetList />
            </PermissionRoute>
          } />
          <Route path={AppRoutes.timesheetForm} element={
            <PermissionRoute permission="TIMESHEET_CREATE">
              <TimesheetForm />
            </PermissionRoute>
          } />
          <Route path={AppRoutes.timesheetEdit} element={
            <PermissionRoute permission="TIMESHEET_EDIT">
              <TimesheetForm />
            </PermissionRoute>
          } />
          <Route path={AppRoutes.timesheetDetail} element={
            <PermissionRoute permission="TIMESHEET_VIEW">
              <TimesheetForm />
            </PermissionRoute>
          } />

          {/* Users - Admin only */}
          <Route path={AppRoutes.userList} element={
            <PermissionRoute permission="USER_VIEW">
              <UsersList />
            </PermissionRoute>
          } />
          <Route path={AppRoutes.userForm} element={
            <PermissionRoute permission="USER_CREATE">
              <UsersList />
            </PermissionRoute>
          } />

          {/* Roles - Admin only */}
          <Route path={AppRoutes.roleList} element={
            <PermissionRoute permission="ROLE_VIEW">
              <RolesList />
            </PermissionRoute>
          } />
          <Route path={AppRoutes.roleForm} element={
            <PermissionRoute permission="ROLE_CREATE">
              <RolesList />
            </PermissionRoute>
          } />

          {/* Departments */}
          <Route path={AppRoutes.departmentList} element={
            <PermissionRoute permission="SETTINGS_VIEW">
              <Departments />
            </PermissionRoute>
          } />
          <Route path={AppRoutes.departmentForm} element={
            <PermissionRoute permission="SETTINGS_EDIT">
              <Departments />
            </PermissionRoute>
          } />

          {/* Designations */}
          <Route path={AppRoutes.designationList} element={
            <PermissionRoute permission="SETTINGS_VIEW">
              <Designations />
            </PermissionRoute>
          } />

          {/* Vendors */}
          <Route path={AppRoutes.vendorList} element={
            <PermissionRoute permission="USER_VIEW">
              <Vendors />
            </PermissionRoute>
          } />

          {/* Clients */}
          <Route path={AppRoutes.clientList} element={
            <PermissionRoute permission="USER_VIEW">
              <Clients />
            </PermissionRoute>
          } />

          {/* Projects */}
          <Route path={AppRoutes.projectList} element={
            <PermissionRoute permission="USER_VIEW">
              <Projects />
            </PermissionRoute>
          } />

          {/* Assets */}
          <Route path={AppRoutes.assetList} element={
            <PermissionRoute permission="USER_VIEW">
              <Assets />
            </PermissionRoute>
          } />

          {/* Documents */}
          <Route path={AppRoutes.documentList} element={
            <PermissionRoute permission="USER_VIEW">
              <Documents />
            </PermissionRoute>
          } />
          <Route path={AppRoutes.documentUpload} element={
            <PermissionRoute permission="USER_CREATE">
              <Documents />
            </PermissionRoute>
          } />

          {/* Interviews */}
          <Route path={AppRoutes.interviewList} element={
            <PermissionRoute permission="USER_VIEW">
              <Interviews />
            </PermissionRoute>
          } />

          {/* Talent Acquisition */}
          <Route path={AppRoutes.talentAcquisitionList} element={
            <PermissionRoute permission="USER_VIEW">
              <TalentAcquisition />
            </PermissionRoute>
          } />
          <Route path={AppRoutes.jobPostList} element={
            <PermissionRoute permission="USER_VIEW">
              <TalentAcquisition />
            </PermissionRoute>
          } />

          {/* Timesheets */}
          <Route path={AppRoutes.timesheetList} element={
            <PermissionRoute permission="USER_VIEW">
              <Timesheets />
            </PermissionRoute>
          } />

          {/* Leave Management */}
          <Route path={AppRoutes.leaveRequestList} element={
            <PermissionRoute permission="USER_VIEW">
              <LeaveManagement />
            </PermissionRoute>
          } />
          <Route path={AppRoutes.leaveSettings} element={
            <PermissionRoute permission="SETTINGS_VIEW">
              <LeaveManagement />
            </PermissionRoute>
          } />

          {/* Expense Claims */}
          <Route path={AppRoutes.expenseClaimList} element={
            <PermissionRoute permission="USER_VIEW">
              <ExpenseClaims />
            </PermissionRoute>
          } />

          {/* Service Tickets */}
          <Route path={AppRoutes.serviceList} element={
            <PermissionRoute permission="USER_VIEW">
              <ServiceTickets />
            </PermissionRoute>
          } />

          {/* Skills */}
          <Route path={AppRoutes.skillList} element={
            <PermissionRoute permission="USER_VIEW">
              <Skills />
            </PermissionRoute>
          } />

          {/* Payroll */}
          <Route path={AppRoutes.payrollHistory} element={
            <PermissionRoute permission="USER_VIEW">
              <Payroll />
            </PermissionRoute>
          } />
          <Route path={AppRoutes.myPay} element={
            <PermissionRoute permission="USER_VIEW">
              <Payroll />
            </PermissionRoute>
          } />

          {/* Profile */}
          <Route path={AppRoutes.myProfile} element={<MyProfile />} />

          {/* Settings */}
          <Route path={AppRoutes.settings} element={
            <PermissionRoute permission="SETTINGS_VIEW">
              <Settings />
            </PermissionRoute>
          } />
          <Route path={AppRoutes.systemInfo} element={
            <PermissionRoute permission="SETTINGS_VIEW">
              <Settings />
            </PermissionRoute>
          } />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
    </Router>
  );
}

export default App;
