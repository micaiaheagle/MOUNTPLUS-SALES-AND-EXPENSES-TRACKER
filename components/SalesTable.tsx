'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Search, Edit, Trash2, Download, Printer, FileText } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { AddSaleModal } from '@/components/AddSaleModal';
import { createSale, updateSale, deleteSale } from '@/actions/sales';
import { Sale } from '@prisma/client';
import { exportToExcel } from '@/lib/export';
import { generateDocumentPDF, DocumentData, DocumentItem } from '@/lib/pdfGenerator';

interface SalesTableProps {
  initialSales: any[];
  initialAction?: string;
}

export default function SalesTable({ initialSales, initialAction }: SalesTableProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(initialAction === 'new');
  const [editingSale, setEditingSale] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getFirstItem = (sale: any) => {
    try {
      const items = typeof sale.items === 'string' ? JSON.parse(sale.items) : sale.items;
      return items[0] || { description: '', quantity: 0, price: 0 };
    } catch {
      return { description: '', quantity: 0, price: 0 };
    }
  };

  const sales = initialSales.filter(sale => {
    const item = getFirstItem(sale);
    return (
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const groupedSales: Record<string, Sale[]> = {};
  sales.forEach((sale) => {
    const monthKey = format(new Date(sale.date), 'MMMM yyyy');
    if (!groupedSales[monthKey]) {
      groupedSales[monthKey] = [];
    }
    groupedSales[monthKey].push(sale);
  });

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this sale?')) {
      await deleteSale(id);
    }
  };


  const handlePrint = (sale: any, type: 'job' | 'receipt') => {
    let items: DocumentItem[] = [];
    try {
      items = typeof sale.items === 'string' ? JSON.parse(sale.items) : sale.items;
    } catch {
      items = [];
    }

    const docData: DocumentData = {
      id: sale.id.slice(0, 8).toUpperCase(),
      date: new Date(sale.date),
      customerName: sale.customerName,
      items: items,
      total: Number(sale.totalAmount),
      type: type === 'job' ? 'JOB CARD' : 'RECEIPT',
      paymentMethod: sale.paymentStatus === 'Paid' ? 'CASH' : 'OTHER',
    };

    generateDocumentPDF(docData);
  };

  const handleExport = () => {
    const dataToExport = sales.map(s => {
      const item = getFirstItem(s);
      return {
        Date: format(new Date(s.date), 'yyyy-MM-dd'),
        Customer: s.customerName,
        Description: item.description,
        Quantity: item.quantity,
        Price: item.price,
        Amount: s.totalAmount,
        PaymentStatus: s.paymentStatus
      };
    });
    exportToExcel(dataToExport, `Sales_Journal_${format(new Date(), 'yyyy-MM-dd')}`);
  };

  const inputClasses = "w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#217346] focus:border-transparent outline-none text-gray-900 bg-white";

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans text-sm">
      <div className="max-w-[1600px] mx-auto bg-white border border-gray-400 shadow-sm">
        {/* Toolbar */}
        <div className="bg-[#217346] text-white px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="font-bold text-xl tracking-tight">Sales Journal</h1>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full pl-9 pr-4 py-1.5 text-sm text-gray-900 bg-white/90 border-0 rounded focus:ring-2 focus:ring-white/50 placeholder-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-2.5 top-2 w-4 h-4 text-gray-500" />
            </div>

            <button
              onClick={handleExport}
              className="bg-white text-[#217346] px-3 py-1.5 text-sm font-bold uppercase rounded hover:bg-gray-50 transition-colors shadow-sm flex items-center"
              title="Export to Excel"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-white text-[#217346] px-4 py-1.5 text-sm font-bold uppercase rounded hover:bg-gray-50 transition-colors shadow-sm flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Entry
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-x-auto">
          {Object.keys(groupedSales).length === 0 ? (
            <div className="p-12 text-center text-gray-500 italic bg-gray-50">
              No sales found. Start by adding a new entry.
            </div>
          ) : (
            Object.entries(groupedSales).map(([month, monthSales]) => {
              const totalAmount = monthSales.reduce((sum, sale: any) => sum + Number(sale.totalAmount), 0);

              return (
                <div key={month} className="mb-8">
                  <div className="bg-gray-100 border-y border-gray-300 px-4 py-2 font-bold text-gray-800 uppercase text-xs tracking-wider sticky left-0">
                    {month}
                  </div>

                  <table className="w-full border-collapse text-xs md:text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-gray-900">
                        <th className="border border-gray-300 px-3 py-2 text-left font-bold w-32">DATE</th>
                        <th className="border border-gray-300 px-3 py-2 text-left font-bold">CUSTOMER</th>
                        <th className="border border-gray-300 px-3 py-2 text-left font-bold">JOB</th>
                        <th className="border border-gray-300 px-3 py-2 text-center font-bold w-16">QTY</th>
                        <th className="border border-gray-300 px-3 py-2 text-right font-bold w-24">PRICE</th>
                        <th className="border border-gray-300 px-3 py-2 text-right font-bold w-32">AMOUNT</th>
                        <th className="border border-gray-300 px-3 py-2 text-center font-bold w-24">PAYMENT</th>
                        <th className="border border-gray-300 px-3 py-2 text-center font-bold w-24">STATUS</th>
                        <th className="border border-gray-300 px-3 py-2 text-center font-bold w-32">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthSales.map((sale) => {
                        const item = getFirstItem(sale);
                        return (
                          <tr key={sale.id} className="hover:bg-blue-50 group transition-colors bg-white">
                            <td className="border border-gray-300 px-3 py-2 whitespace-nowrap text-gray-900">
                              {format(new Date(sale.date), 'dd/MM/yyyy')}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 font-semibold text-gray-900">
                              {sale.customerName}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-gray-700">
                              {item.description}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-center text-gray-900">
                              {item.quantity}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-right font-mono text-gray-600">
                              {Number(item.price).toFixed(2)}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-right font-mono font-bold text-gray-900 bg-gray-50">
                              {Number(sale.totalAmount).toFixed(2)}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-center text-gray-600">
                              {sale.paymentStatus}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-center font-bold">
                              <span className={
                                sale.paymentStatus === 'Paid' ? 'text-green-700' : 'text-yellow-700'
                              }>
                                {sale.paymentStatus.toUpperCase()}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-2 py-1 text-center">
                              <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handlePrint(sale, 'job')} className="text-blue-600 hover:text-blue-800 p-1" title="Print Job Card">
                                  <FileText size={16} />
                                </button>
                                <button onClick={() => handlePrint(sale, 'receipt')} className="text-green-600 hover:text-green-800 p-1" title="Print Receipt">
                                  <Printer size={16} />
                                </button>
                                <button onClick={() => handleEdit(sale)} className="text-gray-600 hover:text-gray-800 p-1">
                                  <Edit size={16} />
                                </button>
                                <button onClick={() => handleDelete(sale.id)} className="text-red-600 hover:text-red-800 p-1">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                      {/* Total Row */}
                      <tr className="bg-gray-100 font-bold">
                        <td colSpan={5} className="border border-gray-300 px-3 py-2 text-right uppercase text-gray-600">
                          Total {month}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right text-gray-900 bg-yellow-50 border-t-2 border-t-gray-400">
                          {totalAmount.toFixed(2)}
                        </td>
                        <td colSpan={3} className="border border-gray-300 bg-gray-100"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Modal */}
      <AddSaleModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      {/* Edit Modal */}
      <Modal isOpen={!!editingSale} onClose={() => setEditingSale(null)} title="Edit Sale">
        {editingSale && (
          <form action={async (formData) => {
            await updateSale(editingSale.id, formData);
            setEditingSale(null);
          }} className="space-y-4">
            {(() => {
              const item = getFirstItem(editingSale);
              return (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input type="date" name="date" required defaultValue={new Date(editingSale.date).toISOString().split('T')[0]} className={inputClasses} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                    <input type="text" name="customerName" required defaultValue={editingSale.customerName} className={inputClasses} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                    <input type="text" name="jobDescription" required defaultValue={item.description} className={inputClasses} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <input type="number" name="quantity" min="1" required defaultValue={item.quantity} className={inputClasses} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                      <input type="number" name="price" min="0" step="0.01" required defaultValue={Number(item.price).toString()} className={inputClasses} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment</label>
                      <select name="paymentType" defaultValue={editingSale.paymentStatus === 'Paid' ? 'Cash' : 'Credit'} className={inputClasses}>
                        <option value="Cash">Cash</option>
                        <option value="Credit">Credit</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                      </select>
                    </div>
                    {/* Status removed as it's not in schema */}
                  </div>
                </>
              );
            })()}
            <div className="pt-4 flex justify-end">
              <button type="submit" className="bg-[#217346] text-white px-6 py-2 rounded font-bold hover:bg-green-800 transition-colors">
                Update Entry
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
