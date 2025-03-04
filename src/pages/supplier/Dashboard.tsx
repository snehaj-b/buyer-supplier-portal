
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InboxIcon, ClipboardList, FileText, DollarSign } from 'lucide-react';

const SupplierDashboard = () => {
  const stats = [
    {
      title: 'Active RFQs',
      value: '5',
      icon: <ClipboardList className="h-8 w-8 text-blue-500" />,
      change: 'New opportunities',
      trend: 'up'
    },
    {
      title: 'Submitted Proposals',
      value: '8',
      icon: <FileText className="h-8 w-8 text-blue-500" />,
      change: '2 under review',
      trend: 'up'
    },
    {
      title: 'Approved Proposals',
      value: '3',
      icon: <InboxIcon className="h-8 w-8 text-blue-500" />,
      change: '+1 this month',
      trend: 'up'
    },
    {
      title: 'Revenue',
      value: '$35,750',
      icon: <DollarSign className="h-8 w-8 text-blue-500" />,
      change: '+15% this month',
      trend: 'up'
    }
  ];

  const recentRfqs = [
    { id: 'RFQ-2023-001', title: 'Office Supplies', date: '23 Jan 2023', status: 'New' },
    { id: 'RFQ-2023-002', title: 'IT Equipment', date: '20 Jan 2023', status: 'Bidding' },
    { id: 'RFQ-2023-003', title: 'Facility Maintenance', date: '15 Jan 2023', status: 'Closed' },
    { id: 'RFQ-2023-004', title: 'Marketing Materials', date: '10 Jan 2023', status: 'New' },
  ];

  return (
    <div className="page-container">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Supplier Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <Card key={i} className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>New RFQ Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRfqs.map((rfq) => (
                <div key={rfq.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <div className="font-medium">{rfq.title}</div>
                    <div className="text-sm text-gray-500">{rfq.id} • {rfq.date}</div>
                  </div>
                  <div>
                    <span 
                      className={`px-2 py-1 text-xs rounded-full ${
                        rfq.status === 'New' 
                          ? 'bg-green-100 text-green-800'
                          : rfq.status === 'Bidding'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {rfq.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-red-50 rounded-md border-l-4 border-red-500">
                <div className="font-medium">RFQ-2023-001: Office Supplies</div>
                <div className="text-sm text-gray-600">Submission deadline: 2 days remaining</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-md border-l-4 border-yellow-500">
                <div className="font-medium">RFQ-2023-002: IT Equipment</div>
                <div className="text-sm text-gray-600">Submission deadline: 5 days remaining</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-md border-l-4 border-blue-500">
                <div className="font-medium">Contract Review</div>
                <div className="text-sm text-gray-600">Contract for Office Supplies due in 7 days</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-md border-l-4 border-purple-500">
                <div className="font-medium">Update Catalog</div>
                <div className="text-sm text-gray-600">Product catalog needs updating by 30 Jan</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupplierDashboard;
