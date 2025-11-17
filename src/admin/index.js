// Admin Pages
export { default as AdminDashboardPage } from './pages/admin/AdminDashboardPage';
export { default as AdminProductsPage } from './pages/admin/AdminProductsPage';

// Admin Components
export { default as AdminLayout } from './components/admin/AdminLayout';
export { default as AdminDashboard } from './components/admin/AdminDashboard';
export { default as ProductList } from './components/admin/ProductList';
export { default as ProductForm } from './components/admin/ProductForm';

// Admin Hooks
export { useAdminAuth, AdminProvider, withAdminAuth } from './hooks/useAdminAuth';
export { useAdminProducts } from './hooks/useAdminProducts';
export { useAdminOrders } from './hooks/useAdminOrders';
export { useAdminUsers } from './hooks/useAdminUsers';
export { useAdminAnalytics } from './hooks/useAdminAnalytics';

// Admin API
export { adminAPI } from './services/api';