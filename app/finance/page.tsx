
import Link from 'next/link';
import { Landmark, FileText, PieChart } from 'lucide-react';

export default function FinancePage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">Finance Overview</h1>
                <p className="text-lg text-gray-600 mt-2">Manage your financial health, accounting, and reports.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Accounting Card */}
                <Link href="/finance/accounting" className="group">
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all h-full">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                            <Landmark className="w-6 h-6 text-blue-600 group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Accounting & GL</h3>
                        <p className="text-gray-500">Manage chart of accounts, journal entries, and general ledger.</p>
                    </div>
                </Link>

                {/* Invoicing Card */}
                <Link href="/invoices" className="group">
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all h-full">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                            <FileText className="w-6 h-6 text-green-600 group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Invoices & Receivables</h3>
                        <p className="text-gray-500">Create invoices, track payments, and manage debtors.</p>
                    </div>
                </Link>

                {/* Expenses Card */}
                <Link href="/expenses" className="group">
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all h-full">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-600 transition-colors">
                            <PieChart className="w-6 h-6 text-orange-600 group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Expenses & Payables</h3>
                        <p className="text-gray-500">Track company expenses, receipts, and vendor payments.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
