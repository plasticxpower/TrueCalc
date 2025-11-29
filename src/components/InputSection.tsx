import React from 'react';
import { CURRENCIES, CurrencyCode } from './CurrencySelector';

interface InputSectionProps {
    principal: number;
    setPrincipal: (val: number) => void;
    rate: number;
    setRate: (val: number) => void;
    years: number;
    setYears: (val: number) => void;
    extraPayment: number;
    setExtraPayment: (val: number) => void;
    investmentRate: number;
    setInvestmentRate: (val: number) => void;
    currency: CurrencyCode;
}

const InputGroup = ({ label, value, onChange, prefix = '', suffix = '' }: {
    label: string,
    value: number,
    onChange: (v: number) => void,
    prefix?: string,
    suffix?: string
}) => (
    <div className="mb-4">
        <label className="label-text">{label}</label>
        <div className="relative">
            {prefix && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    {prefix}
                </span>
            )}
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                className={`input-field ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-14' : ''}`}
            />
            {suffix && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    {suffix}
                </span>
            )}
        </div>
    </div>
);

export default function InputSection({
    principal, setPrincipal,
    rate, setRate,
    years, setYears,
    extraPayment, setExtraPayment,
    investmentRate, setInvestmentRate,
    currency
}: InputSectionProps) {
    const symbol = CURRENCIES[currency].symbol;

    return (
        <div className="card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--text-secondary)' }}>
                Loan Details
            </h2>

            <InputGroup
                label="Loan Amount"
                value={principal}
                onChange={setPrincipal}
                prefix={symbol}
            />
            <InputGroup
                label="Interest Rate"
                value={rate}
                onChange={setRate}
                suffix="%"
            />
            <InputGroup
                label="Term (Years)"
                value={years}
                onChange={setYears}
            />

            <div className="pt-4 mt-4 mb-4" style={{ borderTop: '1px solid var(--border-light)' }}>
                <h2 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Extra Payment Strategy
                </h2>
            </div>

            <InputGroup
                label="Monthly Extra Payment"
                value={extraPayment}
                onChange={setExtraPayment}
                prefix={symbol}
            />
            <InputGroup
                label="Investment Return Rate"
                value={investmentRate}
                onChange={setInvestmentRate}
                suffix="%"
            />
        </div>
    );
}
