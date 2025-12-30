import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-light tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-full';
  
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:opacity-80',
    secondary: 'bg-secondary text-secondary-foreground hover:opacity-80',
    outline: 'border border-foreground text-foreground hover:bg-foreground hover:text-background',
    ghost: 'hover:opacity-70',
    danger: 'bg-red-600 text-white hover:opacity-80',
  };
  
  const sizes = {
    sm: 'px-5 py-2 text-xs uppercase',
    md: 'px-7 py-2.5 text-sm uppercase',
    lg: 'px-10 py-3 text-sm uppercase',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
