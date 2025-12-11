'use client';

import { useState } from 'react';
import { Plus, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AddBankAccountModal } from './AddBankAccountModal';
import { AddTransactionModal } from './AddTransactionModal';

interface BankAccount {
    id: string;
    name: string;
    type: string;
    accountNumber: string | null;
    balance: any; // Decimal
}

interface Transaction {
    id: string;
    date: Date;
    type: string;
    amount: any;
    description: string;
    category: string | null;
    bankAccount: { name: string } | null;
}

interface FinanceClientProps {
    bankAccounts: BankAccount[];
    transactions: Transaction[];
}

export function FinanceClient({ bankAccounts, transactions }: FinanceClientProps) {
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

    const totalBalance = bankAccounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Finance & Banking</h1>
                    <p className="text-gray-500">Manage bank accounts and transactions.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsAccountModalOpen(true)}
                        className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
                    >
                        <Plus size={18} /> Add Account
                    </button>
                    <button
                        onClick={() => setIsTransactionModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
                    >
                        <Plus size={18} /> Record Transaction
                    </button>
                </div>
            </div>

            {/* Bank Accounts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Summary Card */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-3 mb-4 opacity-80">
                        <Wallet className="w-6 h-6" />
                        <span className="font-medium">Total Balance</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">
                        ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm opacity-60">Across {bankAccounts.length} accounts</div>
                </div>

                {bankAccounts.map(account => (
                    <div key={account.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">{account.name}</h3>
                                <p className="text-sm text-gray-500">{account.type}</p>
                                {account.accountNumber && <p className="text-xs text-gray-400 mt-1">**** {account.accountNumber.slice(-4)}</p>}
                            </div>
                            <div className="bg-blue-50 p-2 rounded-full text-blue-600">
                                <Wallet size={20} />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                            ${Number(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold p-6 border-b border-gray-200">Recent Transactions</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Description</th>
                                <th className="px-6 py-4 font-semibold">Account</th>
                                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                                <th className="px-6 py-4 font-semibold">Category</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.length > 0 ? (
                                transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(tx.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {tx.description}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {tx.bankAccount?.name || '-'}
                                        </td>
                                        <td className={`px-6 py-4 text-sm font-bold text-right ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                            {tx.type === 'INCOME' ? '+' : '-'}${Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                                {tx.category || 'General'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No transactions recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddBankAccountModal isOpen={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} />
            <AddTransactionModal isOpen={isTransactionModalOpen} onClose={() => setIsTransactionModalOpen(false)} bankAccounts={bankAccounts} />
        </div>
    );
}
