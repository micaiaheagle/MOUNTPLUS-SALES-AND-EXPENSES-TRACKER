'use client';

import { useState } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { deleteCustomer } from '@/actions/customers';
import { AddCustomerModal } from './AddCustomerModal';

interface Customer {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
}

interface CustomersTableProps {
    customers: Customer[];
}

export function CustomersTable({ customers }: CustomersTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this customer?')) {
            await deleteCustomer(id);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    Add Customer
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                            <th className="p-4 font-bold border-b">Name</th>
                            <th className="p-4 font-bold border-b">Email</th>
                            <th className="p-4 font-bold border-b">Phone</th>
                            <th className="p-4 font-bold border-b">Address</th>
                            <th className="p-4 font-bold border-b text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredCustomers.length > 0 ? (
                            filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-blue-50 transition-colors group">
                                    <td className="p-4 font-medium text-gray-900">{customer.name}</td>
                                    <td className="p-4 text-gray-600">{customer.email || '-'}</td>
                                    <td className="p-4 text-gray-600">{customer.phone || '-'}</td>
                                    <td className="p-4 text-gray-600 truncate max-w-xs">{customer.address || '-'}</td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleDelete(customer.id)}
                                            className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete Customer"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    No customers found. Click "Add Customer" to create one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <AddCustomerModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </div>
    );
}
