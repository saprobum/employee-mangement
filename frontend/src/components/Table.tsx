import React from 'react';

interface TableColumn<T> {
  header: string;
  accessor: keyof T;
  render?: (value: any, row: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  className?: string;
  onRowClick?: (row: T) => void;
  striped?: boolean;
  hoverable?: boolean;
}

const Table = <T extends Record<string, any>>({
  data,
  columns,
  className = '',
  onRowClick,
  striped = false,
  hoverable = false
}: TableProps<T>) => {
  return (
    <div className="overflow-x-auto ">
      <table className={`min-w-full divide-y divide-gray-200 dark:divide-gray-400 ${className}`}>
        <thead className="bg-gray-50 dark:bg-green-800">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y divide-gray-200 dark:divide-gray-400  ${
          striped ? 'bg-white ' : ''
        }`}>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={`
                ${striped && rowIndex % 2 === 0 ? 'bg-white dark:bg-gray-500' : 'bg-gray-50 dark:bg-gray-600'}
                ${hoverable ? 'hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer' : ''}
                ${onRowClick ? 'cursor-pointer' : ''}
              `}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200"
                >
                  {column.render
                    ? column.render(row[column.accessor], row)
                    : String(row[column.accessor])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;