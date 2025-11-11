import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PresenterView from "./pages/PresenterView";
import Auth from "./pages/Auth";
import UploadVideos from "./pages/UploadVideos";
import ManageVideos from "./pages/ManageVideos";
import ManageMusic from "./pages/ManageMusic";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/presenter" element={<PresenterView />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/upload-videos" element={<UploadVideos />} />
          <Route path="/manage-videos" element={<ManageVideos />} />
          <Route path="/manage-music" element={<ManageMusic />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
