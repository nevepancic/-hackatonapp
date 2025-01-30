/** @format */

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4';
}

const variantStyles = {
  h1: 'text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200',
  h2: 'text-3xl font-bold text-white',
  h3: 'text-2xl font-semibold text-white',
  h4: 'text-xl font-medium text-white',
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant = 'h1', children, ...props }, ref) => {
    const Component = variant;
    return (
      <Component
        ref={ref}
        className={cn(variantStyles[variant], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = 'Heading';
