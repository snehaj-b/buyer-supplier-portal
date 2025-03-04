
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProposalsList = () => {
  const { toast } = useToast();
  
  const rfqDetails = {
    number: 1,
    version: 2,
    title: 'Office Supplies Procurement'
  };
  
  const suppliers = [
    { name: 'ABC Corporation', status: 'L2', id: 1 },
    { name: 'XYZ Limited', status: 'L1', id: 2 },
    { name: 'DEF Industries', status: 'L3', id: 3 }
  ];
  
  const handleViewProposal = (supplierId: number) => {
    toast({
      title: "View Proposal",
      description: `Viewing proposal from supplier #${supplierId}`,
    });
  };
  
  const handleDownloadExcel = () => {
    toast({
      title: "Download Excel",
      description: "Downloading proposals as Excel file",
    });
  };

  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Proposals List View</h1>
          <p className="text-gray-500">Review proposal submissions from suppliers</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleDownloadExcel}>
          <Download size={16} /> Download as Excel
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Request For Quotation No:</h3>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-gray-100 rounded-md text-gray-900 font-medium">
                  {rfqDetails.number}
                </div>
                <div className="px-4 py-2 bg-blue-50 text-blue-800 rounded-md font-medium">
                  Version {rfqDetails.version}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Title:</h3>
              <div className="px-4 py-2 bg-gray-100 rounded-md text-gray-900">
                {rfqDetails.title}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-y border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Supplier Name</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium">{supplier.name}</td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span 
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          supplier.status === 'L1' 
                            ? 'bg-green-100 text-green-800'
                            : supplier.status === 'L2'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {supplier.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        onClick={() => handleViewProposal(supplier.id)}
                      >
                        <Eye size={14} className="mr-1" /> View Proposal
                      </Button>
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

export default ProposalsList;
