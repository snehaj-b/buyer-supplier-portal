
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileEdit, Eye, ListFilter, Plus, FileBarChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const RFQList = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState('active');
  
  const rfqList = [
    { id: 1, version: 1, title: 'Project A', date: '20-1-25', status: 'Draft' },
    { id: 1, version: 2, title: 'Project A', date: '22-1-25', status: 'Issued' },
    { id: 2, version: 1, title: 'Project B', date: '15-1-25', status: 'Draft' },
    { id: 3, version: 1, title: 'Item C', date: '10-1-25', status: 'Issued' },
    { id: 4, version: 1, title: 'Item D', date: '23-1-25', status: 'Draft' },
  ];

  const filteredRfqs = filter === 'all' 
    ? rfqList 
    : filter === 'active' 
      ? rfqList.filter(rfq => rfq.status === 'Issued') 
      : rfqList.filter(rfq => rfq.status === 'Draft');

  const handleCreateNew = () => {
    toast({
      title: "New RFQ",
      description: "Creating a new Request for Quotation",
    });
  };

  const handleViewRFQ = (id: number) => {
    toast({
      title: "View RFQ",
      description: `Viewing RFQ #${id}`,
    });
  };

  const handleEditRFQ = (id: number) => {
    toast({
      title: "Edit RFQ",
      description: `Editing RFQ #${id}`,
    });
  };

  const handleViewProposals = (id: number) => {
    toast({
      title: "View Proposals",
      description: `Viewing proposals for RFQ #${id}`,
    });
  };

  const handleViewComparison = (id: number) => {
    toast({
      title: "View Comparison",
      description: `Viewing comparison for RFQ #${id}`,
    });
  };

  const handleMakeNewVersion = (id: number) => {
    toast({
      title: "New Version",
      description: `Creating new version of RFQ #${id}`,
    });
  };

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Requests For Quotation</h1>
        <Link to="/create-rfq">
          <Button className="btn-primary flex items-center gap-2" onClick={handleCreateNew}>
            <Plus size={16} /> Create New
          </Button>
        </Link>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <ListFilter size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter Status:</span>
            <Select defaultValue={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active/Issued</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-y border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">RFQ No.</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Version</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">RFQ Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRfqs.map((rfq, index) => (
                  <tr 
                    key={`${rfq.id}-${rfq.version}`} 
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3 text-sm">{rfq.id}</td>
                    <td className="px-4 py-3 text-sm">{rfq.version}</td>
                    <td className="px-4 py-3 text-sm font-medium">{rfq.title}</td>
                    <td className="px-4 py-3 text-sm">{rfq.date}</td>
                    <td className="px-4 py-3 text-sm">
                      <span 
                        className={`px-2 py-1 text-xs rounded-full ${
                          rfq.status === 'Draft' 
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {rfq.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEditRFQ(rfq.id)}
                          className="p-1 rounded text-blue-600 hover:bg-blue-50"
                          title="Edit RFQ"
                        >
                          <FileEdit size={16} />
                        </button>
                        <button 
                          onClick={() => handleViewRFQ(rfq.id)}
                          className="p-1 rounded text-blue-600 hover:bg-blue-50"
                          title="View RFQ"
                        >
                          <Eye size={16} />
                        </button>
                        <Link 
                          to="/proposals-list" 
                          className="p-1 rounded text-blue-600 hover:bg-blue-50"
                          title="View Proposals"
                          onClick={() => handleViewProposals(rfq.id)}
                        >
                          <FileBarChart size={16} />
                        </Link>
                        <Link 
                          to="/comparison-view" 
                          className="p-1 rounded text-green-600 hover:bg-green-50"
                          title="View Comparison"
                          onClick={() => handleViewComparison(rfq.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>
                        </Link>
                        <button 
                          onClick={() => handleMakeNewVersion(rfq.id)}
                          className="p-1 rounded text-purple-600 hover:bg-purple-50 ml-1"
                          title="Make New Version"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16h4v4"/><path d="M20 16v-4m-4-4h4v4"/><path d="M16 12V8m-8 8h4v4"/><path d="M8 20v-4m-4-4h4v4"/><path d="M4 12V8"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RFQList;
