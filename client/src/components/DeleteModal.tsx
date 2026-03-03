import React from 'react';

interface DeleteModalProps {
    productName: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
    productName,
    onConfirm,
    onCancel,
    loading = false,
}) => {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-icon">
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
                </div>
                <h3 className="modal-title">Delete Product</h3>
                <p className="modal-message">
                    Are you sure you want to delete <strong>"{productName}"</strong>?
                    This action cannot be undone.
                </p>
                <div className="modal-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
