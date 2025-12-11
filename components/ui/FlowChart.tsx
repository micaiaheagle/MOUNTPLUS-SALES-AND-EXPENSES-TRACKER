'use client';

import { ArrowRight, FileText, CheckCircle, Wallet, FolderPlus, Calculator } from 'lucide-react';
import Link from 'next/link';

export function FlowChart() {
    return (
        <div className="relative py-8 px-4 overflow-x-auto">
            <div className="flex justify-between min-w-[600px] gap-8">
                {/* Money In Flow */}
                <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">MONEY IN</h4>
                    <div className="flex items-center gap-4">
                        <FlowItem label="Estimate" icon={FileText} href="#" />
                        <Arrow />
                        <FlowItem label="Create Invoice" icon={FileText} href="/invoices" active />
                        <Arrow />
                        <FlowItem label="Receive Payment" icon={Wallet} href="/finance/banking" />
                    </div>
                    <div className="mt-8 flex items-center gap-4">
                        <div className="w-[100px]"></div> {/* Spacer */}
                        <div className="w-8"></div> {/* Spacer */}
                        <FlowItem label="Sales Receipt" icon={CheckCircle} href="/sales" variant="secondary" />
                    </div>
                </div>

                {/* Money Out Flow */}
                <div className="flex-1 border-l border-gray-200 pl-8">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">MONEY OUT</h4>
                    <div className="flex items-center gap-4">
                        <FlowItem label="Add Expense" icon={Calculator} href="/expenses" active />
                        <Arrow />
                        <FlowItem label="Pay Bills" icon={Wallet} href="#" />
                    </div>
                    <div className="mt-8 flex items-center gap-4">
                        <FlowItem label="Purchase Order" icon={FolderPlus} href="#" variant="secondary" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function FlowItem({ label, icon: Icon, href, active, variant = 'primary' }: any) {
    const bgClass = active ? 'bg-[#2ca01c] hover:bg-[#1d800e] text-white shadow-md' : 'bg-white hover:bg-gray-50 border border-gray-300 text-gray-700';
    const iconClass = active ? 'text-white' : 'text-gray-500';

    return (
        <Link href={href} className={`flex flex-col items-center justify-center w-24 h-24 rounded-lg transition-all ${bgClass}`}>
            <Icon className={`w-8 h-8 mb-2 ${iconClass}`} />
            <span className="text-xs font-medium text-center leading-tight">{label}</span>
        </Link>
    )
}

function Arrow() {
    return <ArrowRight className="w-5 h-5 text-gray-300" />;
}
