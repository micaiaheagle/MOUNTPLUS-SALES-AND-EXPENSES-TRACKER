'use client';

import { useState } from 'react';
import { FileText, TrendingUp, TrendingDown, DollarSign, Download, FileSpreadsheet, Filter, TrendingUpIcon } from "lucide-react";
import { exportToExcel } from "@/lib/export";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportsClientProps {
  totalSales: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  monthlyData: Array<{
    month: string;
    sales: number;
    expenses: number;
    profit: number;
    margin: number;
  }>;
}

export default function ReportsClient({ 
  totalSales, 
  totalExpenses, 
  netProfit, 
  profitMargin,
  monthlyData 
}: ReportsClientProps) {
  const [dateRange, setDateRange] = useState<'all' | '3months' | '6months' | '1year'>('all');
  const [showComparison, setShowComparison] = useState(false);

  // Filter data based on date range
  const filteredData = monthlyData.slice(0, 
    dateRange === '3months' ? 3 :
    dateRange === '6months' ? 6 :
    dateRange === '1year' ? 12 :
    monthlyData.length
  );

  // Calculate filtered totals
  const filteredSales = filteredData.reduce((sum, d) => sum + d.sales, 0);
  const filteredExpenses = filteredData.reduce((sum, d) => sum + d.expenses, 0);
  const filteredProfit = filteredSales - filteredExpenses;
  const filteredMargin = filteredSales > 0 ? (filteredProfit / filteredSales) * 100 : 0;

  // Calculate trends
  const recentMonth = filteredData[0];
  const previousMonth = filteredData[1];
  const salesTrend = previousMonth ? ((recentMonth.sales - previousMonth.sales) / previousMonth.sales * 100) : 0;
  const expensesTrend = previousMonth ? ((recentMonth.expenses - previousMonth.expenses) / previousMonth.expenses * 100) : 0;

  const handleExportExcel = () => {
    const data = monthlyData.map(row => ({
      'Month': row.month,
      'Income': `$${row.sales.toFixed(2)}`,
      'Expenses': `$${row.expenses.toFixed(2)}`,
      'Net Profit': `$${row.profit.toFixed(2)}`,
      'Margin': `${row.margin.toFixed(1)}%`
    }));
    
    exportToExcel(data, `Financial_Report_${new Date().toISOString().split('T')[0]}`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(33, 115, 70);
    doc.text('MOUNT+PLUS', 14, 20);
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Financial Reports', 14, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 37);
    
    // Summary Section
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Financial Summary', 14, 50);
    
    const summaryData = [
      ['Total Revenue', `$${totalSales.toFixed(2)}`],
      ['Total Expenses', `$${totalExpenses.toFixed(2)}`],
      ['Net Profit', `$${netProfit.toFixed(2)}`],
      ['Profit Margin', `${profitMargin.toFixed(1)}%`]
    ];
    
    autoTable(doc, {
      startY: 55,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [33, 115, 70] },
      margin: { left: 14 }
    });
    
    // Monthly Performance
    doc.setFontSize(12);
    const finalY = (doc as any).lastAutoTable.finalY || 95;
    doc.text('Monthly Performance', 14, finalY + 10);
    
    const tableData = monthlyData.map(row => [
      row.month,
      `$${row.sales.toFixed(2)}`,
      `$${row.expenses.toFixed(2)}`,
      `$${row.profit.toFixed(2)}`,
      `${row.margin.toFixed(1)}%`
    ]);
    
    autoTable(doc, {
      startY: finalY + 15,
      head: [['Month', 'Income', 'Expenses', 'Net Profit', 'Margin']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [33, 115, 70] },
      margin: { left: 14 }
    });
    
    doc.save(`Financial_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans text-sm">
      <div className="max-w-[1200px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 border border-gray-300 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#217346]" />
                Financial Reports
              </h1>
              <p className="text-gray-500 mt-1">Comprehensive overview of financial performance</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right mr-4">
                <div className="text-sm text-gray-500">Net Profit ({dateRange === 'all' ? 'All Time' : dateRange === '3months' ? 'Last 3 Months' : dateRange === '6months' ? 'Last 6 Months' : 'Last Year'})</div>
                <div className={`text-3xl font-bold ${filteredProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${filteredProfit.toFixed(2)}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleExportExcel}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors font-bold text-xs uppercase"
                >
                  <FileSpreadsheet size={16} />
                  Excel
                </button>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors font-bold text-xs uppercase"
                >
                  <Download size={16} />
                  PDF
                </button>
              </div>
            </div>
          </div>
          
          {/* Date Range Filter */}
          <div className="flex items-center gap-2 border-t pt-4">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-700 mr-2">Time Period:</span>
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'All Time' },
                { value: '3months', label: 'Last 3 Months' },
                { value: '6months', label: 'Last 6 Months' },
                { value: '1year', label: 'Last Year' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setDateRange(option.value as any)}
                  className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                    dateRange === option.value
                      ? 'bg-[#217346] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Cards with Trends */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 border border-gray-300 shadow-sm">
             <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 font-medium uppercase text-xs tracking-wider">Total Revenue</p>
                <div className="bg-green-100 p-2 rounded-full text-green-600">
                   <TrendingUp size={20} />
                </div>
             </div>
             <p className="text-2xl font-bold text-gray-900">${filteredSales.toFixed(2)}</p>
             {previousMonth && (
               <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${salesTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                 {salesTrend >= 0 ? '↑' : '↓'} {Math.abs(salesTrend).toFixed(1)}% vs last month
               </div>
             )}
          </div>

          <div className="bg-white p-6 border border-gray-300 shadow-sm">
             <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 font-medium uppercase text-xs tracking-wider">Total Expenses</p>
                <div className="bg-red-100 p-2 rounded-full text-red-600">
                   <TrendingDown size={20} />
                </div>
             </div>
             <p className="text-2xl font-bold text-red-700">${filteredExpenses.toFixed(2)}</p>
             {previousMonth && (
               <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${expensesTrend >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                 {expensesTrend >= 0 ? '↑' : '↓'} {Math.abs(expensesTrend).toFixed(1)}% vs last month
               </div>
             )}
          </div>

          <div className="bg-white p-6 border border-gray-300 shadow-sm">
             <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 font-medium uppercase text-xs tracking-wider">Profit Margin</p>
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                   <DollarSign size={20} />
                </div>
             </div>
             <p className={`text-2xl font-bold ${filteredMargin >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
               {filteredMargin.toFixed(1)}%
             </p>
             <div className="text-xs text-gray-500 mt-2">
               Net: ${filteredProfit.toFixed(2)}
             </div>
          </div>
        </div>

        {/* Monthly Performance Table */}
        <div className="bg-white border border-gray-300 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="font-bold text-gray-800 text-lg">Monthly Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold border-b border-gray-200">Month</th>
                  <th className="p-4 font-bold border-b border-gray-200 text-right">Income</th>
                  <th className="p-4 font-bold border-b border-gray-200 text-right">Expenses</th>
                  <th className="p-4 font-bold border-b border-gray-200 text-right">Net Profit</th>
                  <th className="p-4 font-bold border-b border-gray-200 text-right">Margin</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 border-b border-gray-100 last:border-0">
                    <td className="p-4 font-medium text-gray-900">{row.month}</td>
                    <td className="p-4 text-right font-mono text-gray-700">${row.sales.toFixed(2)}</td>
                    <td className="p-4 text-right font-mono text-red-600">${row.expenses.toFixed(2)}</td>
                    <td className={`p-4 text-right font-mono font-bold ${row.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${row.profit.toFixed(2)}
                    </td>
                    <td className={`p-4 text-right font-mono ${row.margin >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      {row.margin.toFixed(1)}%
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500 italic">No data available yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
