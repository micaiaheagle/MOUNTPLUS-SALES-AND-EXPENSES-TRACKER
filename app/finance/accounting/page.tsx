'use client';

import { useState, useEffect } from 'react';
import { getAccounts, getLedgerEntries, createAccount, postJournalEntry } from '@/lib/finance/actions';

export default function AccountingPage() {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [entries, setEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewAccountModal, setShowNewAccountModal] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        const [accs, ents] = await Promise.all([getAccounts(), getLedgerEntries()]);
        setAccounts(accs);
        setEntries(ents);
        setLoading(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Accounting & General Ledger</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowNewAccountModal(true)}
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                    >
                        New Account
                    </button>
                    <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
                        Post Journal Entry
                    </button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Chart of Accounts */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Chart of Accounts</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 uppercase">
                                <tr>
                                    <th className="px-4 py-2">Code</th>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Type</th>
                                    <th className="px-4 py-2 text-right">Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={4} className="text-center py-4">Loading...</td></tr>
                                ) : accounts.length === 0 ? (
                                    <tr><td colSpan={4} className="text-center py-4 text-gray-500">No accounts found.</td></tr>
                                ) : (
                                    accounts.map((acc) => (
                                        <tr key={acc.id} className="border-b">
                                            <td className="px-4 py-2 font-medium">{acc.code}</td>
                                            <td className="px-4 py-2">{acc.name}</td>
                                            <td className="px-4 py-2 text-gray-500">{acc.type}</td>
                                            <td className={`px-4 py-2 text-right font-mono ${Number(acc.balance) < 0 ? 'text-red-500' : 'text-green-600'}`}>
                                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: acc.currency }).format(Number(acc.balance))}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Ledger Entries */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Recent Ledger Entries</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 uppercase">
                                <tr>
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-2">Description</th>
                                    <th className="px-4 py-2 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={3} className="text-center py-4">Loading...</td></tr>
                                ) : entries.length === 0 ? (
                                    <tr><td colSpan={3} className="text-center py-4 text-gray-500">No entries found.</td></tr>
                                ) : (
                                    entries.map((entry) => (
                                        <tr key={entry.id} className="border-b">
                                            <td className="px-4 py-2">{new Date(entry.date).toLocaleDateString()}</td>
                                            <td className="px-4 py-2">
                                                <div className="font-medium">{entry.description}</div>
                                                <div className="text-xs text-gray-500">{entry.account.name}</div>
                                            </td>
                                            <td className={`px-4 py-2 text-right font-mono ${Number(entry.amount) < 0 ? 'text-red-500' : 'text-green-600'}`}>
                                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: entry.currency }).format(Math.abs(Number(entry.amount)))}
                                                <span className="text-xs ml-1 text-gray-400">{Number(entry.amount) >= 0 ? 'DR' : 'CR'}</span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Simple Modal for New Account (Inline for speed) */}
            {showNewAccountModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Create New Account</h3>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            await createAccount({
                                code: formData.get('code') as string,
                                name: formData.get('name') as string,
                                type: formData.get('type') as string,
                            });
                            setShowNewAccountModal(false);
                            loadData();
                        }}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">Code</label>
                                    <input name="code" required className="w-full border rounded p-2" placeholder="e.g. 1000" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Name</label>
                                    <input name="name" required className="w-full border rounded p-2" placeholder="e.g. Cash on Hand" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Type</label>
                                    <select name="type" className="w-full border rounded p-2">
                                        <option value="Asset">Asset</option>
                                        <option value="Liability">Liability</option>
                                        <option value="Equity">Equity</option>
                                        <option value="Revenue">Revenue</option>
                                        <option value="Expense">Expense</option>
                                    </select>
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <button type="button" onClick={() => setShowNewAccountModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">create</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
