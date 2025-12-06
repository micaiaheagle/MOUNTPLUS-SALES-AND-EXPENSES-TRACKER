'use client';

import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { createQuote } from '@/actions/quotes';
import { Plus, Trash2 } from 'lucide-react';

interface AddQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LineItem {
  description: string;
  quantity: number;
  price: number;
  amount: number;
}

export function AddQuoteModal({ isOpen, onClose }: AddQuoteModalProps) {
  const [items, setItems] = useState<LineItem[]>([
    { description: '', quantity: 1, price: 0, amount: 0 }
  ]);

  const inputClasses = "w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-gray-900 bg-white";

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
    
    // Auto-calculate amount
    if (field === 'quantity' || field === 'price') {
      newItems[index].amount = newItems[index].quantity * newItems[index].price;
    }
    
    setItems(newItems);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('items', JSON.stringify(items));
    formData.set('totalAmount', totalAmount.toString());
    
    await createQuote(formData);
    setItems([{ description: '', quantity: 1, price: 0, amount: 0 }]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Quotation">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className={inputClasses} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
          <input type="text" name="customerName" required className={inputClasses} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Title/Summary</label>
          <input type="text" name="jobDescription" required placeholder="e.g., Branding Package" className={inputClasses} />
        </div>

        {/* Line Items */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-bold text-gray-800">Services / Items</label>
            <button type="button" onClick={addItem} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium">
              <Plus size={16} /> Add Item
            </button>
          </div>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {items.map((item, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded border border-gray-200">
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Service (e.g., Branding, Photocopying, Embroidery)"
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
          <textarea name="notes" rows={2} placeholder="Additional terms or conditions" className={inputClasses} />
        </div>

        <div className="bg-blue-50 p-3 rounded border border-blue-200">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-800">Total Amount:</span>
            <span className="text-2xl font-bold text-blue-600">${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors">
            Cancel
          </button>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition-colors">
            Create Quote
          </button>
        </div>
      </form>
    </Modal>
  );
}
