import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { FormInput, FormSelect } from '../../components/forms';
import { useSelectedEmployee, useCreateEmployee, useUpdateEmployee } from '../../store/employeeStore';
import type { Employee } from '../../types/employee';

// Form schema
const employeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  department: z.string().min(1, 'Department is required'),
  status: z.enum(['Active', 'Inactive', 'On Leave']),
  hireDate: z.string().min(1, 'Hire date is required'),
  salary: z.string().min(1, 'Salary is required'),
  manager: z.string().optional(),
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
  emergencyContactName: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

const EmployeeForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  
  const selectedEmployee = useSelectedEmployee();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      jobTitle: '',
      department: '',
      status: 'Active',
      hireDate: '',
      salary: '',
      manager: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      emergencyContactName: '',
      emergencyContactRelation: '',
      emergencyContactPhone: '',
    },
  });

  // Load employee data in edit mode
  useEffect(() => {
    if (isEditMode && id && selectedEmployee) {
      // Employee already loaded via route guard
    }
  }, [isEditMode, id, selectedEmployee]);

  // Populate form with employee data
  useEffect(() => {
    if (selectedEmployee && isEditMode) {
      reset({
        firstName: selectedEmployee.firstName,
        lastName: selectedEmployee.lastName,
        email: selectedEmployee.contact.email,
        phone: selectedEmployee.contact.phone,
        jobTitle: selectedEmployee.jobTitle,
        department: selectedEmployee.department,
        status: selectedEmployee.status,
        hireDate: selectedEmployee.hireDate.split('T')[0],
        salary: selectedEmployee.employment.salary.toString(),
        manager: selectedEmployee.employment.manager || '',
        street: selectedEmployee.address.street,
        city: selectedEmployee.address.city,
        state: selectedEmployee.address.state,
        zipCode: selectedEmployee.address.zipCode,
        country: selectedEmployee.address.country,
        emergencyContactName: selectedEmployee.contact.emergencyContact?.name || '',
        emergencyContactRelation: selectedEmployee.contact.emergencyContact?.relationship || '',
        emergencyContactPhone: selectedEmployee.contact.emergencyContact?.phone || '',
      });
    }
  }, [selectedEmployee, isEditMode, reset]);

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      const employeeData: Partial<Employee> = {
        firstName: data.firstName,
        lastName: data.lastName,
        jobTitle: data.jobTitle,
        department: data.department,
        status: data.status,
        hireDate: new Date(data.hireDate).toISOString(),
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
        },
        contact: {
          email: data.email,
          phone: data.phone,
          emergencyContact: data.emergencyContactName ? {
            name: data.emergencyContactName,
            relationship: data.emergencyContactRelation || '',
            phone: data.emergencyContactPhone || '',
          } : undefined,
        },
        employment: {
          department: data.department,
          position: data.jobTitle,
          startDate: new Date(data.hireDate).toISOString(),
          status: data.status,
          salary: parseFloat(data.salary),
          manager: data.manager || undefined,
        },
        skills: [],
        projects: [],
        certifications: [],
        performanceReviews: [],
      };

      if (isEditMode && id) {
        await updateEmployee(parseInt(id), employeeData);
      } else {
        await createEmployee(employeeData);
      }
      
      navigate('/employees');
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Breadcrumb
          items={[
            { label: 'Employees', href: '/employees' },
            { label: isEditMode ? 'Edit Employee' : 'Add Employee' },
          ]}
        />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
          {isEditMode ? 'Edit Employee' : 'Add New Employee'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isEditMode
            ? 'Update employee information and details.'
            : 'Fill in the information to add a new employee.'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardTitle as="h2">Personal Information</CardTitle>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="First Name"
                  name="firstName"
                  register={register}
                  error={errors.firstName}
                  required
                />
                <FormInput
                  label="Last Name"
                  name="lastName"
                  register={register}
                  error={errors.lastName}
                  required
                />
                <FormInput
                  label="Email"
                  name="email"
                  register={register}
                  error={errors.email}
                  type="email"
                  required
                />
                <FormInput
                  label="Phone"
                  name="phone"
                  register={register}
                  error={errors.phone}
                  type="tel"
                  required
                />
                <FormInput
                  label="Hire Date"
                  name="hireDate"
                  register={register}
                  error={errors.hireDate}
                  type="date"
                  required
                />
                <FormSelect
                  label="Status"
                  name="status"
                  register={register}
                  error={errors.status}
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Inactive', label: 'Inactive' },
                    { value: 'On Leave', label: 'On Leave' },
                  ]}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Employment Information */}
          <Card>
            <CardTitle as="h2">Employment Information</CardTitle>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Job Title"
                  name="jobTitle"
                  register={register}
                  error={errors.jobTitle}
                  required
                />
                <FormSelect
                  label="Department"
                  name="department"
                  register={register}
                  error={errors.department}
                  options={[
                    { value: 'Engineering', label: 'Engineering' },
                    { value: 'Marketing', label: 'Marketing' },
                    { value: 'Sales', label: 'Sales' },
                    { value: 'HR', label: 'HR' },
                    { value: 'Finance', label: 'Finance' },
                    { value: 'Operations', label: 'Operations' },
                  ]}
                  required
                />
                <FormInput
                  label="Salary"
                  name="salary"
                  register={register}
                  error={errors.salary}
                  type="number"
                  required
                  leftIcon={<span className="text-gray-500">$</span>}
                />
                <FormInput
                  label="Manager"
                  name="manager"
                  register={register}
                  error={errors.manager}
                  placeholder="Leave blank if no manager"
                />
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardTitle as="h2">Address Information</CardTitle>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Street"
                  name="street"
                  register={register}
                  error={errors.street}
                  required
                  className="md:col-span-2"
                />
                <FormInput
                  label="City"
                  name="city"
                  register={register}
                  error={errors.city}
                  required
                />
                <FormInput
                  label="State"
                  name="state"
                  register={register}
                  error={errors.state}
                  required
                />
                <FormInput
                  label="ZIP Code"
                  name="zipCode"
                  register={register}
                  error={errors.zipCode}
                  required
                />
                <FormInput
                  label="Country"
                  name="country"
                  register={register}
                  error={errors.country}
                  required
                  className="md:col-span-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardTitle as="h2">Emergency Contact</CardTitle>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Contact Name"
                  name="emergencyContactName"
                  register={register}
                  error={errors.emergencyContactName}
                />
                <FormInput
                  label="Relationship"
                  name="emergencyContactRelation"
                  register={register}
                  error={errors.emergencyContactRelation}
                />
                <FormInput
                  label="Contact Phone"
                  name="emergencyContactPhone"
                  register={register}
                  error={errors.emergencyContactPhone}
                  type="tel"
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/employees')}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update Employee' : 'Add Employee'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
