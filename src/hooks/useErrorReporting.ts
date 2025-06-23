import { useCallback, useRef } from 'react';

interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  timestamp: number;
  userAgent: string;
  userId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
  sessionId: string;
  buildVersion?: string;
}

interface ErrorMetrics {
  errorCount: number;
  lastError: number;
  errorRate: number;
}

export const useErrorReporting = () => {
  const sessionId = useRef(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const errorMetrics = useRef<ErrorMetrics>({ errorCount: 0, lastError: 0, errorRate: 0 });

  const determineErrorSeverity = (error: Error, context?: Record<string, any>): 'low' | 'medium' | 'high' | 'critical' => {
    const message = error.message.toLowerCase();
    const stack = error.stack?.toLowerCase() || '';
    
    // Critical errors that affect core functionality
    if (message.includes('network') || message.includes('failed to fetch') || 
        message.includes('medication') || message.includes('dosing') ||
        stack.includes('medicationdetail') || stack.includes('medications')) {
      return 'critical';
    }
    
    // High priority errors
    if (message.includes('chunk') || message.includes('loading') || 
        message.includes('routing') || message.includes('navigation')) {
      return 'high';
    }
    
    // Medium priority errors
    if (message.includes('render') || message.includes('component') ||
        message.includes('ui') || message.includes('state')) {
      return 'medium';
    }
    
    // Default to low for other errors
    return 'low';
  };

  const updateErrorMetrics = () => {
    const now = Date.now();
    errorMetrics.current.errorCount++;
    
    // Calculate error rate (errors per minute)
    const timeSinceLastError = now - errorMetrics.current.lastError;
    if (timeSinceLastError > 0) {
      errorMetrics.current.errorRate = errorMetrics.current.errorCount / (timeSinceLastError / 60000);
    }
    
    errorMetrics.current.lastError = now;
  };

  const reportError = useCallback((error: Error, context?: Record<string, any>) => {
    updateErrorMetrics();
    
    const severity = determineErrorSeverity(error, context);
    
    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      severity,
      context: {
        ...context,
        errorMetrics: { ...errorMetrics.current },
        connectionType: (navigator as any).connection?.effectiveType || 'unknown',
        onlineStatus: navigator.onLine,
        memoryUsage: (performance as any).memory ? {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        } : undefined
      },
      sessionId: sessionId.current,
      buildVersion: process.env.NODE_ENV === 'production' ? '1.0.0' : 'development',
    };

    // Enhanced logging based on severity
    if (process.env.NODE_ENV === 'development') {
      const logMethod = severity === 'critical' ? 'error' : severity === 'high' ? 'warn' : 'log';
      console[logMethod](`[${severity.toUpperCase()}] Error Report:`, errorReport);
    }

    // Store error reports with priority-based limits
    try {
      const existingErrors = JSON.parse(localStorage.getItem('error_reports') || '[]');
      existingErrors.push(errorReport);
      
      // Prioritize critical and high severity errors
      const sortedErrors = existingErrors.sort((a: ErrorReport, b: ErrorReport) => {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity] || b.timestamp - a.timestamp;
      });
      
      // Keep more critical errors, fewer low priority ones
      const maxErrors = severity === 'critical' ? 50 : severity === 'high' ? 30 : 20;
      const limitedErrors = sortedErrors.slice(0, maxErrors);
      
      localStorage.setItem('error_reports', JSON.stringify(limitedErrors));
      
      // Store metrics separately
      localStorage.setItem('error_metrics', JSON.stringify(errorMetrics.current));
      
    } catch (storageError) {
      console.error('Failed to store error report:', storageError);
    }

    // In production, you could send critical errors to an external service
    if (process.env.NODE_ENV === 'production' && (severity === 'critical' || severity === 'high')) {
      // Example: Send to external error tracking service
      // sendToErrorService(errorReport);
    }

    // Trigger alerts for critical medical application errors
    if (severity === 'critical') {
      // You could show a toast notification or trigger an alert
      console.error('CRITICAL ERROR in medical application:', errorReport);
    }
  }, []);

  const clearErrorReports = useCallback(() => {
    localStorage.removeItem('error_reports');
    localStorage.removeItem('error_metrics');
    errorMetrics.current = { errorCount: 0, lastError: 0, errorRate: 0 };
  }, []);

  const getErrorReports = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem('error_reports') || '[]');
    } catch {
      return [];
    }
  }, []);

  const getErrorMetrics = useCallback(() => {
    try {
      const stored = localStorage.getItem('error_metrics');
      return stored ? JSON.parse(stored) : errorMetrics.current;
    } catch {
      return errorMetrics.current;
    }
  }, []);

  const getErrorSummary = useCallback(() => {
    const reports = getErrorReports();
    const summary = {
      total: reports.length,
      critical: reports.filter((r: ErrorReport) => r.severity === 'critical').length,
      high: reports.filter((r: ErrorReport) => r.severity === 'high').length,
      medium: reports.filter((r: ErrorReport) => r.severity === 'medium').length,
      low: reports.filter((r: ErrorReport) => r.severity === 'low').length,
      lastError: reports.length > 0 ? new Date(Math.max(...reports.map((r: ErrorReport) => r.timestamp))) : null,
    };
    return summary;
  }, []);

  return { 
    reportError, 
    clearErrorReports, 
    getErrorReports, 
    getErrorMetrics, 
    getErrorSummary 
  };
};
