import React, { useEffect, useState } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import type { DashboardStats } from '../types/product';
import productApi from '../api/productApi';

const COLORS = {
    inStock: '#10b981',
    lowStock: '#f59e0b',
    outOfStock: '#ef4444',
    bar: '#6366f1',
};

interface DashboardProps {
    refreshTrigger?: number;
}

const Dashboard: React.FC<DashboardProps> = ({ refreshTrigger = 0 }) => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        const fetchStats = async () => {
            try {
                // Only show skeleton on initial load, not on refreshes
                if (!stats) setLoading(true);
                const response = await productApi.getStats();
                if (cancelled) return;
                if (response.success) {
                    setStats(response.data);
                }
            } catch (err: any) {
                if (cancelled) return;
                setError(err.response?.data?.message || err.message || 'Failed to load analytics');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchStats();
        return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshTrigger]);

    if (loading) {
        return (
            <div className="dashboard dashboard-loading">
                <div className="dashboard-skeleton">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="stat-card skeleton-card">
                            <div className="skeleton-line skeleton-sm"></div>
                            <div className="skeleton-line skeleton-lg"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return null;
    }

    const pieData = [
        { name: 'In Stock', value: stats.stockDistribution.inStock, color: COLORS.inStock },
        { name: 'Low Stock', value: stats.stockDistribution.lowStock, color: COLORS.lowStock },
        { name: 'Out of Stock', value: stats.stockDistribution.outOfStock, color: COLORS.outOfStock },
    ].filter(d => d.value > 0);

    const barData = stats.productsAddedPerMonth.map((item) => ({
        month: formatMonth(item.month),
        count: item.count,
    }));

    return (
        <div className="dashboard">
            {/* Stat Cards */}
            <div className="dashboard-stats">
                <div className="stat-card stat-total">
                    <div className="stat-card-icon stat-icon-total">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m7.5 4.27 9 5.15" />
                            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                            <path d="m3.3 7 8.7 5 8.7-5" />
                            <path d="M12 22V12" />
                        </svg>
                    </div>
                    <div className="stat-card-content">
                        <span className="stat-card-label">Total Products</span>
                        <span className="stat-card-value">{stats.totalProducts}</span>
                    </div>
                </div>

                <div className="stat-card stat-value">
                    <div className="stat-card-icon stat-icon-value">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" x2="12" y1="2" y2="22" />
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </div>
                    <div className="stat-card-content">
                        <span className="stat-card-label">Inventory Value</span>
                        <span className="stat-card-value">{formatCurrency(stats.totalInventoryValue)}</span>
                    </div>
                </div>

                <div className="stat-card stat-low">
                    <div className="stat-card-icon stat-icon-low">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                            <path d="M12 9v4" />
                            <path d="M12 17h.01" />
                        </svg>
                    </div>
                    <div className="stat-card-content">
                        <span className="stat-card-label">Low Stock</span>
                        <span className="stat-card-value">{stats.lowStockCount}</span>
                    </div>
                </div>

                <div className="stat-card stat-out">
                    <div className="stat-card-icon stat-icon-out">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="m15 9-6 6" />
                            <path d="m9 9 6 6" />
                        </svg>
                    </div>
                    <div className="stat-card-content">
                        <span className="stat-card-label">Out of Stock</span>
                        <span className="stat-card-value">{stats.outOfStockCount}</span>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="dashboard-charts">
                {pieData.length > 0 && (
                    <div className="chart-card">
                        <h3 className="chart-title">Stock Distribution</h3>
                        <div className="chart-content">
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={85}
                                        paddingAngle={3}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            background: '#1a2237',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            color: '#f1f5f9',
                                            fontSize: '0.813rem',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="chart-legend">
                                {pieData.map((item) => (
                                    <div key={item.name} className="legend-item">
                                        <span className="legend-dot" style={{ background: item.color }}></span>
                                        <span className="legend-label">{item.name}</span>
                                        <span className="legend-value">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {barData.length > 0 && (
                    <div className="chart-card">
                        <h3 className="chart-title">Products Added Per Month</h3>
                        <div className="chart-content">
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={barData} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                        tickLine={false}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: '#1a2237',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            color: '#f1f5f9',
                                            fontSize: '0.813rem',
                                        }}
                                        cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                                    />
                                    <Bar dataKey="count" fill={COLORS.bar} radius={[4, 4, 0, 0]} name="Products" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

function formatCurrency(value: number): string {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
    return `$${value.toFixed(2)}`;
}

function formatMonth(yyyymm: string): string {
    const [year, month] = yyyymm.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month) - 1]} ${year.slice(2)}`;
}

export default Dashboard;
