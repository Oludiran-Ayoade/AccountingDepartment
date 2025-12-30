import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-light tracking-wide uppercase mb-2 text-muted-foreground">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 border border-border bg-background/50 text-foreground font-light rounded-xl text-sm',
            'focus:outline-none focus:border-foreground focus:bg-background',
            'placeholder:text-muted-foreground placeholder:font-light',
            'transition-all duration-300',
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs font-light text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
