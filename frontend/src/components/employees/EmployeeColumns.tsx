import type { ColumnDef } from '@tanstack/react-table';
import type { Employee } from '../../types/employee';
import { Button } from '../../components/common/Button';

export const createEmployeeColumns = (
  onView: (employee: Employee) => void,
  onEdit: (employee: Employee) => void,
  onDelete: (employee: Employee) => void
): ColumnDef<Employee>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(e.target.checked)}
        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
    ),
    size: 40,
  },
  {
    accessorKey: 'employee',
    header: 'Employee',
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <div className="flex items-center gap-3">
          <img
            src={employee.avatar}
            alt={`${employee.firstName} ${employee.lastName}`}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {employee.firstName} {employee.lastName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{employee.contact.email}</p>
          </div>
        </div>
      );
    },
    size: 250,
  },
  {
    accessorKey: 'jobTitle',
    header: 'Job Title',
    cell: ({ getValue }) => (
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{getValue<string>()}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{(getValue() as any).department}</p>
      </div>
    ),
    size: 150,
  },
  {
    accessorKey: 'department',
    header: 'Department',
    cell: ({ getValue }) => (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        {getValue<string>()}
      </span>
    ),
    size: 120,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<string>();
      const statusStyles = {
        Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        Inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        'On Leave': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      };
      return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status as keyof typeof statusStyles] || statusStyles.Inactive}`}>
          {status}
        </span>
      );
    },
    size: 100,
  },
  {
    accessorKey: 'hireDate',
    header: 'Hire Date',
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
    size: 120,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(employee)}
            title="View Details"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(employee)}
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(employee)}
            title="Delete"
            className="text-red-600 hover:text-red-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>
      );
    },
    size: 120,
  },
];

export default createEmployeeColumns;
