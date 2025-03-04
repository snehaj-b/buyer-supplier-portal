
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, X, Calendar, Save, SendHorizontal, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CreateRFQ = () => {
  const { toast } = useToast();
  const [items, setItems] = useState([
    { id: 1, description: 'Mobile Cover', quantity: 500, price: '', total: '', gst: '', totalWithGst: '' }
  ]);
  const [terms, setTerms] = useState([
    { id: 1, description: 'Delivery by 30-1-25' }
  ]);
  const [supplierCount, setSupplierCount] = useState(1);
  const [suppliers, setSuppliers] = useState(['']);
  const [bids, setBids] = useState([{ id: 1, startDate: '', endDate: '' }]);

  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    setItems([...items, { id: newId, description: '', quantity: 0, price: '', total: '', gst: '', totalWithGst: '' }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const addTerm = () => {
    const newId = terms.length > 0 ? Math.max(...terms.map(term => term.id)) + 1 : 1;
    setTerms([...terms, { id: newId, description: '' }]);
  };

  const removeTerm = (id: number) => {
    setTerms(terms.filter(term => term.id !== id));
  };

  const addSupplier = () => {
    setSupplierCount(supplierCount + 1);
    setSuppliers([...suppliers, '']);
  };

  const handleSupplierChange = (index: number, value: string) => {
    const newSuppliers = [...suppliers];
    newSuppliers[index] = value;
    setSuppliers(newSuppliers);
  };

  const addBid = () => {
    const newId = bids.length > 0 ? Math.max(...bids.map(bid => bid.id)) + 1 : 1;
    setBids([...bids, { id: newId, startDate: '', endDate: '' }]);
  };

  const removeBid = (id: number) => {
    setBids(bids.filter(bid => bid.id !== id));
  };

  const handleUpdateBid = (id: number, field: string, value: string) => {
    setBids(bids.map(bid => bid.id === id ? { ...bid, [field]: value } : bid));
  };

  const handleSave = () => {
    toast({
      title: "RFQ Saved",
      description: "Your RFQ has been saved as a draft.",
    });
  };

  const handleSubmit = () => {
    toast({
      title: "RFQ Submitted",
      description: "Your RFQ has been submitted to suppliers.",
    });
  };

  const handleCallForBid = () => {
    toast({
      title: "Call for Bid Initiated",
      description: "A call for bid process has been initiated for this RFQ.",
      variant: "default",
    });
  };

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Create Request For Quotation</h1>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={handleSave}>
            <Save size={16} /> Save Draft
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2" onClick={handleSubmit}>
            <SendHorizontal size={16} /> Submit
          </Button>
        </div>
      </div>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Fill in all required fields. You can save your progress as a draft and return later.
            </p>
          </div>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>RFQ Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <Input placeholder="Enter RFQ title" className="input-field" />
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">RFQ Number</label>
                <Input defaultValue="1" readOnly className="input-field bg-gray-50" />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                <Input defaultValue="1" readOnly className="input-field bg-gray-50" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex justify-between items-center">
            <span>Section 1: Items</span>
            <Button variant="outline" size="sm" className="gap-1" onClick={addItem}>
              <PlusCircle size={14} /> Add Item
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="px-4 py-2 text-sm">{index + 1}</td>
                    <td className="px-4 py-2">
                      <Input 
                        placeholder="Description" 
                        value={item.description} 
                        className="input-field"
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].description = e.target.value;
                          setItems(newItems);
                        }}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input 
                        type="number" 
                        placeholder="Qty" 
                        value={item.quantity} 
                        className="input-field"
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].quantity = parseInt(e.target.value);
                          setItems(newItems);
                        }}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input placeholder="Unit Price" className="input-field" />
                    </td>
                    <td className="px-4 py-2">
                      <Input placeholder="Total" className="input-field" readOnly />
                    </td>
                    <td className="px-4 py-2">
                      <Input placeholder="GST %" className="input-field" />
                    </td>
                    <td className="px-4 py-2">
                      <Input placeholder="Total with GST" className="input-field" readOnly />
                    </td>
                    <td className="px-4 py-2 text-center">
                      {items.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-500"
                          onClick={() => removeItem(item.id)}
                        >
                          <X size={16} />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex justify-between items-center">
            <span>Section 2: Terms and Conditions</span>
            <Button variant="outline" size="sm" className="gap-1" onClick={addTerm}>
              <PlusCircle size={14} /> Add Term
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {terms.map((term, index) => (
              <div key={term.id} className="flex items-center gap-2">
                <Input 
                  placeholder="Enter term or condition" 
                  className="input-field flex-1"
                  value={term.description}
                  onChange={(e) => {
                    const newTerms = [...terms];
                    newTerms[index].description = e.target.value;
                    setTerms(newTerms);
                  }}
                />
                {terms.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-red-500"
                    onClick={() => removeTerm(term.id)}
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex justify-between items-center">
            <span>Section 3: Supplier Selection</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1" 
              onClick={addSupplier}
              disabled={supplierCount >= 3}
            >
              <PlusCircle size={14} /> Add Supplier
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: supplierCount }).map((_, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier {index + 1}
                </label>
                <Select 
                  value={suppliers[index]} 
                  onValueChange={(value) => handleSupplierChange(index, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supplier1">ABC Corporation</SelectItem>
                    <SelectItem value="supplier2">XYZ Limited</SelectItem>
                    <SelectItem value="supplier3">DEF Industries</SelectItem>
                    <SelectItem value="supplier4">GHI Enterprises</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex justify-between items-center">
            <span>Section 4: Call For Bids</span>
            <Button variant="outline" size="sm" className="gap-1" onClick={addBid}>
              <PlusCircle size={14} /> Add Bid Round
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-y border-gray-200">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Bid #</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Start Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">End Date</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bids.map((bid, index) => (
                  <tr key={bid.id} className="border-b border-gray-200">
                    <td className="px-4 py-2 text-sm">Bid {index + 1}</td>
                    <td className="px-4 py-2">
                      <div className="relative">
                        <Input 
                          type="date" 
                          placeholder="Start Date" 
                          className="input-field"
                          value={bid.startDate}
                          onChange={(e) => handleUpdateBid(bid.id, 'startDate', e.target.value)}
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="relative">
                        <Input 
                          type="date" 
                          placeholder="End Date" 
                          className="input-field"
                          value={bid.endDate}
                          onChange={(e) => handleUpdateBid(bid.id, 'endDate', e.target.value)}
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center">
                      {bids.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-500"
                          onClick={() => removeBid(bid.id)}
                        >
                          <X size={16} />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Section 5: Message to Suppliers</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={6}
            placeholder="Enter a message to suppliers..."
            className="input-field"
            defaultValue="Dear Supplier,
Please submit your lowest price bid for RFQ No... Version... by...
The deadline for submission is...
Thank you.
Purchase Manager,
Organisation Name"
          />
        </CardContent>
      </Card>
      
      <div className="flex justify-end space-x-4 mb-8">
        <Button variant="outline" className="gap-2" onClick={handleSave}>
          <Save size={16} /> Save Draft
        </Button>
        <Button className="bg-green-600 hover:bg-green-700 gap-2" onClick={handleCallForBid}>
          <SendHorizontal size={16} /> Call For Bid
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2" onClick={handleSubmit}>
          <SendHorizontal size={16} /> Submit
        </Button>
      </div>
    </div>
  );
};

export default CreateRFQ;
