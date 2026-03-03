import React, { useState } from 'react';

interface BulkActionBarProps {
    selectedCount: number;
    onBulkDelete: () => void;
    onBulkUpdateStock: (stock: number) => void;
    onClearSelection: () => void;
    loading?: boolean;
}

const BulkActionBar: React.FC<BulkActionBarProps> = ({
    selectedCount,
    onBulkDelete,
    onBulkUpdateStock,
    onClearSelection,
    loading = false,
}) => {
    const [showStockInput, setShowStockInput] = useState(false);
    const [stockValue, setStockValue] = useState('');

    const handleUpdateStock = () => {
        const val = Number(stockValue);
        if (!isNaN(val) && val >= 0 && Number.isInteger(val)) {
            onBulkUpdateStock(val);
            setShowStockInput(false);
            setStockValue('');
        }
    };

    if (selectedCount === 0) return null;

    return (
        <div className="bulk-action-bar">
            <div className="bulk-info">
                <span className="bulk-count">{selectedCount}</span>
                <span className="bulk-text">product{selectedCount > 1 ? 's' : ''} selected</span>
            </div>

            <div className="bulk-actions">
                {showStockInput ? (
                    <div className="bulk-stock-input-group">
                        <input
                            type="number"
                            className="bulk-stock-input"
                            placeholder="New stock"
                            value={stockValue}
                            onChange={(e) => setStockValue(e.target.value)}
                            min="0"
                            step="1"
                            disabled={loading}
                        />
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={handleUpdateStock}
                            disabled={loading || stockValue === '' || isNaN(Number(stockValue)) || Number(stockValue) < 0}
                        >
                            {loading ? 'Updating...' : 'Apply'}
                        </button>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => { setShowStockInput(false); setStockValue(''); }}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setShowStockInput(true)}
                        disabled={loading}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        </svg>
                        Update Stock
                    </button>
                )}

                <button
                    className="btn btn-danger btn-sm"
                    onClick={onBulkDelete}
                    disabled={loading}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                    {loading ? 'Deleting...' : 'Delete Selected'}
                </button>

                <button
                    className="btn-icon btn-clear-selection"
                    onClick={onClearSelection}
                    title="Clear selection"
                    disabled={loading}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default BulkActionBar;
