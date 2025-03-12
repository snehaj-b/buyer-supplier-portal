
import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, FileEdit, Save } from 'lucide-react';

const EditRFQ = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  
  const [rfqData, setRfqData] = useState({
    rfqNumber: '1',
    version: '2',
    bidNumber: '1',
    dueDate: '2023-01-23',
    title: 'Supply of Mobile Accessories',
    items: [
      {
        id: 1,
        description: 'Mobile Cover',
        quantity: 500,
        unitPrice: 0,
        total: 0,
        gst: 18,
        totalWithGst: 0
      }
    ],
    terms: [
      {
        id: 1,
        description: 'Delivery by 30-1-25',
        agreed: false,
        comments: ''
      }
    ],
    additionalComments: ''
  });

  const handleItemChange = (id, field, value) => {
    const updatedItems = rfqData.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate totals if quantity or unitPrice changes
        if (field === 'quantity' || field === 'unitPrice') {
          const quantity = field === 'quantity' ? value : item.quantity;
          const unitPrice = field === 'unitPrice' ? value : item.unitPrice;
          
          updatedItem.total = quantity * unitPrice;
          updatedItem.totalWithGst = updatedItem.total * (1 + updatedItem.gst / 100);
        }
        
        // Recalculate totalWithGst if gst changes
        if (field === 'gst') {
          updatedItem.totalWithGst = updatedItem.total * (1 + value / 100);
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setRfqData({ ...rfqData, items: updatedItems });
  };

  const handleTermChange = (id, field, value) => {
    const updatedTerms = rfqData.terms.map(term => {
      if (term.id === id) {
        return { ...term, [field]: value };
      }
      return term;
    });
    
    setRfqData({ ...rfqData, terms: updatedTerms });
  };

  const addNewItem = () => {
    const newItem = {
      id: rfqData.items.length + 1,
      description: '',
      quantity: 0,
      unitPrice: 0,
      total: 0,
      gst: 18,
      totalWithGst: 0
    };
    
    setRfqData({ ...rfqData, items: [...rfqData.items, newItem] });
  };

  const removeItem = (id) => {
    const updatedItems = rfqData.items.filter(item => item.id !== id);
    setRfqData({ ...rfqData, items: updatedItems.map((item, index) => ({ ...item, id: index + 1 })) });
  };

  const handleSubmit = () => {
    setShowDialog(true);
  };

  const confirmSubmit = () => {
    // Here you would typically submit the data to your backend
    toast({
      title: "RFQ Submitted",
      description: "Your RFQ has been successfully submitted.",
    });
    setShowDialog(false);
    navigate("/supplier/rfq-list");
  };
  
  const handleSave = () => {
    toast({
      title: "RFQ Saved",
      description: "Your RFQ has been saved as draft.",
    });
  };

  return (
    <div className="page-container">
      <Card className="bg-white border-blue-200 shadow-md">
        <CardHeader className="border-b pb-3">
          <CardTitle className="text-lg font-medium text-blue-600 flex items-center gap-2">
            <FileEdit size={20} /> Edit Request For Quotation
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6">
          {/* RFQ Header Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Label className="text-sm font-medium min-w-[150px]">Request For Quotation No:</Label>
                <Input 
                  value={rfqData.rfqNumber} 
                  onChange={(e) => setRfqData({...rfqData, rfqNumber: e.target.value})}
                  className="max-w-[80px]" 
                />
              </div>
              <div className="flex items-center gap-4">
                <Label className="text-sm font-medium min-w-[150px]">Version:</Label>
                <Input 
                  value={rfqData.version} 
                  onChange={(e) => setRfqData({...rfqData, version: e.target.value})}
                  className="max-w-[80px]" 
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Label className="text-sm font-medium min-w-[100px]">Bid:</Label>
                <Input 
                  value={rfqData.bidNumber} 
                  onChange={(e) => setRfqData({...rfqData, bidNumber: e.target.value})}
                  className="max-w-[80px]" 
                />
              </div>
              <div className="flex items-center gap-4">
                <Label className="text-sm font-medium min-w-[100px]">Due on:</Label>
                <Input 
                  type="date" 
                  value={rfqData.dueDate} 
                  onChange={(e) => setRfqData({...rfqData, dueDate: e.target.value})}
                  className="max-w-[160px]" 
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium min-w-[100px]">Title:</Label>
              <Input 
                value={rfqData.title} 
                onChange={(e) => setRfqData({...rfqData, title: e.target.value})}
                className="flex-1" 
              />
            </div>
          </div>
          
          {/* Section 1: Items */}
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-3 text-blue-700">Section 1: Items</h3>
            <div className="overflow-x-auto">
              <Table className="border border-gray-200">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-center w-[60px]">No</TableHead>
                    <TableHead>Item Description</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-center">Unit Price</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">GST %</TableHead>
                    <TableHead className="text-center">Total (incl. GST)</TableHead>
                    <TableHead className="text-center w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rfqData.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-center">{item.id}</TableCell>
                      <TableCell>
                        <Input 
                          value={item.description} 
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          className="min-w-[180px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={item.quantity} 
                          onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          className="text-center"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={item.unitPrice} 
                          onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="text-center"
                        />
                      </TableCell>
                      <TableCell className="text-center bg-gray-100">
                        {item.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={item.gst} 
                          onChange={(e) => handleItemChange(item.id, 'gst', parseFloat(e.target.value) || 0)}
                          className="text-center"
                        />
                      </TableCell>
                      <TableCell className="text-center bg-gray-100">
                        {item.totalWithGst.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {rfqData.items.length > 1 && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-1 h-8 w-8"
                          >
                            X
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <Button 
              variant="outline" 
              onClick={addNewItem} 
              className="mt-3"
            >
              + Add Item
            </Button>
          </div>
          
          {/* Section 2: Terms and Conditions */}
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-3 text-blue-700">Section 2: Terms and Conditions</h3>
            <Table className="border border-gray-200">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Term Description</TableHead>
                  <TableHead className="w-[150px] text-center">Agree/Disagree</TableHead>
                  <TableHead>Comments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rfqData.terms.map((term) => (
                  <TableRow key={term.id}>
                    <TableCell>{term.description}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <Label htmlFor={`agree-${term.id}`} className="cursor-pointer">
                          <Input 
                            id={`agree-${term.id}`}
                            type="radio" 
                            name={`term-${term.id}`} 
                            checked={term.agreed === true}
                            onChange={() => handleTermChange(term.id, 'agreed', true)}
                            className="mr-1"
                          />
                          Agree
                        </Label>
                        <Label htmlFor={`disagree-${term.id}`} className="cursor-pointer">
                          <Input 
                            id={`disagree-${term.id}`}
                            type="radio" 
                            name={`term-${term.id}`} 
                            checked={term.agreed === false}
                            onChange={() => handleTermChange(term.id, 'agreed', false)}
                            className="mr-1"
                          />
                          Disagree
                        </Label>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={term.comments} 
                        onChange={(e) => handleTermChange(term.id, 'comments', e.target.value)}
                        placeholder="Add your comments here..."
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Additional Comments */}
          <div className="mb-6">
            <Label className="block mb-2 text-md font-semibold text-blue-700">Additional Comments</Label>
            <Textarea 
              value={rfqData.additionalComments} 
              onChange={(e) => setRfqData({...rfqData, additionalComments: e.target.value})}
              placeholder="Enter any additional comments or notes here..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-4 flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleSave}
            className="border-blue-200 hover:bg-blue-50 text-blue-600"
          >
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-procurement-green hover:bg-green-600"
          >
            <CheckCircle className="mr-2 h-4 w-4" /> Submit
          </Button>
        </CardFooter>
      </Card>
      
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit this RFQ? Once submitted, it cannot be edited.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit} className="bg-procurement-green hover:bg-green-600">
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditRFQ;
