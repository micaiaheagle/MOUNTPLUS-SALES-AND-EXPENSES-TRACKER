'use client';

import { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

export default function BankingPage() {
    const [file, setFile] = useState<File | null>(null);
    const [reconciling, setReconciling] = useState(false);
    const [results, setResults] = useState<any[]>([]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const startReconciliation = async () => {
        if (!file) return;
        setReconciling(true);

        // Simulate processing delay
        setTimeout(() => {
            // Mock results
            setResults([
                { id: 1, date: '2025-12-01', description: 'Payment from Customer A', amount: 500, match: true, confidence: 1.0 },
                { id: 2, date: '2025-12-02', description: 'Unknown Transfer', amount: -120, match: false, confidence: 0.0 },
                { id: 3, date: '2025-12-03', description: 'Supplier Payment B', amount: -2000, match: true, confidence: 0.95 },
            ]);
            setReconciling(false);
        }, 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Bank Reconciliation</h1>
            </div>

            {/* Upload Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Upload Bank Statement</h2>
                <div className="flex items-center gap-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center w-full md:w-1/2 cursor-pointer hover:bg-gray-50 transition-colors relative">
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} accept=".csv,.xlsx" />
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-gray-500 text-sm">Click to upload CSV or Excel</p>
                        {file && <p className="text-blue-600 font-medium mt-2">{file.name}</p>}
                    </div>
                    <button
                        onClick={startReconciliation}
                        disabled={!file || reconciling}
                        className={`px-6 py-3 rounded-lg font-bold text-white shadow-sm transition-all ${!file || reconciling ? 'bg-gray-300' : 'bg-teal-600 hover:bg-teal-700'}`}
                    >
                        {reconciling ? 'Processing...' : 'Start Auto-Match'}
                    </button>
                </div>
            </div>

            {/* Results Section */}
            {results.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Reconciliation Results</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-700 uppercase text-sm">
                                <tr>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Description</th>
                                    <th className="p-3 text-right">Amount</th>
                                    <th className="p-3 text-center">Status</th>
                                    <th className="p-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {results.map((res) => (
                                    <tr key={res.id}>
                                        <td className="p-3">{res.date}</td>
                                        <td className="p-3">{res.description}</td>
                                        <td className={`p-3 text-right font-mono ${res.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            {res.amount.toFixed(2)}
                                        </td>
                                        <td className="p-3 text-center">
                                            {res.match ? (
                                                <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                                                    <CheckCircle size={12} /> Matched
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                                                    <AlertCircle size={12} /> Unmatched
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            {res.match ? (
                                                <button className="text-gray-400 text-sm" disabled>Auto-cleared</button>
                                            ) : (
                                                <button className="text-blue-600 hover:underline text-sm font-medium">Find Match</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
