import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { useErrorReporting } from '@/hooks/useErrorReporting';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  level?: 'page' | 'component';
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  private errorReporting: any;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { hasError: true, error, errorId };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Enhanced error logging
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      level: this.props.level || 'component'
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.error('Error Details:', errorDetails);
      console.groupEnd();
    }

    this.setState({
      error,
      errorInfo,
    });

    // Store error report for potential later analysis
    try {
      const existingErrors = JSON.parse(localStorage.getItem('error_reports') || '[]');
      existingErrors.push(errorDetails);
      
      // Keep only last 20 errors
      if (existingErrors.length > 20) {
        existingErrors.splice(0, existingErrors.length - 20);
      }
      
      localStorage.setItem('error_reports', JSON.stringify(existingErrors));
    } catch (storageError) {
      console.error('Failed to store error report:', storageError);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined, errorId: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isPageLevel = this.props.level === 'page';

      return (
        <div className={`${isPageLevel ? 'min-h-screen' : 'min-h-[200px]'} flex items-center justify-center p-4 bg-gray-50`}>
          <div className="max-w-md w-full">
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="flex items-center gap-2">
                {isPageLevel ? 'Application Error' : 'Component Error'}
                {this.state.errorId && (
                  <span className="text-xs font-mono bg-red-100 px-2 py-1 rounded">
                    {this.state.errorId}
                  </span>
                )}
              </AlertTitle>
              <AlertDescription className="mt-2">
                <p className="mb-4">
                  {isPageLevel 
                    ? 'Something went wrong while loading this page. This might be a temporary issue.'
                    : 'A component failed to load properly. You can try refreshing or continue using other parts of the application.'
                  }
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Button onClick={this.handleReset} variant="outline" size="sm">
                    Try Again
                  </Button>
                  {isPageLevel ? (
                    <>
                      <Button onClick={this.handleGoHome} size="sm" variant="outline">
                        <Home className="h-4 w-4 mr-2" />
                        Go Home
                      </Button>
                      <Button onClick={this.handleReload} size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reload Page
                      </Button>
                    </>
                  ) : (
                    <Button onClick={this.handleReload} size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh App
                    </Button>
                  )}
                </div>
              </AlertDescription>
            </Alert>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="p-4 bg-gray-100 rounded text-sm">
                <summary className="cursor-pointer font-medium flex items-center gap-2">
                  <Bug className="h-4 w-4" />
                  Error Details (Development)
                </summary>
                <pre className="mt-2 whitespace-pre-wrap text-xs overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
