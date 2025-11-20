import React from 'react';
import { Package, ChevronRight, MapPin } from 'lucide-react';

const OrderList = ({ orders, loading, onLoadMore, hasMore }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600',
      processing: 'text-blue-600',
      shipped: 'text-purple-600',
      delivered: 'text-green-600',
      cancelled: 'text-red-600',
    };
    return colors[status] || 'text-gray-600';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading && orders.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
        <p className="text-gray-500 text-sm mb-4">You haven't placed any orders yet</p>
        <a
          href="/products"
          className="inline-block px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors text-sm font-medium"
        >
          Start Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="p-4">
            {/* Order Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Package className={`w-4 h-4 ${getStatusColor(order.status)}`} />
                  <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status === 'delivered' && 'Delivered on '}
                    {order.status === 'shipped' && 'Shipped'}
                    {order.status === 'processing' && 'Order Confirmed'}
                    {order.status === 'pending' && 'Order Placed'}
                    {order.status === 'cancelled' && 'Cancelled'}
                  </span>
                  {order.status === 'delivered' && (
                    <span className="text-sm text-gray-500">
                      {formatDate(order.updated_at)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Order #{order.order_number} • Placed on {formatDate(order.created_at)}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>

            {/* Order Items Preview */}
            <div className="flex items-center gap-3 py-3 border-t border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {order.items?.length === 1
                    ? '1 item'
                    : `${order.items?.length || 0} items`}
                </p>
                <p className="text-sm text-gray-500">
                  Total: {formatPrice(order.total_amount)}
                </p>
              </div>
            </div>

            {/* Order Actions */}
            {order.status !== 'cancelled' && (
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                {order.status === 'delivered' && (
                  <button className="flex-1 px-4 py-2 text-sm font-medium text-pink-600 border border-pink-600 rounded-md hover:bg-pink-50 transition-colors">
                    Buy Again
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Load More */}
      {hasMore && (
        <div className="text-center py-4">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="text-sm font-medium text-pink-600 hover:text-pink-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Show More Orders'}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderList;
