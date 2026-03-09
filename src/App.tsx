import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageSelectDialog } from "@/components/LanguageSelectDialog";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AssistantWidget } from "@/components/AssistantWidget";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import CropSuggestions from "./pages/CropSuggestions";
import PestAdvisoryPage from "./pages/PestAdvisoryPage";
import DiseaseIdentification from "./pages/DiseaseIdentification";
import MarketPrices from "./pages/MarketPrices";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <LanguageSelectDialog />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                <Route path="/crops" element={<ProtectedRoute><CropSuggestions /></ProtectedRoute>} />
                <Route path="/pest" element={<ProtectedRoute><PestAdvisoryPage /></ProtectedRoute>} />
                <Route path="/disease" element={<ProtectedRoute><DiseaseIdentification /></ProtectedRoute>} />
                <Route path="/market" element={<ProtectedRoute><MarketPrices /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <AssistantWidget />
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
