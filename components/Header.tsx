'use client';

import { Search, Bell, Settings, HelpCircle, Grid } from 'lucide-react';
import Image from 'next/image';

export function Header() {
    return (
        <header className="h-14 bg-[#101928] text-white flex items-center justify-between px-4 fixed top-0 w-full z-50">
            {/* Left: Branding & Company Switcher */}
            <div className="flex items-center gap-4 w-64">
                <div className="text-xl font-bold tracking-tight">MOUNT+PLUS</div>
            </div>

            {/* Center: Search */}
            <div className="flex-1 max-w-2xl mx-auto relative hidden md:block">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full bg-[#2a3341] text-white placeholder-gray-400 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2ca01c] border border-transparent"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4 pl-4">
                <button className="text-gray-300 hover:text-white transition-colors">
                    <Bell className="w-5 h-5" />
                </button>
                <button className="text-gray-300 hover:text-white transition-colors">
                    <Settings className="w-5 h-5" />
                </button>
                <button className="text-gray-300 hover:text-white transition-colors">
                    <HelpCircle className="w-5 h-5" />
                </button>
                <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-xs font-bold border-2 border-white/20">
                    MP
                </div>
            </div>
        </header>
    );
}
