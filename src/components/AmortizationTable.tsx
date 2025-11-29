import React from 'react';
import { AmortizationMonth } from '@/utils/calculations';
import { CurrencyCode } from './CurrencySelector';

interface AmortizationTableProps {
    schedule: AmortizationMonth[];
    currency: CurrencyCode;
}

export default function AmortizationTable({ schedule, currency }: AmortizationTableProps) {
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0
        }).format(val);

    return (
        <div className="card overflow-hidden">
            <div className="p-4 flex justify-between items-center" style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-secondary)' }}>
                <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                    Amortization Schedule
                </h3>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {schedule.length} Months
                </span>
            </div>
            <div className="overflow-x-auto" style={{ maxHeight: '400px' }}>
                <table className="w-full text-xs">
                    <thead className="sticky top-0 z-10" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        <tr>
                            <th className="px-3 py-2 text-left font-medium uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Mo</th>
                            <th className="px-3 py-2 text-left font-medium uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Payment</th>
                            <th className="px-3 py-2 text-left font-medium uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Extra</th>
                            <th className="px-3 py-2 text-left font-medium uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Principal</th>
                            <th className="px-3 py-2 text-left font-medium uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Interest</th>
                            <th className="px-3 py-2 text-left font-medium uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Balance</th>
                            <th className="px-3 py-2 text-left font-medium uppercase tracking-wide" style={{ color: 'var(--accent-primary)' }}>Inv.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map((row, index) => (
                            <tr
                                key={row.month}
                                style={{
                                    borderBottom: '1px solid var(--border-light)',
                                    backgroundColor: index % 2 === 0 ? 'var(--bg-primary)' : 'var(--bg-secondary)'
                                }}
                            >
                                <td className="px-3 py-2" style={{ color: 'var(--text-primary)' }}>{row.month}</td>
                                <td className="px-3 py-2" style={{ color: 'var(--text-secondary)' }}>{formatCurrency(row.payment)}</td>
                                <td className="px-3 py-2" style={{ color: row.extraPayment > 0 ? 'var(--success)' : 'var(--text-tertiary)' }}>
                                    {row.extraPayment > 0 ? `+${formatCurrency(row.extraPayment)}` : '-'}
                                </td>
                                <td className="px-3 py-2" style={{ color: 'var(--text-secondary)' }}>{formatCurrency(row.principal)}</td>
                                <td className="px-3 py-2" style={{ color: 'var(--danger)' }}>{formatCurrency(row.interest)}</td>
                                <td className="px-3 py-2" style={{ color: 'var(--text-primary)' }}>{formatCurrency(row.remainingBalance)}</td>
                                <td className="px-3 py-2 font-medium" style={{ color: 'var(--accent-primary)' }}>{formatCurrency(row.investmentValue)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
