
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Trash2, Plus, FileText } from 'lucide-react';

const EditRFQ = () => {
  const { toast } = useToast();
  const [rfq, setRfq] = useState({
    id: 'RFQ-2023-001',
    title: 'Supply of Industrial Equipment',
    description: 'Procurement of industrial machinery and equipment for new manufacturing line',
    issueDate: '2023-01-15',
    dueDate: '2023-02-15',
    status: 'In Progress',
    terms: 'Payment within 30 days of delivery. Warranty must be minimum 1 year.',
    additionalNotes: 'Please include detailed specifications and certifications with proposal'
  });

  const [items, setItems] = useState([
    { id: 1, name: 'Industrial Pump', description: 'High capacity industrial pump', quantity: 3, price: 1500, unit: 'Unit', gst: 18 },
    { id: 2, name: 'Electric Motor', description: '15HP three-phase electric motor', quantity: 5, price: 2000, unit: 'Piece', gst: 18 },
    { id: 3, name: 'Control Panel', description: 'Automated control panel with PLC', quantity: 2, price: 4500, unit: 'Set', gst: 18 }
  ]);

  const calculateItemTotal = (item) => {
    const baseAmount = item.quantity * item.price;
    const gstAmount = baseAmount * (item.gst / 100);
    return baseAmount + gstAmount;
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateGST = () => {
    return items.reduce((sum, item) => {
      const baseAmount = item.quantity * item.price;
      return sum + (baseAmount * (item.gst / 100));
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGST();
  };

  const handleRfqChange = (e) => {
    const { name, value } = e.target;
    setRfq({ ...rfq, [name]: value });
  };

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: field === 'price' || field === 'quantity' || field === 'gst' ? Number(value) : value } : item
    ));
  };

  const addNewItem = () => {
    const newItem = {
      id: items.length + 1,
      name: '',
      description: '',
      quantity: 1,
      price: 0,
      unit: 'Unit',
      gst: 18
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id) => {
    if (items.length === 1) {
      toast({
        title: "Cannot Remove",
        description: "At least one item is required in the RFQ",
        variant: "destructive"
      });
      return;
    }
    
    setItems(items.filter(item => item.id !== id));
  };

  const handleSave = () => {
    toast({
      title: "RFQ Saved",
      description: "Your RFQ changes have been saved as draft",
    });
  };

  const handleSubmit = () => {
    toast({
      title: "RFQ Updated",
      description: "Your RFQ has been updated successfully",
    });
  };

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Edit RFQ</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSave}>Save Draft</Button>
          <Button onClick={handleSubmit}>Update RFQ</Button>
        </div>
      </div>

      {/* RFQ Details */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-xl font-medium text-gray-700 mb-4">RFQ Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="id">RFQ ID</Label>
              <Input 
                id="id" 
                value={rfq.id} 
                name="id"
                onChange={handleRfqChange}
                className="bg-gray-50" 
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Input 
                id="status" 
                value={rfq.status} 
                name="status"
                className="bg-gray-50" 
                readOnly
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={rfq.title} 
                name="title"
                onChange={handleRfqChange}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={rfq.description} 
                name="description"
                onChange={handleRfqChange}
                rows={3} 
              />
            </div>
            <div>
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input 
                id="issueDate" 
                type="date" 
                value={rfq.issueDate} 
                name="issueDate"
                onChange={handleRfqChange}
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input 
                id="dueDate" 
                type="date" 
                value={rfq.dueDate} 
                name="dueDate"
                onChange={handleRfqChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Section */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-gray-700">Items</h2>
            <Button size="sm" onClick={addNewItem} className="flex items-center gap-1">
              <Plus size={16} />
              Add Item
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-y border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Quantity</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Unit</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Unit Price</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">GST %</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Total</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="px-4 py-3">
                      <Input 
                        value={item.name} 
                        onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                        className="w-full"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input 
                        value={item.description} 
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        className="w-full"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                        className="w-16 text-center mx-auto"
                        min="1"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input 
                        value={item.unit} 
                        onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                        className="w-20 text-center mx-auto"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input 
                        type="number" 
                        value={item.price} 
                        onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                        className="w-24 text-right ml-auto"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input 
                        type="number" 
                        value={item.gst} 
                        onChange={(e) => handleItemChange(item.id, 'gst', e.target.value)}
                        className="w-16 text-center mx-auto"
                        min="0"
                        max="100"
                      />
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      ${calculateItemTotal(item).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
                
                {/* Summary Row */}
                <tr className="bg-gray-50">
                  <td colSpan={4} className="px-4 py-3"></td>
                  <td colSpan={2} className="px-4 py-3 text-right font-medium">Subtotal:</td>
                  <td className="px-4 py-3 text-right font-medium">${calculateSubtotal().toFixed(2)}</td>
                  <td></td>
                </tr>
                <tr className="bg-gray-50">
                  <td colSpan={4} className="px-4 py-3"></td>
                  <td colSpan={2} className="px-4 py-3 text-right font-medium">GST:</td>
                  <td className="px-4 py-3 text-right font-medium">${calculateGST().toFixed(2)}</td>
                  <td></td>
                </tr>
                <tr className="bg-gray-50">
                  <td colSpan={4} className="px-4 py-3"></td>
                  <td colSpan={2} className="px-4 py-3 text-right font-semibold">Total:</td>
                  <td className="px-4 py-3 text-right font-semibold">${calculateTotal().toFixed(2)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Terms & Conditions */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-xl font-medium text-gray-700 mb-4">Terms & Conditions</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="terms">Terms</Label>
              <Textarea 
                id="terms" 
                value={rfq.terms} 
                name="terms"
                onChange={handleRfqChange}
                rows={3} 
              />
            </div>
            <div>
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea 
                id="additionalNotes" 
                value={rfq.additionalNotes} 
                name="additionalNotes"
                onChange={handleRfqChange}
                rows={3} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" onClick={handleSave}>Save as Draft</Button>
        <Button onClick={handleSubmit} className="gap-2">
          <CheckCircle size={18} />
          Update RFQ
        </Button>
      </div>
    </div>
  );
};

export default EditRFQ;
