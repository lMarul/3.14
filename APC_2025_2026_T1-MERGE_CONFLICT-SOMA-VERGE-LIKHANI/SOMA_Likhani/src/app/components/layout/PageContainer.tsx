import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className, ...props }: PageContainerProps) {
  return (
    <div 
      className={twMerge(
        "w-full max-w-[min(1200px,calc(100vw-48px))] mx-auto px-4 sm:px-5 md:px-6 lg:px-8", // Responsive padding: mobile-first
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}
