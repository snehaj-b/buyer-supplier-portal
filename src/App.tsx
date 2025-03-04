
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import RFQList from "./pages/RFQList";
import CreateRFQ from "./pages/CreateRFQ";
import ProposalsList from "./pages/ProposalsList";
import ComparisonView from "./pages/ComparisonView";
import CallForBids from "./pages/CallForBids";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/rfq-list" element={<Layout><RFQList /></Layout>} />
          <Route path="/create-rfq" element={<Layout><CreateRFQ /></Layout>} />
          <Route path="/proposals-list" element={<Layout><ProposalsList /></Layout>} />
          <Route path="/comparison-view" element={<Layout><ComparisonView /></Layout>} />
          <Route path="/call-for-bids" element={<Layout><CallForBids /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
