'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Search, Edit, Trash2, Download, Printer, FileText } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { AddSaleModal } from '@/components/AddSaleModal';
import { createSale, updateSale, deleteSale } from '@/actions/sales';
import { Sale } from '@prisma/client';
import { exportToExcel } from '@/lib/export';

interface SalesTableProps {
  initialSales: any[];
  initialAction?: string;
}

export default function SalesTable({ initialSales, initialAction }: SalesTableProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(initialAction === 'new');
  const [editingSale, setEditingSale] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const sales = initialSales.filter(sale => 
    sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.jobDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handlePrint = (sale: Sale, type: 'job' | 'receipt') => {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
          const title = type === 'job' ? 'JOB CARD' : 'OFFICIAL RECEIPT';
          const color = type === 'job' ? '#2563eb' : '#217346';
          
          printWindow.document.write(`
            <html>
              <head>
                <title>${title} - ${sale.customerName}</title>
                <style>
                  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #333; }
                  .header { display: flex; justify-content: space-between; border-bottom: 3px solid ${color}; padding-bottom: 20px; margin-bottom: 40px; }
                  .brand { font-size: 28px; font-weight: 900; color: ${color}; letter-spacing: -1px; }
                  .subtitle { color: #666; font-size: 14px; margin-top: 5px; }
                  .doc-title { font-size: 32px; font-weight: bold; text-transform: uppercase; color: #333; text-align: right; }
                  .meta { text-align: right; color: #666; margin-top: 10px; font-size: 14px; }
                  .client-box { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 40px; border-left: 4px solid ${color}; }
                  .client-label { font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 5px; }
                  .client-name { font-size: 18px; font-weight: bold; }
                  .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                  .table th { text-align: left; padding: 15px; background: ${color}; color: white; font-size: 14px; text-transform: uppercase; }
                  .table td { padding: 15px; border-bottom: 1px solid #e2e8f0; }
                  .total-section { display: flex; justify-content: flex-end; }
                  .total-box { width: 300px; }
                  .total-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 14px; }
                  .grand-total { font-size: 20px; font-weight: bold; border-top: 2px solid #333; margin-top: 10px; padding-top: 10px; }
                  .footer { margin-top: 80px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
                  .status-stamp { 
                      position: absolute; top: 150px; right: 50px; 
                      border: 4px solid ${color}; color: ${color}; 
                      font-size: 40px; font-weight: bold; text-transform: uppercase; 
                      padding: 10px 20px; transform: rotate(-15deg); opacity: 0.3; 
                  }
                </style>
              </head>
              <body>
                <div class="header">
                  <div>
                    <div class="brand">MOUNT+PLUS</div>
                    <div class="subtitle">Sales & Expenses Tracking System</div>
                  </div>
                  <div>
                    <div class="doc-title">${title}</div>
                    <div class="meta">
                      Date: ${format(new Date(sale.date), 'dd/MM/yyyy')}<br>
                      Ref: #${sale.id.slice(0, 8).toUpperCase()}
                    </div>
                  </div>
                </div>
                
                <div class="client-box">
                  <div class="client-label">Client Details</div>
                  <div class="client-name">${sale.customerName}</div>
                </div>

                <div class="status-stamp">${type === 'job' ? 'JOB CARD' : 'PAID'}</div>

                <table class="table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th style="text-align: center; width: 100px;">Qty</th>
                      <th style="text-align: right; width: 150px;">Unit Price</th>
                      <th style="text-align: right; width: 150px;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>${sale.jobDescription}</td>
                      <td style="text-align: center;">${sale.quantity}</td>
                      <td style="text-align: right;">$${Number(sale.price).toFixed(2)}</td>
                      <td style="text-align: right;">$${Number(sale.amount).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>

                <div class="total-section">
                  <div class="total-box">
                    <div class="total-row grand-total">
                      <span>Total Amount</span>
                      <span>$${Number(sale.amount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div class="footer">
                  <p>${type === 'job' ? 'Internal Work Order Document' : 'Thank you for your business!'}</p>
                </div>

                <script>
                  window.onload = function() { window.print(); }
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();
      }
  };

  const handleExport = () => {
    const dataToExport = sales.map(s => ({
      Date: format(new Date(s.date), 'yyyy-MM-dd'),
      Customer: s.customerName,
      Description: s.jobDescription,
      Quantity: s.quantity,
      Price: s.price,
      Amount: s.amount,
      Payment: s.paymentType,
      Status: s.status
    }));
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
              const totalAmount = monthSales.reduce((sum, sale) => sum + Number(sale.amount), 0);
              
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
                      {monthSales.map((sale) => (
                        <tr key={sale.id} className="hover:bg-blue-50 group transition-colors bg-white">
                          <td className="border border-gray-300 px-3 py-2 whitespace-nowrap text-gray-900">
                            {format(new Date(sale.date), 'dd/MM/yyyy')}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 font-semibold text-gray-900">
                            {sale.customerName}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-gray-700">
                            {sale.jobDescription}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center text-gray-900">
                            {sale.quantity}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-right font-mono text-gray-600">
                            {Number(sale.price).toFixed(2)}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-right font-mono font-bold text-gray-900 bg-gray-50">
                            {Number(sale.amount).toFixed(2)}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center text-gray-600">
                            {sale.paymentType}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center font-bold">
                            <span className={
                              sale.status === 'Completed' ? 'text-green-700' :
                              sale.status === 'In Progress' ? 'text-blue-700' : 'text-red-700'
                            }>
                              {sale.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-center">
                            <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {sale.status === 'In Progress' && (
                                <button onClick={() => handlePrint(sale, 'job')} className="text-blue-600 hover:text-blue-800 p-1" title="Print Job Card">
                                  <FileText size={16} />
                                </button>
                              )}
                              {sale.status === 'Completed' && (
                                <button onClick={() => handlePrint(sale, 'receipt')} className="text-green-600 hover:text-green-800 p-1" title="Print Receipt">
                                  <Printer size={16} />
                                </button>
                              )}
                              <button onClick={() => handleEdit(sale)} className="text-gray-600 hover:text-gray-800 p-1">
                                <Edit size={16} />
                              </button>
                              <button onClick={() => handleDelete(sale.id)} className="text-red-600 hover:text-red-800 p-1">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
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
              <input type="text" name="jobDescription" required defaultValue={editingSale.jobDescription} className={inputClasses} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input type="number" name="quantity" min="1" required defaultValue={editingSale.quantity} className={inputClasses} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input type="number" name="price" min="0" step="0.01" required defaultValue={Number(editingSale.price).toString()} className={inputClasses} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment</label>
                <select name="paymentType" defaultValue={editingSale.paymentType} className={inputClasses}>
                  <option value="Cash">Cash</option>
                  <option value="Credit">Credit</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status" defaultValue={editingSale.status} className={inputClasses}>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
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
