
import React from 'react';
import { Loader2, Heart, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoadingFallbackProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'medical' | 'minimal';
  showTimeout?: boolean;
  timeoutMessage?: string;
  error?: boolean;
  onRetry?: () => void;
}

export const LoadingFallback = ({ 
  message = 'Loading...', 
  size = 'md',
  variant = 'medical',
  showTimeout = false,
  timeoutMessage = 'Taking longer than expected...',
  error = false,
  onRetry
}: LoadingFallbackProps) => {
  const [showTimeoutMessage, setShowTimeoutMessage] = React.useState(false);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const containerSizeClasses = {
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-12'
  };

  React.useEffect(() => {
    if (showTimeout && !error) {
      const timer = setTimeout(() => {
        setShowTimeoutMessage(true);
      }, 5000); // Show timeout message after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [showTimeout, error]);

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center ${containerSizeClasses[size]}`}>
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex flex-col gap-2">
            <span>Failed to load content</span>
            {onRetry && (
              <button 
                onClick={onRetry}
                className="text-sm underline hover:no-underline self-start"
              >
                Try again
              </button>
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center justify-center ${containerSizeClasses[size]}`}>
        <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
      </div>
    );
  }

  if (variant === 'medical') {
    return (
      <div className="min-h-[200px] flex items-center justify-center p-8">
        <Card className="bg-white/95 backdrop-blur-lg border border-white/30 rounded-lg shadow-lg max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Heart className={`text-red-500 ${sizeClasses[size]} animate-pulse`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className={`animate-spin text-blue-500 ${sizeClasses[size === 'lg' ? 'md' : 'sm']}`} />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-gray-700 font-medium">{message}</p>
                {showTimeoutMessage && (
                  <p className="text-sm text-amber-600">{timeoutMessage}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${containerSizeClasses[size]}`}>
      <Loader2 className={`animate-spin text-primary ${sizeClasses[size]} mb-2`} />
      <p className="text-sm text-gray-600">{message}</p>
      {showTimeoutMessage && (
        <p className="text-xs text-amber-600 mt-1">{timeoutMessage}</p>
      )}
    </div>
  );
};
