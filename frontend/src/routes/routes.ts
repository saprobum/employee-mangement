// Centralized Route Configuration
// Use these routes throughout the application for consistent navigation

export class Routes {
  // Authentication
  static readonly login: string = "/login";
  static readonly forgotPassword: string = "/forgot-password";
  static readonly otpVerification: string = "/otp-verification";
  static readonly createPassword: string = "/create-password";
  static readonly passwordSet: string = "/password-set";
  static readonly linkExpired: string = "/link-expired";
  static readonly securityQuestion: string = "/security-question";
  static readonly securityQuestionChoose: string = "/security-question-choose";

  // Main Dashboard
  static readonly dashboard: string = "/dashboard";

  // Employee Management
  static readonly employeeList: string = "/employees";
  static readonly employeeForm: string = "/employees/add";
  static readonly employeeEdit: string = "/employees/:id/edit";
  static readonly employeeDetail: string = "/employees/:id";
  static readonly employeeProfile: string = "/employees/profile/:id";

  // Timesheet Management
  static readonly timesheetList: string = "/timesheets";
  static readonly timesheetForm: string = "/timesheets/add";
  static readonly timesheetEdit: string = "/timesheets/:id/edit";
  static readonly timesheetDetail: string = "/timesheets/:id";
  static readonly timesheetApprove: string = "/timesheets/:id/approve";

  // User Management (Admin)
  static readonly userList: string = "/users";
  static readonly userForm: string = "/users/add";
  static readonly userEdit: string = "/users/:id/edit";
  static readonly userProfile: string = "/users/profile/:id";

  // Role & Permission Management (Admin)
  static readonly roleList: string = "/roles";
  static readonly roleForm: string = "/roles/add";
  static readonly roleEdit: string = "/roles/:id/edit";
  static readonly rolePermissions: string = "/roles/:id/permissions";

  // Department Management
  static readonly departmentList: string = "/departments";
  static readonly departmentForm: string = "/departments/add";
  static readonly departmentEdit: string = "/departments/:id/edit";

  // Designation Management
  static readonly designationList: string = "/designations";
  static readonly designationForm: string = "/designations/add";
  static readonly designationEdit: string = "/designations/:id/edit";

  // Vendor Management
  static readonly vendorList: string = "/vendors";
  static readonly vendorForm: string = "/vendors/add";
  static readonly vendorEdit: string = "/vendors/:id/edit";
  static readonly vendorDetail: string = "/vendors/:id";

  // Vendor Employee Resources
  static readonly vendorEmployeeList: string = "/vendor-employees";
  static readonly vendorEmployeeForm: string = "/vendor-employees/add";
  static readonly vendorEmployeeEdit: string = "/vendor-employees/:id/edit";
  static readonly vendorEmployeeDetail: string = "/vendor-employees/:id";

  // Contractor Employee Resources
  static readonly contractorEmployeeList: string = "/contractor-employees";
  static readonly contractorEmployeeForm: string = "/contractor-employees/add";
  static readonly contractorEmployeeEdit: string = "/contractor-employees/:id/edit";
  static readonly contractorEmployeeDetail: string = "/contractor-employees/:id";

  // Client Management
  static readonly clientList: string = "/clients";
  static readonly clientForm: string = "/clients/add";
  static readonly clientEdit: string = "/clients/:id/edit";
  static readonly clientDetail: string = "/clients/:id";
  static readonly clientView: string = "/clients/view/:id";

  // Project Management
  static readonly projectList: string = "/projects";
  static readonly projectForm: string = "/projects/add";
  static readonly projectEdit: string = "/projects/:id/edit";
  static readonly projectDetail: string = "/projects/:id";

  // Asset Management
  static readonly assetList: string = "/assets";
  static readonly assetForm: string = "/assets/add";
  static readonly assetEdit: string = "/assets/:id/edit";
  static readonly assetDetail: string = "/assets/:id";

  // Document Management
  static readonly documentUpload: string = "/documents/upload";
  static readonly documentList: string = "/documents";
  static readonly documentPreview: string = "/documents/preview/:id";
  static readonly documentView: string = "/documents/view/:id";
  static readonly documentVault: string = "/document-vault";
  static readonly documentVaultForm: string = "/document-vault/add";
  static readonly documentTrack: string = "/document-track";
  static readonly documentTrackDetail: string = "/document-track/:type/:id";

  // Document Requests
  static readonly documentRequestList: string = "/document-requests";
  static readonly documentRequestDetail: string = "/document-requests/:id";

  // Interview Management
  static readonly interviewList: string = "/interviews";
  static readonly interviewSchedule: string = "/interviews/schedule";
  static readonly interviewForm: string = "/interviews/add";
  static readonly interviewStatusList: string = "/interview-status";
  static readonly interviewStatusForm: string = "/interview-status/add";

  // Talent Acquisition / Hiring
  static readonly talentAcquisitionList: string = "/talent-acquisition";
  static readonly talentAcquisitionForm: string = "/talent-acquisition/add";
  static readonly jobPostList: string = "/job-posts";
  static readonly jobPostForm: string = "/job-posts/add";
  static readonly jobPostEdit: string = "/job-posts/:id/edit";
  static readonly jobInformationList: string = "/job-information";
  static readonly jobInformationDetail: string = "/job-information/details/:id";
  static readonly talentPoolManage: string = "/talent-pool";
  static readonly talentPoolDetail: string = "/talent-pool/profile/:id";
  static readonly hiringResourceProfile: string = "/talent-pool/hiring/:id";
  static readonly recommendedProfilesList: string = "/recommended-profiles";
  static readonly recommendedProfileDetail: string = "/recommended-profiles/details/:id";

  // Offboarding
  static readonly offboardResourcesList: string = "/offboard-resources";
  static readonly offboardResourcesForm: string = "/offboard-resources/add";
  static readonly offboardResourcesEdit: string = "/offboard-resources/:id/edit";

  // Leave Management
  static readonly leaveRequestList: string = "/leave-requests";
  static readonly leaveRequestForm: string = "/leave-requests/add";
  static readonly leaveApprove: string = "/leave-requests/approve/:id";
  static readonly leaveSettings: string = "/leave-settings";
  static readonly leaveSettingsForm: string = "/leave-settings/:type/:id";

  // Expense Claim System
  static readonly expenseClaimList: string = "/expense-claims";
  static readonly expenseClaimForm: string = "/expense-claims/add";
  static readonly expenseClaimEdit: string = "/expense-claims/edit/:id";
  static readonly expenseClaimApprove: string = "/expense-claims/approve/:id";

  // Service Tickets
  static readonly serviceList: string = "/service-tickets";
  static readonly serviceRequest: string = "/service-tickets/request";
  static readonly serviceTicketDetail: string = "/service-tickets/details/:id";
  static readonly coordinatorTicketList: string = "/coordinator-tickets";
  static readonly coordinatorTicketDetail: string = "/coordinator-tickets/details/:id";
  static readonly adminTicketList: string = "/admin-tickets";
  static readonly adminTicketDetail: string = "/admin-tickets/details/:id";

  // Skills Management
  static readonly skillList: string = "/skills";
  static readonly skillForm: string = "/skills/add";
  static readonly skillEdit: string = "/skills/:id/edit";

  // Settings
  static readonly settings: string = "/settings";
  static readonly systemInfo: string = "/system-info";

  // Profile
  static readonly myProfile: string = "/my-profile";
  static readonly resourceProfile: string = "/resource-profile/:id";
  static readonly userProfileSettings: string = "/user-profile";

  // Payroll
  static readonly payrollHistory: string = "/payroll-history";
  static readonly myPay: string = "/my-payslips";

  // Bulk Operations
  static readonly bulkUpload: string = "/bulk-upload/:type";

  // Verification
  static readonly verifiedEmployed: string = "/verified-employed/:type/:url";
}

// Route helpers
export class RouteHelpers {
  // Dynamic route builders
  static employeeEdit(id: string | number): string {
    return `/employees/${id}/edit`;
  }

  static employeeDetail(id: string | number): string {
    return `/employees/${id}`;
  }

  static userEdit(id: string | number): string {
    return `/users/${id}/edit`;
  }

  static roleEdit(id: string | number): string {
    return `/roles/${id}/edit`;
  }

  static rolePermissions(id: string | number): string {
    return `/roles/${id}/permissions`;
  }

  static clientView(id: string | number): string {
    return `/clients/view/${id}`;
  }

  static documentPreview(id: string | number): string {
    return `/documents/preview/${id}`;
  }

  static documentView(id: string | number): string {
    return `/documents/view/${id}`;
  }

  static interviewDetail(id: string | number): string {
    return `/interviews/${id}`;
  }

  static projectDetail(id: string | number): string {
    return `/projects/${id}`;
  }

  static vendorDetail(id: string | number): string {
    return `/vendors/${id}`;
  }

  static timesheetApproval(type: string, id: string | number, userId: string | number): string {
    return `/timesheets/approval/${type}/${id}/${userId}`;
  }

  static leaveApprove(id: string | number): string {
    return `/leave-requests/approve/${id}`;
  }

  static expenseClaimApprove(id: string | number): string {
    return `/expense-claims/approve/${id}`;
  }

  static documentTrackDetail(type: string, id: string | number): string {
    return `/document-track/${type}/${id}`;
  }

  static jobPostEdit(id: string | number): string {
    return `/job-posts/${id}/edit`;
  }

  static talentPoolDetail(id: string | number): string {
    return `/talent-pool/profile/${id}`;
  }

  static hiringResourceProfile(id: string | number): string {
    return `/talent-pool/hiring/${id}`;
  }

  static recommendedProfileDetail(id: string | number): string {
    return `/recommended-profiles/details/${id}`;
  }

  static serviceTicketDetail(id: string | number): string {
    return `/service-tickets/details/${id}`;
  }

  static coordinatorTicketDetail(id: string | number): string {
    return `/coordinator-tickets/details/${id}`;
  }

  static adminTicketDetail(id: string | number): string {
    return `/admin-tickets/details/${id}`;
  }
}

export default Routes;
