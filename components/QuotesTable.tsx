'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Search, Trash2, ArrowRightCircle, Printer, FileText, Download, FileSpreadsheet } from 'lucide-react';
import { AddQuoteModal } from '@/components/AddQuoteModal';
import { ConvertToJobModal } from '@/components/ConvertToJobModal';
import { deleteQuote } from '@/actions/quotes';
import { exportToExcel } from '@/lib/export';
import { generateDocumentPDF, DocumentData, DocumentItem } from '@/lib/pdfGenerator';

interface QuotesTableProps {
  initialQuotes: any[];
}

export default function QuotesTable({ initialQuotes }: QuotesTableProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [convertingQuote, setConvertingQuote] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedQuote, setExpandedQuote] = useState<string | null>(null);

  const getFirstItemDescription = (quote: any) => {
    try {
      const items = JSON.parse(quote.items);
      return items[0]?.description || '';
    } catch {
      return '';
    }
  };

  const quotes = initialQuotes.filter(quote =>
    quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getFirstItemDescription(quote).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this quote?')) {
      await deleteQuote(id);
    }
  };

  const handleExportExcel = () => {
    const data = quotes.map(quote => {
      const items = JSON.parse(quote.items || '[]');
      const itemsList = items.map((item: any) => `${item.description} (${item.quantity}x$${item.price})`).join('; ');

      return {
        'Date': format(new Date(quote.date), 'dd/MM/yyyy'),
        'Customer': quote.customerName,
        'Items': itemsList,
        'Total Amount': `$${Number(quote.totalAmount).toFixed(2)}`,
        'Status': quote.status
      };
    });

    exportToExcel(data, `Quotes_${new Date().toISOString().split('T')[0]}`);
  };

  const handleExportPDF = () => {
    quotes.forEach((quote) => {
      const items: DocumentItem[] = quote.items
        ? JSON.parse(quote.items).map((item: any) => ({
          description: item.description,
          quantity: item.quantity,
          price: Number(item.price),
          total: Number(item.amount || item.price * item.quantity)
        }))
        : [];

      const docData: DocumentData = {
        id: quote.id.slice(0, 8).toUpperCase(), // Quotes might use ID as number
        date: new Date(quote.date),
        customerName: quote.customerName,
        items: items,
        total: Number(quote.totalAmount),
        type: 'QUOTE'
      };

      generateDocumentPDF(docData);
    });
  };

  const handlePrint = (quote: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const items = JSON.parse(quote.items || '[]');
      const itemsHTML = items.map((item: any) => `
            <tr>
              <td>${item.description}</td>
              <td style="text-align: center;">${item.quantity}</td>
              <td style="text-align: right;">$${Number(item.price).toFixed(2)}</td>
              <td style="text-align: right;">$${Number(item.amount).toFixed(2)}</td>
            </tr>
          `).join('');

      printWindow.document.write(`
            <html>
              <head>
                <title>Quote - ${quote.customerName}</title>
                <style>
                  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #333; }
                  .header { display: flex; justify-content: space-between; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 40px; }
                  .brand { font-size: 28px; font-weight: 900; color: #2563eb; letter-spacing: -1px; }
                  .subtitle { color: #666; font-size: 14px; margin-top: 5px; }
                  .quote-title { font-size: 32px; font-weight: bold; text-transform: uppercase; color: #333; text-align: right; }
                  .meta { text-align: right; color: #666; margin-top: 10px; font-size: 14px; }
                  .client-box { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 40px; border-left: 4px solid #2563eb; }
                  .client-label { font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 5px; }
                  .client-name { font-size: 18px; font-weight: bold; }
                  .job-title { font-size: 16px; color: #666; margin-top: 5px; }
                  .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                  .table th { text-align: left; padding: 15px; background: #2563eb; color: white; font-size: 14px; text-transform: uppercase; }
                  .table td { padding: 15px; border-bottom: 1px solid #e2e8f0; }
                  .total-section { display: flex; justify-content: flex-end; }
                  .total-box { width: 300px; }
                  .total-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 14px; }
                  .grand-total { font-size: 20px; font-weight: bold; border-top: 2px solid #333; margin-top: 10px; padding-top: 10px; }
                  .footer { margin-top: 80px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
                  @media print {
                    body { padding: 0; }
                    .no-print { display: none; }
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
                    <div class="quote-title">Quotation</div>
                    <div class="meta">
                      Date: ${format(new Date(quote.date), 'dd/MM/yyyy')}<br>
                      Ref: #${quote.id.slice(0, 8).toUpperCase()}
                    </div>
                  </div>
                </div>
                
                <div class="client-box">
                  <div class="client-label">Quotation For</div>
                  <div class="client-name">${quote.customerName}</div>
                </div>

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
                    ${itemsHTML}
                  </tbody>
                </table>

                <div class="total-section">
                  <div class="total-box">
                    <div class="total-row grand-total">
                      <span>Total Amount</span>
                      <span>$${Number(quote.totalAmount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div class="footer">
                  <p>This quotation is valid for 30 days from the date of issue.</p>
                  <p>Thank you for your business!</p>
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

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans text-sm">
      <div className="max-w-[1600px] mx-auto bg-white border border-gray-400 shadow-sm">
        {/* Toolbar */}
        <div className="bg-blue-600 text-white px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="font-bold text-xl tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Quotations
          </h1>

          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search quotes..."
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
              title="Generate PDF for all visible quotes"
            >
              <Download className="w-4 h-4" />
              Generate PDFs
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-white text-blue-600 px-4 py-1.5 text-sm font-bold uppercase rounded hover:bg-gray-50 transition-colors shadow-sm flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Quote
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-x-auto">
          {quotes.length === 0 ? (
            <div className="p-12 text-center text-gray-500 italic bg-gray-50">
              No quotes found. Create a new quotation to get started.
            </div>
          ) : (
            <table className="w-full border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <th className="border border-blue-500 px-3 py-3 text-left font-bold w-32 uppercase tracking-wide">Date</th>
                  <th className="border border-blue-500 px-3 py-3 text-left font-bold uppercase tracking-wide">Customer</th>
                  <th className="border border-blue-500 px-3 py-3 text-left font-bold uppercase tracking-wide">Job Description & Items</th>
                  <th className="border border-blue-500 px-3 py-3 text-right font-bold w-32 uppercase tracking-wide">Total Amount</th>
                  <th className="border border-blue-500 px-3 py-3 text-center font-bold w-24 uppercase tracking-wide">Status</th>
                  <th className="border border-blue-500 px-3 py-3 text-center font-bold w-48 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-blue-50 transition-colors bg-white">
                    <td className="border border-gray-300 px-3 py-2 whitespace-nowrap text-gray-900">
                      {format(new Date(quote.date), 'dd/MM/yyyy')}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 font-semibold text-gray-900">
                      {quote.customerName}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {(() => {
                              try {
                                const items = JSON.parse(quote.items || '[]');
                                return items.length > 0 ? items[0].description : 'No items';
                              } catch { return 'Invalid Items'; }
                            })()}
                          </div>
                          {(() => {
                            try {
                              const items = JSON.parse(quote.items || '[]');
                              if (expandedQuote === quote.id) {
                                return (
                                  <div className="mt-2 space-y-1">
                                    {items.map((item: any, idx: number) => (
                                      <div key={idx} className="flex items-center gap-2 text-xs bg-blue-50 px-2 py-1 rounded border border-blue-200">
                                        <span className="bg-blue-600 text-white px-1.5 rounded font-bold">{idx + 1}</span>
                                        <span className="flex-1 text-gray-800">{item.description}</span>
                                        <span className="text-gray-600">Qty: {item.quantity}</span>
                                        <span className="text-gray-600">@${Number(item.price).toFixed(2)}</span>
                                        <span className="font-bold text-blue-700">${Number(item.amount).toFixed(2)}</span>
                                      </div>
                                    ))}
                                  </div>
                                );
                              }
                              return items.length > 1 ? (
                                <button
                                  onClick={() => setExpandedQuote(quote.id)}
                                  className="mt-1 text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                                >
                                  <span className="bg-blue-100 px-2 py-0.5 rounded">{items.length} items</span>
                                  <span>▼ Click to view</span>
                                </button>
                              ) : (
                                <div className="mt-1 text-xs text-gray-600">{items[0]?.description}</div>
                              );
                            } catch {
                              return null;
                            }
                          })()}
                        </div>
                        {expandedQuote === quote.id && (
                          <button
                            onClick={() => setExpandedQuote(null)}
                            className="text-xs text-gray-500 hover:text-gray-700 ml-2"
                          >
                            ▲ Collapse
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right font-mono font-bold text-gray-900">
                      ${Number(quote.totalAmount).toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center font-bold">
                      <span className={`px-2 py-1 rounded text-xs ${quote.status === 'Converted' ? 'bg-green-100 text-green-800' :
                        quote.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                        {quote.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handlePrint(quote)}
                          className="text-gray-600 hover:text-gray-900 p-1"
                          title="Print Quote"
                        >
                          <Printer size={16} />
                        </button>

                        {quote.status !== 'Converted' && (
                          <button
                            onClick={() => setConvertingQuote(quote)}
                            className="text-green-600 hover:text-green-800 p-1 flex items-center gap-1 font-bold text-xs uppercase"
                            title="Convert to Job"
                          >
                            <ArrowRightCircle size={16} />
                            Job
                          </button>
                        )}

                        <button onClick={() => handleDelete(quote.id)} className="text-red-600 hover:text-red-800 p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Modal */}
      <AddQuoteModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      {/* Convert to Job Modal */}
      <ConvertToJobModal
        isOpen={!!convertingQuote}
        onClose={() => setConvertingQuote(null)}
        quote={convertingQuote}
      />
    </div>
  );
}
