import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
            {props.required && <span className="text-coral ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-2 bg-white dark:bg-dark-bg border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary min-h-[44px] ${
            error
              ? 'border-coral focus:border-coral'
              : 'border-neutral-light dark:border-dark-bg hover:border-primary dark:hover:border-dark-primary'
          } ${className} dark:text-dark-text`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-coral">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
