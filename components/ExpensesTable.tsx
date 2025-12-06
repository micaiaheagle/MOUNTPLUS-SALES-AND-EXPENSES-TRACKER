'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Search, Edit, Trash2, Download, FileSpreadsheet } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { AddExpenseModal } from '@/components/AddExpenseModal';
import { createExpense, updateExpense, deleteExpense } from '@/actions/expenses';
import { exportToExcel } from '@/lib/export';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExpensesTableProps {
  initialExpenses: any[];
  initialAction?: string;
}

export default function ExpensesTable({ initialExpenses, initialAction }: ExpensesTableProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(initialAction === 'new');
  const [editingExpense, setEditingExpense] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const expenses = initialExpenses.filter(expense => 
    expense.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.personnel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedExpenses: Record<string, any[]> = {};
  expenses.forEach((expense) => {
    const monthKey = format(new Date(expense.date), 'MMMM yyyy');
    if (!groupedExpenses[monthKey]) {
      groupedExpenses[monthKey] = [];
    }
    groupedExpenses[monthKey].push(expense);
  });

  const handleEdit = (expense: any) => {
    setEditingExpense(expense);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(id);
    }
  };

  const handleExportExcel = () => {
    const dataToExport = expenses.map(e => ({
      Date: format(new Date(e.date), 'yyyy-MM-dd'),
      Personnel: e.personnel,
      Purpose: e.purpose,
      Category: e.category,
      Description: e.description,
      Amount: e.amount
    }));
    exportToExcel(dataToExport, `Expenses_Journal_${format(new Date(), 'yyyy-MM-dd')}`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setTextColor(176, 36, 40);
    doc.text('MOUNT+PLUS', 14, 20);
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Expenses Journal', 14, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 37);
    
    const tableData = expenses.map(expense => [
      format(new Date(expense.date), 'dd/MM/yyyy'),
      expense.personnel,
      expense.purpose,
      expense.category,
      `$${Number(expense.amount).toFixed(2)}`
    ]);
    
    autoTable(doc, {
      startY: 45,
      head: [['Date', 'Personnel', 'Purpose', 'Category', 'Amount']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [176, 36, 40] },
      columnStyles: {
        0: { cellWidth: 25 },
        4: { cellWidth: 25, halign: 'right' }
      }
    });
    
    doc.save(`Expenses_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const inputClasses = "w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#B02428] focus:border-transparent outline-none text-gray-900 bg-white";

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans text-sm">
      <div className="max-w-[1600px] mx-auto bg-white border border-gray-400 shadow-sm">
        {/* Toolbar */}
        <div className="bg-[#B02428] text-white px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="font-bold text-xl tracking-tight">Expenses Journal</h1>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search expenses..."
                className="w-full pl-9 pr-4 py-1.5 text-sm text-gray-900 bg-white/90 border-0 rounded focus:ring-2 focus:ring-white/50 placeholder-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-2.5 top-2 w-4 h-4 text-gray-500" />
            </div>
            
            <button
              onClick={handleExportExcel}
              className="bg-green-600 text-white px-3 py-1.5 text-xs font-bold uppercase rounded hover:bg-green-700 transition-colors flex items-center gap-1"
              title="Export to Excel"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel
            </button>

            <button
              onClick={handleExportPDF}
              className="bg-red-600 text-white px-3 py-1.5 text-xs font-bold uppercase rounded hover:bg-red-700 transition-colors flex items-center gap-1"
              title="Export to PDF"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-white text-[#B02428] px-4 py-1.5 text-sm font-bold uppercase rounded hover:bg-gray-50 transition-colors shadow-sm flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Record Cost
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-x-auto">
          {Object.keys(groupedExpenses).length === 0 ? (
            <div className="p-12 text-center text-gray-500 italic bg-gray-50">
              No expenses recorded.
            </div>
          ) : (
            Object.entries(groupedExpenses).map(([month, monthExpenses]) => {
              const totalAmount = monthExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
              
              return (
                <div key={month} className="mb-8">
                  <div className="bg-gray-100 border-y border-gray-300 px-4 py-2 font-bold text-gray-800 uppercase text-xs tracking-wider sticky left-0">
                    {month}
                  </div>
                  
                  <table className="w-full border-collapse text-xs md:text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-gray-900">
                        <th className="border border-gray-300 px-3 py-2 text-left font-bold w-32">DATE</th>
                        <th className="border border-gray-300 px-3 py-2 text-left font-bold">PERSONNEL</th>
                        <th className="border border-gray-300 px-3 py-2 text-left font-bold">PURPOSE</th>
                        <th className="border border-gray-300 px-3 py-2 text-left font-bold">DESCRIPTION</th>
                        <th className="border border-gray-300 px-3 py-2 text-center font-bold w-32">CATEGORY</th>
                        <th className="border border-gray-300 px-3 py-2 text-right font-bold w-32">AMOUNT</th>
                        <th className="border border-gray-300 px-2 py-1 text-center font-bold w-20">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthExpenses.map((expense) => (
                        <tr key={expense.id} className="hover:bg-red-50 group transition-colors bg-white">
                          <td className="border border-gray-300 px-3 py-2 whitespace-nowrap text-gray-900">
                            {format(new Date(expense.date), 'dd/MM/yyyy')}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-gray-900">
                            {expense.personnel}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 font-semibold text-gray-900">
                            {expense.purpose}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-gray-600">
                            {expense.description || '-'}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center text-gray-700">
                            {expense.category}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-right font-mono font-bold text-red-700 bg-red-50">
                            {Number(expense.amount).toFixed(2)}
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-center">
                            <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEdit(expense)} className="text-blue-600 hover:text-blue-800">
                                <Edit size={16} />
                              </button>
                              <button onClick={() => handleDelete(expense.id)} className="text-red-600 hover:text-red-800">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {/* Total Row */}
                      <tr className="bg-gray-100 font-bold">
                        <td colSpan={5} className="border border-gray-300 px-3 py-2 text-right uppercase text-gray-600">
                          Total Expenses {month}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right text-red-700 bg-red-100 border-t-2 border-t-gray-400">
                          {totalAmount.toFixed(2)}
                        </td>
                        <td className="border border-gray-300 bg-gray-100"></td>
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
      <AddExpenseModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      {/* Edit Modal */}
      <Modal isOpen={!!editingExpense} onClose={() => setEditingExpense(null)} title="Edit Expense">
        {editingExpense && (
          <form action={async (formData) => {
            await updateExpense(editingExpense.id, formData);
            setEditingExpense(null);
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" name="date" required defaultValue={new Date(editingExpense.date).toISOString().split('T')[0]} className={inputClasses} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purpose / Title</label>
              <input type="text" name="purpose" required defaultValue={editingExpense.purpose} className={inputClasses} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Personnel Name</label>
              <input type="text" name="personnel" required defaultValue={editingExpense.personnel} className={inputClasses} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                <input type="number" name="amount" min="0" step="0.01" required defaultValue={Number(editingExpense.amount).toString()} className={inputClasses} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select name="category" defaultValue={editingExpense.category} className={inputClasses}>
                  <option value="Fuel">Fuel</option>
                  <option value="Printing Materials">Printing Materials</option>
                  <option value="Salaries">Salaries</option>
                  <option value="Repairs">Repairs</option>
                  <option value="Rent">Rent</option>
                  <option value="Misc">Misc.</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" rows={3} defaultValue={editingExpense.description} className={inputClasses}></textarea>
            </div>
            <div className="pt-4 flex justify-end">
              <button type="submit" className="bg-[#B02428] text-white px-6 py-2 rounded font-bold hover:bg-red-800 transition-colors">
                Update Expense
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
