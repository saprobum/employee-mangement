import type { UseFormRegister, FieldError, FieldValues, Path } from 'react-hook-form';

export interface FormCheckboxProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  helpText?: string;
}

export function FormCheckbox<T extends FieldValues>({
  label,
  name,
  register,
  error,
  required = false,
  disabled = false,
  className = '',
  helpText,
}: FormCheckboxProps<T>) {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          {...register(name)}
          type="checkbox"
          disabled={disabled}
          className={`
            w-5 h-5 rounded border-gray-300 text-blue-600
            focus:ring-2 focus:ring-blue-500 focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed
            dark:border-gray-600 dark:bg-gray-700
          `}
        />
        <div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label} {required && <span className="text-red-500">*</span>}
          </span>
          {helpText && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helpText}</p>
          )}
          {error && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error.message}</p>
          )}
        </div>
      </label>
    </div>
  );
}

export interface FormRadioProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  options: { value: string | number; label: string }[];
  error?: FieldError;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  helpText?: string;
}

export function FormRadio<T extends FieldValues>({
  label,
  name,
  register,
  options,
  error,
  required = false,
  disabled = false,
  className = '',
  orientation = 'vertical',
  helpText,
}: FormRadioProps<T>) {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className={`flex ${orientation === 'horizontal' ? 'flex-wrap gap-4' : 'flex-col gap-2'}`}>
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
            <input
              {...register(name)}
              type="radio"
              value={option.value}
              disabled={disabled}
              className={`
                w-4 h-4 border-gray-300 text-blue-600
                focus:ring-2 focus:ring-blue-500 focus:ring-offset-0
                disabled:opacity-50 disabled:cursor-not-allowed
                dark:border-gray-600 dark:bg-gray-700
              `}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error.message}</p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helpText}</p>
      )}
    </div>
  );
}

export default FormCheckbox;
