import { useCallback } from 'react';

interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  timestamp: number;
  userAgent: string;
  userId?: string;
}

export const useErrorReporting = () => {
  const reportError = useCallback((error: Error, context?: Record<string, any>) => {
    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Report:', errorReport, context);
    }

    // In production, send to error reporting service
    // You could integrate with services like Sentry, LogRocket, etc.
    try {
      // Store in localStorage as fallback
      const existingErrors = JSON.parse(localStorage.getItem('error_reports') || '[]');
      existingErrors.push({ ...errorReport, context });
      
      // Keep only last 10 errors
      if (existingErrors.length > 10) {
        existingErrors.splice(0, existingErrors.length - 10);
      }
      
      localStorage.setItem('error_reports', JSON.stringify(existingErrors));
    } catch (storageError) {
      console.error('Failed to store error report:', storageError);
    }
  }, []);

  const clearErrorReports = useCallback(() => {
    localStorage.removeItem('error_reports');
  }, []);

  const getErrorReports = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem('error_reports') || '[]');
    } catch {
      return [];
    }
  }, []);

  return { reportError, clearErrorReports, getErrorReports };
};
