
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, ListFilter, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SupplierRFQList = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState('active');
  
  const rfqList = [
    { id: 1, version: 1, title: 'Project A', date: '20-1-25', status: 'New' },
    { id: 1, version: 2, title: 'Project A', date: '22-1-25', status: 'New' },
    { id: 2, version: 1, title: 'Project B', date: '15-1-25', status: 'Draft' },
    { id: 3, version: 1, title: 'Item C', date: '10-1-25', status: 'Proposal Submitted' },
    { id: 4, version: 1, title: 'Item D', date: '23-1-25', status: 'New' },
  ];

  const filteredRfqs = filter === 'all' 
    ? rfqList 
    : filter === 'active' 
      ? rfqList.filter(rfq => rfq.status === 'New') 
      : rfqList.filter(rfq => rfq.status === 'Proposal Submitted');

  const handleViewRFQ = (id: number) => {
    toast({
      title: "View RFQ",
      description: `Viewing RFQ #${id}`,
    });
  };

  const handleSubmitProposal = (id: number) => {
    toast({
      title: "Submit Proposal",
      description: `Creating proposal for RFQ #${id}`,
    });
  };

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">RFQ Opportunities</h1>
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
                <SelectItem value="active">New RFQs</SelectItem>
                <SelectItem value="submitted">Proposals Submitted</SelectItem>
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
                          rfq.status === 'New' 
                            ? 'bg-green-100 text-green-800'
                            : rfq.status === 'Draft' 
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {rfq.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleViewRFQ(rfq.id)}
                          className="p-1 rounded text-blue-600 hover:bg-blue-50"
                          title="View RFQ"
                        >
                          <Eye size={16} />
                        </button>
                        {rfq.status === 'New' && (
                          <button 
                            onClick={() => handleSubmitProposal(rfq.id)}
                            className="p-1 rounded text-green-600 hover:bg-green-50"
                            title="Submit Proposal"
                          >
                            <FileText size={16} />
                          </button>
                        )}
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

export default SupplierRFQList;
