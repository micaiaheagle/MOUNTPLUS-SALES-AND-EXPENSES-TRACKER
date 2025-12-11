'use client';

import { useState } from 'react';
import { Plus, Search, FileDown, Trash2 } from 'lucide-react';
import { AddInvoiceModal } from './AddInvoiceModal';
import { generateDocumentPDF, DocumentData, DocumentItem } from '@/lib/pdfGenerator';
import { deleteInvoice } from '@/actions/invoices';

interface Customer {
    id: string;
    name: string;
}

interface Invoice {
    id: string;
    invoiceNumber: string;
    date: Date;
    dueDate: Date;
    customer: { name: string; email: string | null; address: string | null; phone: string | null };
    totalAmount: any; // Decimal
    status: string;
    items: string; // JSON string
    currency: string;
}

interface InvoicesTableProps {
    invoices: any[]; // Relaxed type to matching prisma return
    customers: Customer[];
}

export function InvoicesTable({ invoices, customers }: InvoicesTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const filteredInvoices = invoices.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const generatePDF = (invoice: any) => {
        const items: DocumentItem[] = invoice.items
            ? JSON.parse(invoice.items).map((item: any) => ({
                description: item.description,
                quantity: item.quantity,
                price: Number(item.price), // Ensure number
                total: Number(item.amount || item.price * item.quantity)
            }))
            : [];

        const docData: DocumentData = {
            id: invoice.invoiceNumber,
            date: new Date(invoice.date),
            dueDate: new Date(invoice.dueDate),
            customerName: invoice.customer.name,
            customerAddress: invoice.customer.address || '',
            customerPhone: invoice.customer.phone || '',
            customerEmail: invoice.customer.email || '',
            items: items,
            total: Number(invoice.totalAmount),
            currency: invoice.currency,
            paymentMethod: invoice.status === 'Paid' ? 'CASH' : 'PENDING',
            type: 'INVOICE'
        };

        generateDocumentPDF(docData);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this invoice?')) {
            await deleteInvoice(id);
        }
    };

    const formatCurrency = (amount: number, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount).replace('ZWL', 'ZiG');
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search invoices..."
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
                    Create Invoice
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                            <th className="p-4 font-bold border-b">Invoice #</th>
                            <th className="p-4 font-bold border-b">Date</th>
                            <th className="p-4 font-bold border-b">Customer</th>
                            <th className="p-4 font-bold border-b">Amount</th>
                            <th className="p-4 font-bold border-b">Status</th>
                            <th className="p-4 font-bold border-b text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredInvoices.length > 0 ? (
                            filteredInvoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-blue-50 transition-colors group">
                                    <td className="p-4 font-medium text-gray-900">{invoice.invoiceNumber}</td>
                                    <td className="p-4 text-gray-600">{new Date(invoice.date).toLocaleDateString()}</td>
                                    <td className="p-4 text-gray-600">{invoice.customer.name}</td>
                                    <td className="p-4 font-bold text-gray-900">{formatCurrency(Number(invoice.totalAmount), invoice.currency)}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                            invoice.status === 'Unpaid' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <button
                                            onClick={() => generatePDF(invoice)}
                                            className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100 transition-colors"
                                            title="Download PDF"
                                        >
                                            <FileDown size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(invoice.id)}
                                            className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete Invoice"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                    No invoices found. Click "Create Invoice" to start.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <AddInvoiceModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} customers={customers} />
        </div>
    );
}
