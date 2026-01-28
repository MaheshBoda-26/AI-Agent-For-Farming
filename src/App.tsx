import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LanguageSelectDialog } from "@/components/LanguageSelectDialog";
import { AssistantWidget } from "@/components/AssistantWidget";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import CropSuggestions from "./pages/CropSuggestions";
import PestAdvisoryPage from "./pages/PestAdvisoryPage";
import DiseaseIdentification from "./pages/DiseaseIdentification";
import MarketPrices from "./pages/MarketPrices";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <LanguageSelectDialog />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/crops" element={<CropSuggestions />} />
              <Route path="/pest" element={<PestAdvisoryPage />} />
              <Route path="/disease" element={<DiseaseIdentification />} />
              <Route path="/market" element={<MarketPrices />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <AssistantWidget />
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
