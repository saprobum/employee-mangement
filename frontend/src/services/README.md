# Backend Integration Guide

This guide explains how to integrate the frontend with the backend microservices.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── config/
│   │   └── network.ts          # API endpoints configuration
│   ├── services/
│   │   ├── index.ts            # Export all services
│   │   ├── axiosConfig.ts      # Axios configuration & interceptors
│   │   ├── auth.ts             # Authentication service
│   │   ├── userService.ts      # User management service
│   │   └── employeeService.ts  # Employee management service
│   └── ...
├── .env                        # Environment variables
└── .env.example               # Example environment file
```

## 🔧 Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

The `.env` file is already configured with:

```env
VITE_API_URL=http://localhost:8080/api
```

This points to your API Gateway.

### 3. Start Backend Services

Make sure all microservices are running:

```bash
# In backend/microservices folder
start-all-services.bat
```

Wait for all services to start:
- API Gateway: http://localhost:8080
- Auth Service: http://localhost:8081
- User Service: http://localhost:8082
- Employee Service: http://localhost:8083

## 🚀 Usage Examples

### Login User

```typescript
import { authService } from './services';

async function handleLogin() {
  try {
    const response = await authService.login('admin', 'admin12');
    
    console.log('Login successful!');
    console.log('Token:', response.token);
    console.log('User:', response.user);
    
    // Navigate to dashboard
    navigate('/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
    alert('Invalid credentials');
  }
}
```

### Get All Employees

```typescript
import { employeeService } from './services';

async function loadEmployees() {
  try {
    const employees = await employeeService.getAllEmployees();
    console.log('Employees:', employees);
    setEmployeeList(employees);
  } catch (error) {
    console.error('Failed to load employees:', error);
  }
}
```

### Create Employee

```typescript
import { employeeService } from './services';

async function addEmployee() {
  try {
    const newEmployee = await employeeService.createEmployee({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@company.com',
      department: 'IT',
      position: 'Developer',
      hireDate: '2024-01-15',
      status: 'ACTIVE'
    });
    
    console.log('Employee created:', newEmployee);
  } catch (error) {
    console.error('Failed to create employee:', error);
  }
}
```

### Get Current User

```typescript
import { authService } from './services';

function getCurrentUserInfo() {
  const user = authService.getCurrentUser();
  console.log('Current user:', user);
  console.log('Role:', user.role);
  console.log('Permissions:', user.permissions);
}
```

### Check Permissions

```typescript
import { authService } from './services';

function checkUserPermissions() {
  // Check if user has specific role
  if (authService.hasRole('SUPER_ADMIN')) {
    // Show admin features
  }
  
  // Check if user has specific permission
  if (authService.hasPermission('EMPLOYEE_CREATE')) {
    // Show create employee button
  }
  
  // Check if user has any of these roles
  if (authService.hasAnyRole(['SUPER_ADMIN', 'HR_MANAGER'])) {
    // Show HR features
  }
}
```

### Logout

```typescript
import { authService } from './services';

function handleLogout() {
  authService.logout();
  navigate('/login');
}
```

## 📝 React Component Example

```typescript
import React, { useEffect, useState } from 'react';
import { employeeService, authService } from '../services';
import { Employee } from '../services';

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.deleteEmployee(id);
        loadEmployees(); // Refresh list
      } catch (err: any) {
        setError(err.message || 'Failed to delete employee');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Employee List</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Position</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.firstName} {emp.lastName}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td>{emp.position}</td>
              <td>
                <button onClick={() => handleDelete(emp.id!)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
```

## 🔐 Authentication Flow

1. User enters credentials on login page
2. Call `authService.login(username, password)`
3. On success, token is saved to localStorage
4. User info is saved to localStorage
5. Redirect to dashboard
6. All subsequent API calls include the token automatically

## 🎯 Available Services

### Auth Service
- `login(username, password)` - Login user
- `logout()` - Logout user
- `getCurrentUser()` - Get current logged-in user
- `isAuthenticated()` - Check if user is logged in
- `hasRole(role)` - Check if user has specific role
- `hasPermission(permission)` - Check if user has permission
- `getToken()` - Get JWT token

### Employee Service
- `getAllEmployees()` - Get all employees
- `getEmployeeById(id)` - Get employee by ID
- `getEmployeeByEmployeeId(employeeId)` - Get by employee ID
- `getEmployeesByDepartment(department)` - Filter by department
- `createEmployee(employee)` - Create new employee
- `updateEmployee(id, employee)` - Update employee
- `deleteEmployee(id)` - Delete employee

### User Service
- `getAllUsers()` - Get all users
- `getUserById(id)` - Get user by ID
- `createUser(user)` - Create new user
- `updateUser(id, user)` - Update user
- `deleteUser(id)` - Delete user

## ⚠️ Error Handling

All services throw errors that you can catch:

```typescript
try {
  const employees = await employeeService.getAllEmployees();
} catch (error: any) {
  console.error('Error:', error.message);
  // Show error to user
  alert(error.message || 'Something went wrong');
}
```

## 🌐 API Base URL

All requests go through the API Gateway at:
```
http://localhost:8080/api
```

The gateway routes requests to appropriate microservices:
- `/api/auth/**` → Auth Service (port 8081)
- `/api/users/**` → User Service (port 8082)
- `/api/employees/**` → Employee Service (port 8083)

## 📊 Default Users

| Username | Password | Role |
|----------|----------|------|
| admin | admin12 | SUPER_ADMIN |
| hrmanager | admin12 | HR_MANAGER |
| employee | admin12 | EMPLOYEE |
