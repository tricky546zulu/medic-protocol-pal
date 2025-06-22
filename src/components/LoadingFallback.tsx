
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingFallbackProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingFallback = ({ 
  message = 'Loading...', 
  size = 'md' 
}: LoadingFallbackProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
      <p className="mt-2 text-sm text-gray-600">{message}</p>
    </div>
  );
};
