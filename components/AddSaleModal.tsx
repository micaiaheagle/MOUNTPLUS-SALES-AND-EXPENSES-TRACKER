'use client';

import { Modal } from '@/components/Modal';
import { createSale } from '@/actions/sales';

interface AddSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddSaleModal({ isOpen, onClose }: AddSaleModalProps) {
  const inputClasses = "w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#217346] focus:border-transparent outline-none text-gray-900 bg-white";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Sale">
      <form action={async (formData) => {
        await createSale(formData);
        onClose();
      }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className={inputClasses} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
          <input type="text" name="customerName" required className={inputClasses} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
          <input type="text" name="jobDescription" required className={inputClasses} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input type="number" name="quantity" min="1" defaultValue="1" required className={inputClasses} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input type="number" name="price" min="0" step="0.01" required className={inputClasses} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment</label>
            <select name="paymentType" className={inputClasses}>
              <option value="Cash">Cash</option>
              <option value="Credit">Credit</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" className={inputClasses}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
        <div className="pt-4 flex justify-end">
          <button type="submit" className="bg-[#217346] text-white px-6 py-2 rounded font-bold hover:bg-green-800 transition-colors">
            Save Entry
          </button>
        </div>
      </form>
    </Modal>
  );
}
