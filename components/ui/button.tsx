/** @format */

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'w-full inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white hover:scale-105 shadow-lg hover:shadow-xl focus:ring-indigo-500',
        secondary:
          'backdrop-blur-lg bg-white bg-opacity-20 hover:bg-opacity-30 text-white hover:scale-105 shadow-lg hover:shadow-xl focus:ring-white',
        outline:
          'border-2 border-white text-white hover:bg-white hover:bg-opacity-10 hover:scale-105',
      },
      size: {
        default: 'py-4 px-4',
        sm: 'py-2 px-3',
        lg: 'py-6 px-8',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
