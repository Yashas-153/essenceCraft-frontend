import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './hooks/useCart';
import Home from './pages/home';
import About from './pages/about';
import Products from './pages/Products';
import Product from './pages/Product';
import Cart from './pages/cart';
import Checkout from './pages/checkout';
import OrderSuccess from './pages/OrderSuccess';
import Layout from '@/components/navbar/Layout';  
import { AuthProvider } from '@/hooks/useAuth';
import { AdminProvider } from '@/hooks/useAdminAuth';
import CheckoutPage from './pages/checkout';
import OrderSuccessPage from './pages/OrderSuccess';

// Admin Components
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';

// Inside your Routes
import './App.css';
import Login from './components/auth/login';
import Signup from './components/auth/signup';
function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes with Layout */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/products" element={<Layout><Products /></Layout>} />
              <Route path="/products/:productId" element={<Layout><Product /></Layout>} />
              <Route path="/cart" element={<Layout><Cart /></Layout>} />
              <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
              <Route path="/order-success/:orderId" element={<Layout><OrderSuccess /></Layout>} />
              <Route path="/login" element={<Layout><Login /></Layout>} />
              <Route path="/signup" element={<Layout><Signup /></Layout>} />
              <Route path="/orders/:orderId/success" element={<Layout><OrderSuccessPage /></Layout>} />
              
              {/* Admin Routes (No main layout, use AdminLayout) */}
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/products" element={<AdminProductsPage />} />
              {/* Add more admin routes here as needed */}
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
