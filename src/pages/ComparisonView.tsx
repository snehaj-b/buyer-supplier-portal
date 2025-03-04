
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ComparisonView = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(1);
  
  const rfqDetails = {
    number: 1,
    version: 2,
    title: 'Office Supplies Procurement'
  };
  
  const bidData = [
    {
      id: 1,
      items: [
        {
          id: 1,
          description: 'Mobile Cover',
          quantity: 500,
          suppliers: [
            { id: 1, name: 'Supplier 1', unitPrice: 25, total: 12500, gst: 10, totalWithGst: 13750 },
            { id: 2, name: 'Supplier 2', unitPrice: 30, total: 15000, gst: 10, totalWithGst: 16500 },
            { id: 3, name: 'Supplier 3', unitPrice: 35, total: 17500, gst: 10, totalWithGst: 19250 }
          ]
        }
      ],
      terms: [
        { id: 1, description: 'Delivery by 30-1-25', supplierResponses: [
          { id: 1, response: 'Agree', comments: '' },
          { id: 2, response: 'Agree', comments: '' },
          { id: 3, response: 'Agree', comments: '' }
        ]}
      ],
      totalValues: [
        { id: 1, name: 'Supplier 1', totalWithGst: 13750, totalWithoutGst: 12500 },
        { id: 2, name: 'Supplier 2', totalWithGst: 16500, totalWithoutGst: 15000 },
        { id: 3, name: 'Supplier 3', totalWithGst: 19250, totalWithoutGst: 17500 }
      ]
    },
    {
      id: 2,
      items: [
        {
          id: 1,
          description: 'Mobile Cover',
          quantity: 500,
          suppliers: [
            { id: 1, name: 'Supplier 1', unitPrice: 25, total: 12500, gst: 10, totalWithGst: 13750 },
            { id: 2, name: 'Supplier 2', unitPrice: 30, total: 15000, gst: 10, totalWithGst: 16500 },
            { id: 3, name: 'Supplier 3', unitPrice: 35, total: 17500, gst: 10, totalWithGst: 19250 }
          ]
        }
      ],
      terms: [
        { id: 1, description: 'Delivery by 30-1-25', supplierResponses: [
          { id: 1, response: 'Agree', comments: '' },
          { id: 2, response: 'Agree', comments: '' },
          { id: 3, response: 'Agree', comments: '' }
        ]}
      ],
      totalValues: [
        { id: 1, name: 'Supplier 1', totalWithGst: 13750, totalWithoutGst: 12500 },
        { id: 2, name: 'Supplier 2', totalWithGst: 16500, totalWithoutGst: 15000 },
        { id: 3, name: 'Supplier 3', totalWithGst: 19250, totalWithoutGst: 17500 }
      ]
    },
    {
      id: 3,
      items: [
        {
          id: 1,
          description: 'Mobile Cover',
          quantity: 500,
          suppliers: [
            { id: 1, name: 'Supplier 1', unitPrice: 25, total: 12500, gst: 10, totalWithGst: 13750 },
            { id: 2, name: 'Supplier 2', unitPrice: 30, total: 15000, gst: 10, totalWithGst: 16500 },
            { id: 3, name: 'Supplier 3', unitPrice: 35, total: 17500, gst: 10, totalWithGst: 19250 }
          ]
        }
      ],
      terms: [
        { id: 1, description: 'Delivery by 30-1-25', supplierResponses: [
          { id: 1, response: 'Agree', comments: '' },
          { id: 2, response: 'Agree', comments: '' },
          { id: 3, response: 'Agree', comments: '' }
        ]}
      ],
      totalValues: [
        { id: 1, name: 'Supplier 1', totalWithGst: 13750, totalWithoutGst: 12500 },
        { id: 2, name: 'Supplier 2', totalWithGst: 16500, totalWithoutGst: 15000 },
        { id: 3, name: 'Supplier 3', totalWithGst: 19250, totalWithoutGst: 17500 }
      ]
    }
  ];
  
  const handleDownloadExcel = () => {
    toast({
      title: "Download Excel",
      description: "Downloading comparison as Excel file",
    });
  };

  const activeBid = bidData.find(bid => bid.id === activeTab) || bidData[0];

  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">RFQ Proposals Comparison View</h1>
          <p className="text-gray-500">Compare proposals from different suppliers</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleDownloadExcel}>
          <Download size={16} /> Download as Excel
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Title:</h3>
              <div className="px-4 py-2 bg-gray-100 rounded-md text-gray-900">
                {rfqDetails.title}
              </div>
            </div>
          </div>
          
          <div className="flex border-b border-gray-200 mb-6">
            {bidData.map(bid => (
              <button
                key={bid.id}
                className={`py-2 px-4 font-medium text-sm ${
                  activeTab === bid.id 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
                onClick={() => setActiveTab(bid.id)}
              >
                Bid {bid.id}
              </button>
            ))}
          </div>
          
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-800 mb-3">Section 1 : Items</h3>
            <div className="overflow-x-auto">
              <table className="rfq-table">
                <thead>
                  <tr>
                    <th rowSpan={2}>No</th>
                    <th rowSpan={2}>Item Description</th>
                    <th rowSpan={2}>Quantity</th>
                    <th colSpan={4} className="rfq-table-supplier">Supplier 1</th>
                    <th colSpan={4} className="rfq-table-supplier">Supplier 2</th>
                    <th colSpan={4} className="rfq-table-supplier">Supplier 3</th>
                  </tr>
                  <tr>
                    <th>Unit Price</th>
                    <th>Total</th>
                    <th>GST %</th>
                    <th>Total (incl. GST)</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                    <th>GST %</th>
                    <th>Total (incl. GST)</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                    <th>GST %</th>
                    <th>Total (incl. GST)</th>
                  </tr>
                </thead>
                <tbody>
                  {activeBid.items.map((item, idx) => (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      {item.suppliers.map(supplier => (
                        <React.Fragment key={supplier.id}>
                          <td className={supplier.id === 1 ? 'table-cell-highlight' : ''}>
                            {supplier.unitPrice}
                          </td>
                          <td>{supplier.total}</td>
                          <td>{supplier.gst}%</td>
                          <td>{supplier.totalWithGst}</td>
                        </React.Fragment>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th></th>
                    <th className="px-4 py-2 text-center text-sm font-medium bg-gray-50 border border-gray-200">
                      Supplier 1
                    </th>
                    <th className="px-4 py-2 text-center text-sm font-medium bg-gray-50 border border-gray-200">
                      Supplier 2
                    </th>
                    <th className="px-4 py-2 text-center text-sm font-medium bg-gray-50 border border-gray-200">
                      Supplier 3
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 text-sm font-medium border border-gray-200">
                      Total Proposal Value (incl GST)
                    </td>
                    <td className="px-4 py-2 text-sm border border-gray-200 table-cell-highlight">
                      {activeBid.totalValues[0].totalWithGst}
                    </td>
                    <td className="px-4 py-2 text-sm border border-gray-200">
                      {activeBid.totalValues[1].totalWithGst}
                    </td>
                    <td className="px-4 py-2 text-sm border border-gray-200">
                      {activeBid.totalValues[2].totalWithGst}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm font-medium border border-gray-200">
                      Total Proposal Value (excl GST)
                    </td>
                    <td className="px-4 py-2 text-sm border border-gray-200 table-cell-highlight">
                      {activeBid.totalValues[0].totalWithoutGst}
                    </td>
                    <td className="px-4 py-2 text-sm border border-gray-200">
                      {activeBid.totalValues[1].totalWithoutGst}
                    </td>
                    <td className="px-4 py-2 text-sm border border-gray-200">
                      {activeBid.totalValues[2].totalWithoutGst}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <h3 className="text-base font-medium text-gray-800 mb-3">Section 2 : Terms and Conditions</h3>
            <div className="overflow-x-auto">
              <table className="rfq-table">
                <thead>
                  <tr>
                    <th></th>
                    <th colSpan={2} className="rfq-table-supplier">Supplier 1</th>
                    <th colSpan={2} className="rfq-table-supplier">Supplier 2</th>
                    <th colSpan={2} className="rfq-table-supplier">Supplier 3</th>
                  </tr>
                  <tr>
                    <th></th>
                    <th>Agree</th>
                    <th>Comments</th>
                    <th>Agree</th>
                    <th>Comments</th>
                    <th>Agree</th>
                    <th>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {activeBid.terms.map(term => (
                    <tr key={term.id}>
                      <td className="font-medium">{term.description}</td>
                      {term.supplierResponses.map(response => (
                        <React.Fragment key={response.id}>
                          <td>{response.response}</td>
                          <td>{response.comments}</td>
                        </React.Fragment>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonView;
