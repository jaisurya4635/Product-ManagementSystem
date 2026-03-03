import React from 'react';

interface PaginationProps {
    page: number;
    totalPages: number;
    total: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    page,
    totalPages,
    total,
    onPageChange,
}) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = (): (number | string)[] => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible + 2) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);

            if (page > 3) pages.push('...');

            const start = Math.max(2, page - 1);
            const end = Math.min(totalPages - 1, page + 1);

            for (let i = start; i <= end; i++) pages.push(i);

            if (page < totalPages - 2) pages.push('...');

            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="pagination-container">
            <span className="pagination-info">
                Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} total)
            </span>
            <div className="pagination">
                <button
                    className="pagination-btn"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    aria-label="Previous page"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>

                {getPageNumbers().map((p, idx) =>
                    typeof p === 'string' ? (
                        <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
                            {p}
                        </span>
                    ) : (
                        <button
                            key={p}
                            className={`pagination-btn ${p === page ? 'active' : ''}`}
                            onClick={() => onPageChange(p)}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    className="pagination-btn"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    aria-label="Next page"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Pagination;
