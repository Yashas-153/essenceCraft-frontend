import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartTotals } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    // { name: 'Wholesale', path: '/wholesale' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-md'
          : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            {/* <div className="text-2xl font-light text-stone-900 tracking-tight">
              essence<span className="font-semibold">KRAFT</span>
            </div> */}
            <img src ="logo.png" alt="essenceKRAFT Logo" className="h-20 w-auto"/>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors relative py-2 ${
                  isActive(link.path)
                    ? 'text-emerald-700'
                    : 'text-stone-700 hover:text-emerald-700'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Right side - Cart & Profile */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 text-stone-700 hover:text-emerald-700 transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartTotals.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartTotals.itemCount > 9 ? '9+' : cartTotals.itemCount}
                </span>
              )}
            </button>

            {/* Profile/Login */}
            <div className="hidden md:block">
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 text-stone-700 hover:text-emerald-700 transition-colors">
                    <User className="w-6 h-6" />
                    {user && (
                      <span className="text-sm font-medium">
                        {user.first_name || user.username}
                      </span>
                    )}
                  </button>
                  
                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-sm shadow-lg border border-stone-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                      >
                        My Orders
                      </Link>
                      <hr className="my-2 border-stone-200" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => navigate('/login')}
                  variant="outline"
                  className="border-2 border-stone-300 hover:border-emerald-700 hover:text-emerald-700 text-stone-700 rounded-sm"
                  size="sm"
                >
                  Login
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-emerald-700 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? 'max-h-screen opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-6 py-4 bg-white border-t border-stone-200 shadow-lg">
          <div className="space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-emerald-700'
                    : 'text-stone-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <hr className="border-stone-200" />
            
            {isAuthenticated ? (
              <>
                {user && (
                  <div className="py-2 px-3 bg-emerald-50 rounded-sm">
                    <p className="text-sm text-emerald-900">
                      {user.first_name || user.username}
                    </p>
                    <p className="text-xs text-emerald-700">{user.email}</p>
                  </div>
                )}
                <Link
                  to="/profile"
                  className="block text-base font-medium text-stone-700"
                >
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  className="block text-base font-medium text-stone-700"
                >
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-base font-medium text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Button
                onClick={() => navigate('/login')}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-sm"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;