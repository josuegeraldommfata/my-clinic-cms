import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { ThemeApplier } from "@/components/ThemeApplier";
import Home from "./pages/Home";
import QuemSomos from "./pages/QuemSomos";
import Agenda from "./pages/Agenda";
import Conteudo from "./pages/Conteudo";
import Post from "./pages/Post";
import Contato from "./pages/Contato";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeApplier />
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/quem-somos" element={<QuemSomos />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/conteudo" element={<Conteudo />} />
            <Route path="/conteudo/:id" element={<Post />} />
            <Route path="/contato" element={<Contato />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
