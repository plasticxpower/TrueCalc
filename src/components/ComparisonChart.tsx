import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { AmortizationMonth } from '@/utils/calculations';
import { CurrencyCode, CURRENCIES } from './CurrencySelector';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface ComparisonChartProps {
    schedule: AmortizationMonth[];
    currency: CurrencyCode;
}

export default function ComparisonChart({ schedule, currency }: ComparisonChartProps) {
    const dataPoints = schedule.filter((_, index) => index % 12 === 0 || index === schedule.length - 1);
    const labels = dataPoints.map(d => `Y${Math.floor(d.month / 12)}`);
    const symbol = CURRENCIES[currency].symbol;

    const data = {
        labels,
        datasets: [
            {
                label: 'Mortgage Balance',
                data: dataPoints.map(d => d.remainingBalance),
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 5,
                borderWidth: 2,
            },
            {
                label: 'Investment Value',
                data: dataPoints.map(d => d.investmentValue),
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.08)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 5,
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                align: 'end' as const,
                labels: {
                    color: '#6c757d',
                    font: { family: 'Inter', size: 11, weight: 500 },
                    usePointStyle: true,
                    boxWidth: 6,
                    padding: 12,
                }
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                backgroundColor: '#ffffff',
                titleColor: '#1a1a1a',
                bodyColor: '#6c757d',
                borderColor: '#e9ecef',
                borderWidth: 1,
                padding: 10,
                displayColors: true,
                callbacks: {
                    label: function (context: { dataset: { label?: string }, parsed: { y: number | null } }) {
                        let label = context.dataset.label || '';
                        if (label) { label += ': '; }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: currency,
                                maximumFractionDigits: 0
                            }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    color: '#adb5bd',
                    font: { size: 10, family: 'Inter' }
                }
            },
            y: {
                grid: { color: '#f1f3f5' },
                border: { display: false },
                ticks: {
                    color: '#adb5bd',
                    font: { size: 10, family: 'Inter' },
                    callback: function (value: string | number) {
                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                        return symbol + (numValue / 1000).toFixed(0) + 'k';
                    }
                }
            }
        },
    };

    return (
        <div className="card p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--text-secondary)' }}>
                Growth Projection
            </h3>
            <div style={{ height: '280px' }}>
                <Line options={options} data={data} />
            </div>
        </div>
    );
}
