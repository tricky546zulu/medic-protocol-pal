
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { useServiceWorker } from "@/hooks/useServiceWorker";
import Index from "./pages/Index";
import Medications from "./pages/Medications";
import MedicationDetail from "./pages/MedicationDetail";
import MyFavorites from "./pages/MyFavorites";
import AdminPanel from "./pages/AdminPanel";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  useServiceWorker();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <OfflineIndicator />
      <main>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/medications/:id" element={<MedicationDetail />} />
          <Route path="/favorites" element={<MyFavorites />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
