
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

const AdditionalComments = ({ comments, setComments }) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Comments</h3>
      <Textarea
        rows={4}
        placeholder="Enter any additional information or comments..."
        className="w-full bg-yellow-50"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
      />
    </div>
  );
};

export default AdditionalComments;
