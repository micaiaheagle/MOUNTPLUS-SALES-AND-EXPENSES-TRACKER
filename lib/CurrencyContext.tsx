'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'USD' | 'ZIG' | 'ZAR';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    exchangeRates: Record<Currency, number>;
    convert: (amount: number, from: Currency, to: Currency) => number;
    format: (amount: number, currency?: Currency) => string;
}

const defaultRates: Record<Currency, number> = {
    USD: 1,
    ZIG: 13.5, // Example rate, should be fetched
    ZAR: 18.5,
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<Currency>('USD');
    const [exchangeRates, setExchangeRates] = useState<Record<Currency, number>>(defaultRates);

    // In a real app, fetch rates here
    useEffect(() => {
        // const fetchRates = async () => { ... }
    }, []);

    const convert = (amount: number, from: Currency, to: Currency) => {
        if (from === to) return amount;
        const amountInUSD = amount / exchangeRates[from];
        return amountInUSD * exchangeRates[to];
    };

    const format = (amount: number, curr: Currency = currency) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: curr === 'ZIG' ? 'ZWL' : curr, // Mapped generic ZWL for ZIG symbol if needed, or custom
        }).format(amount).replace('ZWL', 'ZiG');
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRates, convert, format }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
