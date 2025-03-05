
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const EditRFQ = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  
  const [rfqDetails, setRfqDetails] = useState({
    number: 1,
    version: 2,
    title: 'Office Supplies Procurement',
    bid: 1,
    dueDate: '23-Jan-25'
  });
  
  const [items, setItems] = useState([
    { id: 1, description: 'Mobile Cover', quantity: 500, unitPrice: '', total: '', gst: '10', totalWithGst: '' }
  ]);
  
  const [terms, setTerms] = useState([
    { id: 1, description: 'Delivery by 30-1-25', agree: 'agree', comments: '' }
  ]);
  
  const handleUnitPriceChange = (id, value) => {
    const numValue = parseFloat(value) || 0;
    
    setItems(items.map(item => {
      if (item.id === id) {
        const total = item.quantity * numValue;
        const gstValue = parseFloat(item.gst) || 0;
        const totalWithGst = total + (total * gstValue / 100);
        
        return {
          ...item,
          unitPrice: value,
          total: total.toFixed(2),
          totalWithGst: totalWithGst.toFixed(2)
        };
      }
      return item;
    }));
  };
  
  const handleGSTChange = (id, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const unitPrice = parseFloat(item.unitPrice) || 0;
        const total = item.quantity * unitPrice;
        const gstValue = parseFloat(value) || 0;
        const totalWithGst = total + (total * gstValue / 100);
        
        return {
          ...item,
          gst: value,
          totalWithGst: totalWithGst.toFixed(2)
        };
      }
      return item;
    }));
  };
  
  const handleTermChange = (id, field, value) => {
    setTerms(terms.map(term => {
      if (term.id === id) {
        return { ...term, [field]: value };
      }
      return term;
    }));
  };
  
  const handleSubmit = () => {
    // Validation
    const hasEmptyFields = items.some(item => !item.unitPrice);
    
    if (hasEmptyFields) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setOpen(true);
  };
  
  const handleConfirm = () => {
    setOpen(false);
    toast({
      title: "RFQ Updated",
      description: "Your RFQ has been updated successfully.",
      variant: "default",
    });
  };
  
  const handleSave = () => {
    toast({
      title: "RFQ Saved",
      description: "Your RFQ has been saved as draft.",
      variant: "default",
    });
  };
  
  return (
    <div className="page-container">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Edit RFQ</h1>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
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
          
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-800 mb-3">Section 1: Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-y border-gray-200">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">No</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Item Description</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Quantity</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Unit Price</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">GST %</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total (incl. GST)</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="px-4 py-2 text-sm">{index + 1}</td>
                      <td className="px-4 py-2 text-sm">
                        <Input 
                          value={item.description}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index].description = e.target.value;
                            setItems(newItems);
                          }}
                          className="input-field"
                        />
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <Input 
                          type="number" 
                          value={item.quantity}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index].quantity = parseInt(e.target.value) || 0;
                            setItems(newItems);
                          }}
                          className="input-field w-20"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input 
                          type="number" 
                          placeholder="Enter price" 
                          value={item.unitPrice}
                          onChange={(e) => handleUnitPriceChange(item.id, e.target.value)}
                          className="input-field"
                        />
                      </td>
                      <td className="px-4 py-2 text-sm">{item.total}</td>
                      <td className="px-4 py-2">
                        <Input 
                          type="number" 
                          placeholder="GST %" 
                          value={item.gst}
                          onChange={(e) => handleGSTChange(item.id, e.target.value)}
                          className="input-field w-16"
                        />
                      </td>
                      <td className="px-4 py-2 text-sm">{item.totalWithGst}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-800 mb-3">Section 2: Terms and Conditions</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-y border-gray-200">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Terms</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Response</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {terms.map((term, index) => (
                    <tr key={term.id} className="border-b border-gray-200">
                      <td className="px-4 py-2 text-sm">
                        <Input 
                          value={term.description}
                          onChange={(e) => {
                            const newTerms = [...terms];
                            newTerms[index].description = e.target.value;
                            setTerms(newTerms);
                          }}
                          className="input-field"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Select 
                          value={term.agree} 
                          onValueChange={(value) => handleTermChange(term.id, 'agree', value)}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="agree">Agree</SelectItem>
                            <SelectItem value="disagree">Disagree</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2">
                        <Input 
                          placeholder="Optional comments" 
                          value={term.comments}
                          onChange={(e) => handleTermChange(term.id, 'comments', e.target.value)}
                          className="input-field"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Comments</h3>
            <Textarea
              rows={4}
              placeholder="Enter any additional information or comments..."
              className="w-full"
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={handleSave}>
              Save
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
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
            <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit this updated RFQ? Once submitted, it will be sent to all potential suppliers.
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

export default EditRFQ;
