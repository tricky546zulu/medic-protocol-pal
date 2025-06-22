
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
import { useServiceWorker } from "@/hooks/useServiceWorker";
import { usePerformanceMonitoring } from "@/hooks/usePerformanceMonitoring";
import { enhancedMedicationService } from "@/services/enhancedMedicationService";
import Index from "./pages/Index";
import Medications from "./pages/Medications";
import MedicationDetail from "./pages/MedicationDetail";
import MyFavorites from "./pages/MyFavorites";
import AdminPanel from "./pages/AdminPanel";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import "./App.css";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
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
    },
  },
});

function App() {
  useServiceWorker();
  usePerformanceMonitoring();

  useEffect(() => {
    // Preload critical medication data
    enhancedMedicationService.preloadCriticalData();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-background">
                <Navigation />
                <NetworkStatusIndicator />
                <OfflineIndicator />
                
                <ErrorBoundary>
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
