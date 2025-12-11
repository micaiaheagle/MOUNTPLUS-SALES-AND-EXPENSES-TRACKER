'use client';

import { Modal } from '@/components/Modal';
import { createTransaction } from '@/actions/finance';

interface BankAccount {
    id: string;
    name: string;
}

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    bankAccounts: BankAccount[];
}

export function AddTransactionModal({ isOpen, onClose, bankAccounts }: AddTransactionModalProps) {
    const inputClasses = "w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-gray-900 bg-white";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await createTransaction(formData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Record Transaction">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className={inputClasses} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select name="type" className={inputClasses}>
                            <option value="INCOME">Income / Deposit</option>
                            <option value="EXPENSE">Expense / Withdrawal</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account</label>
                    <select name="bankAccountId" required className={inputClasses}>
                        {bankAccounts.map(account => (
                            <option key={account.id} value={account.id}>{account.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input type="number" name="amount" step="0.01" required min="0" className={inputClasses} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input type="text" name="description" required placeholder="e.g. Client Payment, Office Rent" className={inputClasses} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input type="text" name="category" placeholder="e.g. Sales, Operations, Utilities" className={inputClasses} />
                </div>

                <div className="pt-4 flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors">
                        Cancel
                    </button>
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition-colors">
                        Save Transaction
                    </button>
                </div>
            </form>
        </Modal>
    );
}
