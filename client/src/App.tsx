import { useState, useCallback, useEffect } from 'react';
import type { Product, CreateProductPayload } from './types/product';
import { useProducts } from './hooks/useProducts';
import SearchBar from './components/SearchBar';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import Pagination from './components/Pagination';
import DeleteModal from './components/DeleteModal';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import FilterPanel from './components/FilterPanel';
import BulkActionBar from './components/BulkActionBar';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const {
    products,
    loading,
    error,
    pagination,
    search,
    sort,
    order,
    filters,
    setSearch,
    setPage,
    setSort,
    toggleOrder,
    setFilters,
    resetFilters,
    addProduct,
    updateProduct,
    deleteProduct,
    bulkDelete,
    bulkUpdateStock,
    refetch,
  } = useProducts(10);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [dashboardKey, setDashboardKey] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true; // default dark
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // ========================
  // Selection Handlers
  // ========================

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleToggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      const allSelected = products.every((p) => prev.has(p._id));
      if (allSelected) return new Set();
      return new Set(products.map((p) => p._id));
    });
  }, [products]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // ========================
  // Handlers
  // ========================

  const refreshDashboard = () => setDashboardKey((k) => k + 1);

  const handleAddClick = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormSubmit = async (payload: CreateProductPayload) => {
    if (editingProduct) {
      await updateProduct(editingProduct._id, payload);
    } else {
      await addProduct(payload);
    }
    // Close modal first to avoid background flicker
    setShowForm(false);
    setEditingProduct(null);
    // Refresh dashboard stats without remount
    refreshDashboard();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleDeleteClick = (product: Product) => {
    setDeletingProduct(product);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;

    setDeleteLoading(true);
    try {
      await deleteProduct(deletingProduct._id);
      setDeletingProduct(null);
      refreshDashboard();
    } catch {
      // Error already handled in hook
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeletingProduct(null);
  };

  // Bulk handlers
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setBulkLoading(true);
    try {
      await bulkDelete(Array.from(selectedIds));
      clearSelection();
      refreshDashboard();
    } catch {
      // Error handled in hook
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkUpdateStock = async (stock: number) => {
    if (selectedIds.size === 0) return;
    setBulkLoading(true);
    try {
      await bulkUpdateStock(Array.from(selectedIds), stock);
      clearSelection();
      refreshDashboard();
    } catch {
      // Error handled in hook
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Background decoration */}
      <div className="bg-gradient"></div>
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <div className="bg-orb bg-orb-3"></div>

      <div className="container">
        {/* Header */}
        <header className="app-header">
          <div className="header-content">
            <div className="header-left">
              <div className="logo">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m7.5 4.27 9 5.15" />
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                  <path d="m3.3 7 8.7 5 8.7-5" />
                  <path d="M12 22V12" />
                </svg>
              </div>
              <div>
                <h1 className="app-title">Product Hub</h1>
                <p className="app-subtitle">Manage your inventory effortlessly</p>
              </div>
            </div>
            <div className="header-actions">
              {/* Dark/Light Mode Toggle */}
              <button
                className="btn btn-secondary btn-theme-toggle"
                onClick={() => setDarkMode((d) => !d)}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
              <button
                id="add-product-btn"
                className="btn btn-primary btn-add"
                onClick={handleAddClick}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                Add Product
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Analytics */}
        <Dashboard refreshTrigger={dashboardKey} />

        {/* Toolbar */}
        <div className="toolbar">
          <SearchBar value={search} onChange={setSearch} />
          <div className="toolbar-right">
            <label className="show-filters-toggle">
              <input
                type="checkbox"
                checked={showFilters}
                onChange={(e) => setShowFilters(e.target.checked)}
              />
              <span className="show-filters-switch">
                <span className="show-filters-knob"></span>
              </span>
              <span className="show-filters-label">Filters</span>
            </label>
            <span className="stat-badge">
              <strong>{pagination.total}</strong> products
            </span>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            onReset={resetFilters}
            sort={sort}
            order={order}
            onSort={setSort}
            onToggleOrder={toggleOrder}
          />
        )}

        {/* Bulk Action Bar */}
        <BulkActionBar
          selectedCount={selectedIds.size}
          onBulkDelete={handleBulkDelete}
          onBulkUpdateStock={handleBulkUpdateStock}
          onClearSelection={clearSelection}
          loading={bulkLoading}
        />

        {/* Main Content */}
        <main className="main-content">
          {error ? (
            <ErrorMessage message={error} onRetry={refetch} />
          ) : (
            <>
              {loading && products.length === 0 ? (
                <LoadingSpinner />
              ) : (
                <div style={{ opacity: loading && !showForm && !deletingProduct ? 0.6 : 1, transition: 'opacity 0.2s', pointerEvents: loading ? 'none' : 'auto' }}>
                  <ProductList
                    products={products}
                    sort={sort}
                    order={order}
                    onSort={setSort}
                    onToggleOrder={toggleOrder}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    selectedIds={selectedIds}
                    onToggleSelect={handleToggleSelect}
                    onToggleSelectAll={handleToggleSelectAll}
                  />
                  <Pagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    total={pagination.total}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          onSubmit={handleFormSubmit}
          editProduct={editingProduct}
          onCancel={handleFormCancel}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <DeleteModal
          productName={deletingProduct.name}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}

export default App;
