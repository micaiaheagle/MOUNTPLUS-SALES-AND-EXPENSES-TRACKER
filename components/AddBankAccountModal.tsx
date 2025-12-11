'use client';

import { Modal } from '@/components/Modal';
import { createBankAccount } from '@/actions/finance';

interface AddBankAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddBankAccountModal({ isOpen, onClose }: AddBankAccountModalProps) {
    const inputClasses = "w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-gray-900 bg-white";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await createBankAccount(formData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Bank Account">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                    <input type="text" name="name" required placeholder="e.g. Chase Business" className={inputClasses} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                    <select name="type" className={inputClasses}>
                        <option value="Checking">Checking</option>
                        <option value="Savings">Savings</option>
                        <option value="Cash">Cash / Petty Cash</option>
                        <option value="Mobile Money">Mobile Money</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number (Optional)</label>
                    <input type="text" name="accountNumber" placeholder="xxxx-xxxx-xxxx" className={inputClasses} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Initial Balance</label>
                    <input type="number" name="balance" step="0.01" defaultValue="0" className={inputClasses} />
                </div>

                <div className="pt-4 flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors">
                        Cancel
                    </button>
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition-colors">
                        Add Account
                    </button>
                </div>
            </form>
        </Modal>
    );
}
