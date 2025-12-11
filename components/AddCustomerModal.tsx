'use client';

import { Modal } from '@/components/Modal';
import { createCustomer } from '@/actions/customers';

interface AddCustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddCustomerModal({ isOpen, onClose }: AddCustomerModalProps) {
    const inputClasses = "w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-gray-900 bg-white";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await createCustomer(formData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Customer">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                    <input type="text" name="name" required className={inputClasses} placeholder="Company or Person Name" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" name="email" className={inputClasses} placeholder="customer@example.com" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input type="tel" name="phone" className={inputClasses} placeholder="+1234567890" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea name="address" rows={3} className={inputClasses} placeholder="Street Address, City..." />
                </div>

                <div className="pt-4 flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors">
                        Cancel
                    </button>
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition-colors">
                        Save Customer
                    </button>
                </div>
            </form>
        </Modal>
    );
}
