
import React from 'react';
import { Input } from '@/components/ui/input';

const RFQHeader = ({ rfqDetails, setRfqDetails }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="col-span-2">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Request For Quotation No:</h3>
          <div className="flex items-center gap-3">
            <Input 
              value={rfqDetails.number} 
              className="w-20 bg-gray-50" 
              readOnly 
            />
            <div className="px-4 py-2 bg-blue-50 text-blue-800 rounded-md font-medium">
              Version {rfqDetails.version}
            </div>
            <div className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md font-medium">
              Bid: {rfqDetails.bid}
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Due on</h3>
          <Input 
            value={rfqDetails.dueDate} 
            className="bg-gray-50" 
            readOnly 
          />
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Title</h3>
        <Input 
          value={rfqDetails.title} 
          className="w-full"
          onChange={(e) => setRfqDetails({...rfqDetails, title: e.target.value})}
        />
      </div>
    </>
  );
};

export default RFQHeader;
