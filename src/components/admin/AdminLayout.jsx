import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  Shield,
  Bell,
  Search
} from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAdminAuth();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: Home,
      current: location.pathname === '/admin',
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: Package,
      current: location.pathname.startsWith('/admin/products'),
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: ShoppingCart,
      current: location.pathname.startsWith('/admin/orders'),
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      current: location.pathname.startsWith('/admin/users'),
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      current: location.pathname.startsWith('/admin/analytics'),
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      current: location.pathname.startsWith('/admin/settings'),
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="h-screen flex bg-stone-50 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:flex lg:flex-col lg:w-64
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-stone-200">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-emerald-600" />
            <span className="text-xl font-semibold text-stone-900">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-stone-400 hover:text-stone-600 hover:bg-stone-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 flex-1 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${item.current
                      ? 'bg-emerald-100 text-emerald-700 border-r-2 border-emerald-700'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }
                  `}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User info */}
        <div className="flex-shrink-0 p-4 border-t border-stone-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.full_name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-900 truncate">
                {user?.full_name || 'Admin User'}
              </p>
              <p className="text-xs text-stone-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full justify-center"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top navigation */}
        <header className="bg-white shadow-sm border-b border-stone-200">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-stone-400 hover:text-stone-600 hover:bg-stone-100"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Breadcrumb or title could go here */}
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-stone-900 lg:ml-0 ml-2">
                Admin Dashboard
              </h1>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <button className="p-2 text-stone-400 hover:text-stone-600">
                <Search className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <button className="p-2 text-stone-400 hover:text-stone-600 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Back to store */}
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                size="sm"
              >
                View Store
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;