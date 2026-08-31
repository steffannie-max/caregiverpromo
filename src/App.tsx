import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PresenterView from "./pages/PresenterView";
import Auth from "./pages/Auth";
import UploadVideos from "./pages/UploadVideos";
import ManageVideos from "./pages/ManageVideos";
import ManageMusic from "./pages/ManageMusic";
import ViewResponses from "./pages/ViewResponses";
import Showcase from "./pages/Showcase";

const queryClient = new QueryClient();

// Vite's BASE_URL has a trailing slash; React Router's basename should not.
const basename =
  import.meta.env.BASE_URL === "/" ? "/" : import.meta.env.BASE_URL.replace(/\/$/, "");

// The public GitHub Pages mirror is for Oregon Care Partners, so its root
// opens the showcase. Lovable keeps the original course at the root.
const isGithubPages = window.location.hostname.endsWith(".github.io");

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={basename}>
        <Routes>
          <Route
            path="/"
            element={isGithubPages ? <Navigate to="/showcase" replace /> : <Index />}
          />
          <Route path="/course" element={<Index />} />
          <Route path="/presenter" element={<PresenterView />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/upload-videos" element={<UploadVideos />} />
          <Route path="/manage-videos" element={<ManageVideos />} />
          <Route path="/manage-music" element={<ManageMusic />} />
          <Route path="/view-responses" element={<ViewResponses />} />
          <Route path="/showcase" element={<Showcase />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
