
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, FileEdit, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MyProposals = () => {
  const { toast } = useToast();
  
  const proposals = [
    { 
      id: 1, 
      rfqId: 1, 
      rfqVersion: 2, 
      rfqTitle: 'Office Supplies Procurement', 
      submissionDate: '22 Jan 2023', 
      status: 'Submitted'
    },
    { 
      id: 2, 
      rfqId: 2, 
      rfqVersion: 1, 
      rfqTitle: 'IT Equipment', 
      submissionDate: '18 Jan 2023', 
      status: 'Under Review'
    },
    { 
      id: 3, 
      rfqId: 3, 
      rfqVersion: 1, 
      rfqTitle: 'Facility Maintenance', 
      submissionDate: '12 Jan 2023', 
      status: 'Approved'
    },
    { 
      id: 4, 
      rfqId: 4, 
      rfqVersion: 1, 
      rfqTitle: 'Marketing Materials', 
      submissionDate: '10 Jan 2023', 
      status: 'Rejected'
    },
  ];
  
  const handleViewProposal = (id) => {
    toast({
      title: "View Proposal",
      description: `Viewing proposal #${id}`,
    });
  };
  
  const handleEditProposal = (id) => {
    toast({
      title: "Edit Proposal",
      description: `Editing proposal #${id}`,
    });
  };
  
  const handleDownloadPDF = () => {
    toast({
      title: "Download PDF",
      description: "Downloading proposals as PDF file",
    });
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'Submitted':
        return 'bg-blue-100 text-blue-800';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">My Proposals</h1>
          <p className="text-gray-500">Track and manage your submitted proposals</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleDownloadPDF}>
          <Download size={16} /> Download as PDF
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-y border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Proposal ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">RFQ Details</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Submission Date</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((proposal) => (
                  <tr key={proposal.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium">PRO-{proposal.id}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium">{proposal.rfqTitle}</div>
                      <div className="text-xs text-gray-500">RFQ #{proposal.rfqId}, Ver. {proposal.rfqVersion}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">{proposal.submissionDate}</td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span 
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(proposal.status)}`}
                      >
                        {proposal.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleViewProposal(proposal.id)} 
                          className="p-1 rounded text-blue-600 hover:bg-blue-50"
                          title="View Proposal"
                        >
                          <Eye size={16} />
                        </button>
                        {proposal.status === 'Submitted' && (
                          <button 
                            onClick={() => handleEditProposal(proposal.id)}
                            className="p-1 rounded text-blue-600 hover:bg-blue-50"
                            title="Edit Proposal"
                          >
                            <FileEdit size={16} />
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

export default MyProposals;
