'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AddSaleModal } from '@/components/AddSaleModal';
import { AddExpenseModal } from '@/components/AddExpenseModal';

export default function DashboardActions() {
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSaleModalOpen(true)}
          className="bg-white text-[#217346] px-3 py-1 text-xs font-bold uppercase hover:bg-gray-100 rounded shadow-sm border border-transparent transition-colors"
        >
          + Record Sale
        </button>
        <button
          onClick={() => setIsExpenseModalOpen(true)}
          className="bg-white text-[#B02428] px-3 py-1 text-xs font-bold uppercase hover:bg-gray-100 rounded shadow-sm border border-transparent transition-colors"
        >
          + Record Expense
        </button>
      </div>

      <AddSaleModal isOpen={isSaleModalOpen} onClose={() => setIsSaleModalOpen(false)} />
      <AddExpenseModal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} />
    </>
  );
}
