'use client';

import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-bold text-[#1F150E] mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl bg-[#EFE7DC] hover:bg-white focus:bg-white border border-[#D5C5B5] text-[#1F150E]',
            'placeholder:text-[#8C7969]',
            'focus:outline-none focus:ring-2 focus:ring-[#A34E17]/30 focus:border-[#A34E17]',
            'transition-all duration-200 shadow-2xs',
            error && 'border-red-500 focus:ring-red-200 focus:border-red-500 bg-red-50/50',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-[#6E5A4B]">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
