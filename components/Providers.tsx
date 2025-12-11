'use client';

import { CurrencyProvider } from '@/lib/CurrencyContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <CurrencyProvider>
            {children}
        </CurrencyProvider>
    );
}
