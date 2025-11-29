import React from 'react';
import { MortgageResult } from '@/utils/calculations';
import { CurrencyCode } from './CurrencySelector';

interface ResultsSummaryProps {
    result: MortgageResult;
    currency: CurrencyCode;
}

const StatCard = ({ label, value, subValue, highlight = false }: {
    label: string,
    value: string,
    subValue?: string,
    highlight?: boolean
}) => (
    <div
        className="card p-4"
        style={{
            backgroundColor: highlight ? 'var(--accent-light)' : 'var(--bg-primary)',
            borderColor: highlight ? 'var(--accent-primary)' : 'var(--border-light)',
            borderWidth: '1px'
        }}
    >
        <div className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: 'var(--text-secondary)' }}>
            {label}
        </div>
        <div
            className="text-xl md:text-2xl font-bold mb-1"
            style={{ color: highlight ? 'var(--accent-primary)' : 'var(--text-primary)' }}
        >
            {value}
        </div>
        {subValue && (
            <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                {subValue}
            </div>
        )}
    </div>
);

export default function ResultsSummary({ result, currency }: ResultsSummaryProps) {
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0
        }).format(val);

    return (
        <div className="grid grid-cols-2 gap-4">
            <StatCard
                label="Monthly Payment"
                value={formatCurrency(result.monthlyPayment)}
                subValue="Principal + Interest"
            />
            <StatCard
                label="Total Interest"
                value={formatCurrency(result.totalInterest)}
                subValue={`${result.payoffMonths} months`}
            />
            <StatCard
                label="Interest Saved"
                value={formatCurrency(result.investmentComparison.interestSaved)}
                highlight={true}
                subValue="With extra payments"
            />
            <StatCard
                label="Investment Value"
                value={formatCurrency(result.investmentComparison.investmentValue)}
                highlight={true}
                subValue="Potential growth"
            />
        </div>
    );
}
