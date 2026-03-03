import React, { useState } from 'react';
import type { Filters } from '../hooks/useProducts';

interface FilterPanelProps {
    filters: Filters;
    onFiltersChange: (filters: Filters) => void;
    onReset: () => void;
    sort: string;
    order: 'asc' | 'desc';
    onSort: (sort: string) => void;
    onToggleOrder: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
    filters,
    onFiltersChange,
    onReset,
    sort,
    order,
    onSort,
    onToggleOrder,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const hasActiveFilters =
        filters.minPrice !== '' ||
        filters.maxPrice !== '' ||
        filters.minStock !== '' ||
        filters.maxStock !== '' ||
        filters.recentlyAdded;

    const handleChange = (key: keyof Filters, value: string | boolean) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    const sortOptions = [
        { value: 'createdAt', label: 'Created Date' },
        { value: 'price', label: 'Price' },
        { value: 'stock', label: 'Stock' },
        { value: 'name', label: 'Name' },
    ];

    return (
        <div className="filter-panel">
            <div className="filter-toggle-row">
                {/* Sort Controls */}
                <div className="sort-controls">
                    <label className="filter-label-inline">Sort by:</label>
                    <select
                        className="filter-select"
                        value={sort}
                        onChange={(e) => onSort(e.target.value)}
                    >
                        {sortOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <button
                        className="btn-order"
                        onClick={onToggleOrder}
                        title={order === 'asc' ? 'Ascending' : 'Descending'}
                    >
                        {order === 'asc' ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="m7 15 5-5 5 5" />
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="m7 9 5 5 5-5" />
                            </svg>
                        )}
                        {order === 'asc' ? 'ASC' : 'DESC'}
                    </button>
                </div>

                <div className="filter-actions-row">
                    <button
                        className={`btn btn-secondary btn-filter-toggle ${isOpen ? 'active' : ''} ${hasActiveFilters ? 'has-filters' : ''}`}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                        </svg>
                        Filters
                        {hasActiveFilters && <span className="filter-badge-dot"></span>}
                    </button>
                    {hasActiveFilters && (
                        <button className="btn btn-secondary btn-reset" onClick={onReset}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                <path d="M3 3v5h5" />
                            </svg>
                            Reset All
                        </button>
                    )}
                </div>
            </div>

            {isOpen && (
                <div className="filter-body">
                    <div className="filter-group">
                        <label className="filter-label">Price Range ($)</label>
                        <div className="filter-range">
                            <input
                                type="number"
                                className="filter-input"
                                placeholder="Min"
                                value={filters.minPrice}
                                onChange={(e) => handleChange('minPrice', e.target.value)}
                                min="0"
                                step="0.01"
                            />
                            <span className="filter-range-sep">—</span>
                            <input
                                type="number"
                                className="filter-input"
                                placeholder="Max"
                                value={filters.maxPrice}
                                onChange={(e) => handleChange('maxPrice', e.target.value)}
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Stock Range</label>
                        <div className="filter-range">
                            <input
                                type="number"
                                className="filter-input"
                                placeholder="Min"
                                value={filters.minStock}
                                onChange={(e) => handleChange('minStock', e.target.value)}
                                min="0"
                                step="1"
                            />
                            <span className="filter-range-sep">—</span>
                            <input
                                type="number"
                                className="filter-input"
                                placeholder="Max"
                                value={filters.maxStock}
                                onChange={(e) => handleChange('maxStock', e.target.value)}
                                min="0"
                                step="1"
                            />
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="filter-checkbox-label">
                            <input
                                type="checkbox"
                                className="filter-checkbox"
                                checked={filters.recentlyAdded}
                                onChange={(e) => handleChange('recentlyAdded', e.target.checked)}
                            />
                            <span className="filter-checkbox-custom"></span>
                            Recently Added (Last 7 days)
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterPanel;
