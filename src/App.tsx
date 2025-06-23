
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { NetworkStatusIndicator } from "@/components/NetworkStatusIndicator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LoadingFallback } from "@/components/LoadingFallback";
import { useServiceWorker } from "@/hooks/useServiceWorker";
import { usePerformanceMonitoring } from "@/hooks/usePerformanceMonitoring";
import { useErrorReporting } from "@/hooks/useErrorReporting";
import { enhancedMedicationService } from "@/services/enhancedMedicationService";
import Index from "./pages/Index";
import Medications from "./pages/Medications";
import MedicationDetail from "./pages/MedicationDetail";
import MyFavorites from "./pages/MyFavorites";
import AdminPanel from "./pages/AdminPanel";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import "./App.css";
import { useEffect, Suspense } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  const { reportError } = useErrorReporting();
  
  useServiceWorker();
  usePerformanceMonitoring();

  useEffect(() => {
    // Preload critical medication data
    enhancedMedicationService.preloadCriticalData().catch((error) => {
      reportError(error, { context: 'preload_critical_data' });
    });

    // Global error handler for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      reportError(new Error(`Unhandled Promise Rejection: ${event.reason}`), {
        context: 'unhandled_promise_rejection',
        reason: event.reason
      });
    };

    // Global error handler for JavaScript errors
    const handleGlobalError = (event: ErrorEvent) => {
      reportError(new Error(event.message), {
        context: 'global_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleGlobalError);

    // Cache cleanup message to service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        navigator.serviceWorker.controller?.postMessage({
          type: 'CACHE_CLEANUP'
        });
      });
    }

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleGlobalError);
    };
  }, [reportError]);

  return (
    <ErrorBoundary level="page">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-background">
                <ErrorBoundary level="component">
                  <Navigation />
                </ErrorBoundary>
                
                <ErrorBoundary level="component">
                  <NetworkStatusIndicator />
                  <OfflineIndicator />
                </ErrorBoundary>
                
                <ErrorBoundary level="page">
                  <Suspense 
                    fallback={
                      <LoadingFallback 
                        message="Loading application..."
                        variant="medical"
                        size="lg"
                        showTimeout={true}
                        timeoutMessage="Please check your connection if this continues..."
                      />
                    }
                  >
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/medications" element={<Medications />} />
                      <Route path="/medications/:id" element={<MedicationDetail />} />
                      <Route 
                        path="/favorites" 
                        element={
                          <ProtectedRoute>
                            <MyFavorites />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/admin" 
                        element={
                          <ProtectedRoute>
                            <AdminPanel />
                          </ProtectedRoute>
                        } 
                      />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </ErrorBoundary>
              </div>
              <Toaster />
              <Sonner />
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
