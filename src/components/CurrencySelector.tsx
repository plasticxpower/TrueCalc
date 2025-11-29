import React from 'react';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'CZK';

interface CurrencySelectorProps {
    currency: CurrencyCode;
    setCurrency: (c: CurrencyCode) => void;
}

export const CURRENCIES: Record<CurrencyCode, { symbol: string, name: string }> = {
    USD: { symbol: '$', name: 'US Dollar' },
    EUR: { symbol: '€', name: 'Euro' },
    GBP: { symbol: '£', name: 'British Pound' },
    JPY: { symbol: '¥', name: 'Japanese Yen' },
    CAD: { symbol: 'C$', name: 'Canadian Dollar' },
    CZK: { symbol: 'Kč', name: 'Czech Koruna' },
};

export default function CurrencySelector({ currency, setCurrency }: CurrencySelectorProps) {
    return (
        <div className="relative">
            <select
                id="currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="appearance-none px-4 py-2 pr-10 text-sm font-medium rounded-lg cursor-pointer transition-colors"
                style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)'
                }}
            >
                {Object.entries(CURRENCIES).map(([code, { symbol }]) => (
                    <option key={code} value={code}>
                        {symbol} {code}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-tertiary)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
}
