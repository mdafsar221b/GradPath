import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full p-3 bg-gray-50 border rounded-xl text-sm transition-all focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-[11px] text-red-500 font-medium ml-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
