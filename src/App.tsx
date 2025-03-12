
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import RFQList from "./pages/RFQList";
import CreateRFQ from "./pages/CreateRFQ";
import ProposalsList from "./pages/ProposalsList";
import ComparisonView from "./pages/ComparisonView";
import CallForBids from "./pages/CallForBids";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

// Supplier pages
import SupplierDashboard from "./pages/supplier/Dashboard";
import SupplierRFQList from "./pages/supplier/RFQList";
import MyProposals from "./pages/supplier/MyProposals";
import SubmitProposal from "./pages/supplier/SubmitProposal";
import EditRFQ from "./pages/supplier/EditRFQ";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Default route redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Purchaser Routes */}
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/rfq-list" element={<Layout><RFQList /></Layout>} />
          <Route path="/create-rfq" element={<Layout><CreateRFQ /></Layout>} />
          <Route path="/proposals-list" element={<Layout><ProposalsList /></Layout>} />
          <Route path="/comparison-view" element={<Layout><ComparisonView /></Layout>} />
          <Route path="/call-for-bids" element={<Layout><CallForBids /></Layout>} />
          
          {/* Supplier Routes */}
          <Route path="/supplier/dashboard" element={<Layout><SupplierDashboard /></Layout>} />
          <Route path="/supplier/rfq-list" element={<Layout><SupplierRFQList /></Layout>} />
          <Route path="/supplier/my-proposals" element={<Layout><MyProposals /></Layout>} />
          <Route path="/supplier/submit-proposal" element={<Layout><SubmitProposal /></Layout>} />
          <Route path="/supplier/edit-rfq" element={<Layout><EditRFQ /></Layout>} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
