
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const CallForBids = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  
  const handleSubmit = () => {
    setOpen(true);
  };

  const handleConfirm = () => {
    setOpen(false);
    toast({
      title: "Call for Bids Submitted",
      description: "Your call for bids has been sent to suppliers.",
      variant: "default",
    });
  };

  return (
    <div className="page-container">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Call for Bids</h1>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Request For Quotation</h3>
              <div className="flex items-center gap-3">
                <Input 
                  value="1" 
                  className="w-20 bg-gray-50" 
                  readOnly 
                />
                <div className="px-4 py-2 bg-blue-50 text-blue-800 rounded-md font-medium">
                  Version 2
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Bid</h3>
              <Input 
                value="1" 
                className="w-20 bg-gray-50" 
                readOnly 
              />
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Title</h3>
            <Input 
              placeholder="Enter title" 
              className="w-full" 
              defaultValue="Office Supplies Procurement" 
            />
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Submission Date</h3>
            <Input 
              type="date" 
              className="w-full md:w-64" 
              defaultValue="2023-01-25" 
            />
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Message to Supplier</h3>
            <Textarea
              rows={8}
              className="w-full"
              defaultValue="Dear Supplier,

Please submit your lowest price bid for RFQ No.1, Version 2 by 25th January 2023.
You are invited to participate in this bidding process.
The deadline for submission is 25th January 2023.

Thank you,
Purchase Manager,
Organisation Name"
            />
          </div>
          
          <div className="flex justify-center">
            <Button 
              className="bg-green-600 hover:bg-green-700 py-6 px-8 text-lg w-full md:w-auto"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Submitting this "Call for Bid" will irreversibly freeze any previous bid process. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirm}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CallForBids;
