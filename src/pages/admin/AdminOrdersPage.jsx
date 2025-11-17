import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdminOrders } from '../../hooks/useAdminOrders';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { 
  ShoppingCart, 
  Search, 
  Eye, 
  Package, 
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Download,
  ExternalLink
} from 'lucide-react';

const AdminOrdersPage = () => {
  const {
    orders,
    loading,
    error,
    pagination,
    nextPage,
    prevPage,
    refreshOrders
  } = useAdminOrders();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.id?.toString().includes(searchTerm) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      'confirmed': { color: 'bg-blue-100 text-blue-800', label: 'Confirmed' },
      'processing': { color: 'bg-purple-100 text-purple-800', label: 'Processing' },
      'shipped': { color: 'bg-indigo-100 text-indigo-800', label: 'Shipped' },
      'delivered': { color: 'bg-emerald-100 text-emerald-800', label: 'Delivered' },
      'cancelled': { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
      'refunded': { color: 'bg-stone-100 text-stone-800', label: 'Refunded' }
    };

    const config = statusConfig[status] || { color: 'bg-stone-100 text-stone-800', label: status };
    
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  // Mock stats - replace with real data
  const orderStats = {
    total: 89,
    pending: 12,
    processing: 15,
    shipped: 25,
    delivered: 32,
    cancelled: 5
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Orders Management</h1>
            <p className="text-stone-600">Monitor and manage customer orders</p>
          </div>
          <Button
            onClick={refreshOrders}
            variant="outline"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600">Total Orders</p>
                  <p className="text-2xl font-bold text-stone-900">{orderStats.total}</p>
                </div>
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{orderStats.pending}</p>
                </div>
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600">Processing</p>
                  <p className="text-2xl font-bold text-purple-600">{orderStats.processing}</p>
                </div>
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600">Shipped</p>
                  <p className="text-2xl font-bold text-blue-600">{orderStats.shipped}</p>
                </div>
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600">Delivered</p>
                  <p className="text-2xl font-bold text-emerald-600">{orderStats.delivered}</p>
                </div>
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600">Cancelled</p>
                  <p className="text-2xl font-bold text-red-600">{orderStats.cancelled}</p>
                </div>
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Orders ({orders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-4 w-4" />
                  <Input
                    placeholder="Search by order ID, customer email, or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-stone-400 animate-pulse" />
                <p className="text-stone-600">Loading orders...</p>
              </div>
            )}

            {/* Orders List */}
            {!loading && (
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-stone-400" />
                    <p className="text-stone-600">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'No orders match your filters' 
                        : 'No orders found'
                      }
                    </p>
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      formatDate={formatDate}
                      formatCurrency={formatCurrency}
                      getStatusBadge={getStatusBadge}
                    />
                  ))
                )}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <p className="text-sm text-stone-600">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} orders
                </p>
                <div className="flex space-x-2">
                  <Button
                    onClick={prevPage}
                    disabled={pagination.page === 1}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={nextPage}
                    disabled={pagination.page === pagination.totalPages}
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

const OrderCard = ({ order, formatDate, formatCurrency, getStatusBadge }) => {
  return (
    <div className="border border-stone-200 rounded-lg p-4 hover:bg-stone-50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-medium text-stone-900">
              Order #{order.id}
            </h4>
            {getStatusBadge(order.status)}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-stone-600">
            <div>
              <span className="font-medium">Customer:</span> {order.user?.full_name || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Email:</span> {order.user?.email || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Total:</span> {formatCurrency(order.total_amount)}
            </div>
            <div>
              <span className="font-medium">Date:</span> {formatDate(order.created_at)}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
        >
          <Eye className="h-4 w-4 mr-1" />
          View Details
        </Button>
        
        {order.status === 'confirmed' && (
          <Button
            variant="outline"
            size="sm"
          >
            <Package className="h-4 w-4 mr-1" />
            Create Shipment
          </Button>
        )}
        
        {order.shipment_tracking_id && (
          <Button
            onClick={() => window.open(`/track/shipment/${order.shipment_tracking_id}`, '_blank')}
            variant="outline"
            size="sm"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Track
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;