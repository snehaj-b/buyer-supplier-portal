
import React from 'react';
import { Input } from '@/components/ui/input';

const ItemsSection = ({ items, setItems, onUnitPriceChange, onGSTChange }) => {
  return (
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
                    onChange={(e) => onUnitPriceChange(item.id, e.target.value)}
                    className="input-field"
                  />
                </td>
                <td className="px-4 py-2 text-sm">{item.total}</td>
                <td className="px-4 py-2">
                  <Input 
                    type="number" 
                    placeholder="GST %" 
                    value={item.gst}
                    onChange={(e) => onGSTChange(item.id, e.target.value)}
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
  );
};

export default ItemsSection;
