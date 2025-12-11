'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, Wallet, FileText, Settings, Menu, LogOut, ClipboardList, Users, Receipt, Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

import { navigation } from '@/lib/navigation';

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden fixed top-3 left-3 z-50 p-2 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={24} />
      </button>

      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen flex flex-col pt-14",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>

        {/* NEW Button Section */}
        <div className="p-4 pb-2">
          <button className="w-full bg-[#2ca01c] hover:bg-[#1d800e] text-white rounded-full py-2 px-4 shadow-sm font-bold flex items-center justify-center gap-2 transition-colors">
            <span className="text-xl leading-none font-light">+</span> New
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-r-full transition-colors relative",
                  isActive
                    ? "text-[#2ca01c] bg-[#e8f5e9] border-l-4 border-[#2ca01c]"
                    : "text-[#393a3d] hover:bg-gray-100 border-l-4 border-transparent"
                )}
                onClick={() => setIsOpen(false)}
              >
                <Icon className={cn("w-5 h-5 mr-3", isActive ? "text-[#2ca01c]" : "text-gray-500")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
