
import React from 'react';
import { Button } from '@/components/ui/button';

const ActionButtons = ({ onSave, onSubmit }) => {
  return (
    <div className="flex justify-end space-x-4">
      <Button variant="outline" onClick={onSave}>
        Save
      </Button>
      <Button 
        className="bg-green-600 hover:bg-green-700"
        onClick={onSubmit}
      >
        Submit
      </Button>
    </div>
  );
};

export default ActionButtons;
