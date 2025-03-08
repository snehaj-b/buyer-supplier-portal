
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import RFQHeader from './components/RFQHeader';
import ItemsSection from './components/ItemsSection';
import TermsSection from './components/TermsSection';
import AdditionalComments from './components/AdditionalComments';
import ActionButtons from './components/ActionButtons';
import ConfirmDialog from './components/ConfirmDialog';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

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
          <RFQHeader 
            rfqDetails={rfqDetails} 
            setRfqDetails={setRfqDetails}
          />
          
          <ItemsSection 
            items={items}
            setItems={setItems}
            onUnitPriceChange={handleUnitPriceChange}
            onGSTChange={handleGSTChange}
          />
          
          <TermsSection 
            terms={terms}
            setTerms={setTerms}
            onTermChange={handleTermChange}
          />
          
          <AdditionalComments />
          
          <ActionButtons
            onSave={handleSave}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
      
      <ConfirmDialog 
        open={open} 
        setOpen={setOpen}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default EditRFQ;
