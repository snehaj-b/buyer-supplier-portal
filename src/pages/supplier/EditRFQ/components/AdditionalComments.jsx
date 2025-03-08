
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

const AdditionalComments = () => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Comments</h3>
      <Textarea
        rows={4}
        placeholder="Enter any additional information or comments..."
        className="w-full"
      />
    </div>
  );
};

export default AdditionalComments;
