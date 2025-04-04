
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, FileText, DollarSign, Users } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Active RFQs',
      value: '12',
      icon: <FileText className="h-8 w-8 text-blue-500" />,
      change: '+2 this week',
      trend: 'up'
    },
    {
      title: 'Pending Quotations',
      value: '24',
      icon: <BarChart className="h-8 w-8 text-blue-500" />,
      change: '+5 this week',
      trend: 'up'
    },
    {
      title: 'Total Spend',
      value: '$45,231',
      icon: <DollarSign className="h-8 w-8 text-blue-500" />,
      change: '+12% this month',
      trend: 'up'
    },
    {
      title: 'Active Suppliers',
      value: '38',
      icon: <Users className="h-8 w-8 text-blue-500" />,
      change: '+3 this month',
      trend: 'up'
    }
  ];

  const recentRfqs = [
    { id: 'RFQ-2023-001', title: 'Office Supplies', date: '23 Jan 2023', status: 'Active' },
    { id: 'RFQ-2023-002', title: 'IT Equipment', date: '20 Jan 2023', status: 'Draft' },
    { id: 'RFQ-2023-003', title: 'Facility Maintenance', date: '15 Jan 2023', status: 'Completed' },
    { id: 'RFQ-2023-004', title: 'Marketing Materials', date: '10 Jan 2023', status: 'Active' },
  ];

  return (
    <div className="page-container">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Procurement Dashboard</h1>
      
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
            <CardTitle>Recent RFQs</CardTitle>
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
                        rfq.status === 'Active' 
                          ? 'bg-green-100 text-green-800'
                          : rfq.status === 'Draft'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-blue-100 text-blue-800'
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
            <CardTitle>Spend Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-md">
              <p className="text-gray-500">Chart will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
