import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="loading-container">
            <div className="spinner">
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
            </div>
            <p className="loading-text">Loading products...</p>
        </div>
    );
};

export default LoadingSpinner;
