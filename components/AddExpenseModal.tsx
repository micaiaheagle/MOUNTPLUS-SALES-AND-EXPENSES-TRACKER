'use client';

import { Modal } from '@/components/Modal';
import { createExpense } from '@/actions/expenses';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    date?: string;
    purpose?: string;
    personnel?: string;
    amount?: number;
    category?: string;
    description?: string;
  } | null;
}

export function AddExpenseModal({ isOpen, onClose, initialData }: AddExpenseModalProps) {
  const inputClasses = "w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#B02428] focus:border-transparent outline-none text-gray-900 bg-white";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record New Expense">
      <form action={async (formData) => {
        await createExpense(formData);
        onClose();
      }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input type="date" name="date" required defaultValue={initialData?.date || new Date().toISOString().split('T')[0]} className={inputClasses} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
            <input type="number" name="amount" min="0" step="0.01" required defaultValue={initialData?.amount || ''} className={inputClasses} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purpose / Title</label>
          <input type="text" name="purpose" required defaultValue={initialData?.purpose || ''} className={inputClasses} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Personnel Name</label>
          <input type="text" name="personnel" required defaultValue={initialData?.personnel || ''} className={inputClasses} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select name="category" defaultValue={initialData?.category || 'Fuel'} className={inputClasses}>
            <option value="Fuel">Fuel</option>
            <option value="Printing Materials">Printing Materials</option>
            <option value="Salaries">Salaries</option>
            <option value="Repairs">Repairs</option>
            <option value="Rent">Rent</option>
            <option value="Misc">Misc.</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" rows={3} defaultValue={initialData?.description || ''} className={inputClasses}></textarea>
        </div>
        <div className="pt-4 flex justify-end">
          <button type="submit" className="bg-[#B02428] text-white px-6 py-2 rounded font-bold hover:bg-red-800 transition-colors">
            Save Expense
          </button>
        </div>
      </form>
    </Modal>
  );
}
