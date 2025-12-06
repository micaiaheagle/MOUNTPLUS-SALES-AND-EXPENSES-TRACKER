'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/Modal';
import { convertQuoteToJob } from '@/actions/quotes';
import { Plus, Trash2 } from 'lucide-react';

interface ConvertToJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: any;
}

interface LineItem {
  description: string;
  quantity: number;
  price: number;
  amount: number;
}

export function ConvertToJobModal({ isOpen, onClose, quote }: ConvertToJobModalProps) {
  const [items, setItems] = useState<LineItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  // Reset form when quote changes
  useEffect(() => {
    if (quote) {
      try {
        const parsedItems = JSON.parse(quote.items || '[]');
        setItems(parsedItems.length > 0 ? parsedItems : [{ description: '', quantity: 1, price: 0, amount: 0 }]);
        setCustomerName(quote.customerName || '');
        setJobDescription(quote.jobDescription || '');
      } catch (e) {
        setItems([{ description: '', quantity: 1, price: 0, amount: 0 }]);
      }
    }
  }, [quote]);

  const inputClasses = "w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none text-gray-900 bg-white";

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof LineItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'price') {
      newItems[index].amount = newItems[index].quantity * newItems[index].price;
    }
    
    setItems(newItems);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set('quoteId', quote.id);
    formData.set('customerName', customerName);
    formData.set('jobDescription', jobDescription);
    formData.set('items', JSON.stringify(items));
    formData.set('totalAmount', totalAmount.toString());
    
    await convertQuoteToJob(formData);
    onClose();
  };

  if (!quote) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Convert Quote to Job Card">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-sm">
          <p className="font-medium text-yellow-800">Review and adjust the details before creating the job.</p>
          <p className="text-yellow-700 text-xs mt-1">Quote #{quote.id.slice(0, 8)}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
          <input 
            type="text" 
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required 
            className={inputClasses} 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Title/Summary</label>
          <input 
            type="text" 
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required 
            className={inputClasses} 
          />
        </div>

        {/* Line Items */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-bold text-gray-800">Services / Items</label>
            <button type="button" onClick={addItem} className="text-green-600 hover:text-green-800 flex items-center gap-1 text-sm font-medium">
              <Plus size={16} /> Add Item
            </button>
          </div>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {items.map((item, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded border border-gray-200">
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Service description"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm text-gray-900 bg-white"
                    required
                  />
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(index)} className="text-red-600 hover:text-red-800 p-1">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-gray-600">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 1)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-gray-900 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Price ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-gray-900 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Amount ($)</label>
                    <input
                      type="text"
                      value={item.amount.toFixed(2)}
                      readOnly
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm font-bold text-gray-900 bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-50 p-3 rounded border border-green-200">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-800">Job Total:</span>
            <span className="text-2xl font-bold text-green-600">${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors">
            Cancel
          </button>
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 transition-colors">
            Create Job Card
          </button>
        </div>
      </form>
    </Modal>
  );
}
