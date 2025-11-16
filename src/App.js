import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './hooks/useCart';
import Home from './pages/home';
import About from './pages/about';
import Products from './pages/Products';
import Product from './pages/Product';
import Cart from './pages/cart';
import Layout from '@/components/navbar/Layout';  
import { AuthProvider } from '@/hooks/useAuth';
import './App.css';
import Login from './components/auth/login';
import Signup from './components/auth/signup';
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:productId" element={<Product />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
            </Routes>
          </Layout>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
