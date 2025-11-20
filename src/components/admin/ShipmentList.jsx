import React, { useState, useEffect } from 'react';
import { useShipmentManagement } from '../../hooks/useOrderTracking';
import { useShiprocket } from '../../hooks/useShiprocket';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import ShipmentStatusBadge from '../shipping/ShipmentStatusBadge';
import { 
  Package, 
  Search, 
  Eye, 
  Download, 
  RefreshCw, 
  Filter,
  ExternalLink,
  Calendar,
  Truck,
  User,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

const ShipmentList = ({ onViewDetails }) => {
  const {
    shipments,
    loading,
    error,
    pagination,
    nextPage,
    prevPage,
    goToPage,
    refreshShipments
  } = useShipmentManagement();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = !searchTerm || 
      shipment.awb_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.shiprocket_order_id?.toString().includes(searchTerm) ||
      shipment.shiprocket_shipment_id?.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Shipments ({shipments.length})
          </CardTitle>
          <Button
            onClick={refreshShipments}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-4 w-4" />
              <Input
                placeholder="Search by AWB code, Order ID, or Shipment ID..."
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
              <option value="awb_generated">AWB Generated</option>
              <option value="pickup_scheduled">Pickup Scheduled</option>
              <option value="pickup_completed">Picked Up</option>
              <option value="in_transit">In Transit</option>
              <option value="out_for_delivery">Out for Delivery</option>
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
            <Package className="h-12 w-12 mx-auto mb-4 text-stone-400 animate-pulse" />
            <p className="text-stone-600">Loading shipments...</p>
          </div>
        )}

        {/* Shipments List */}
        {!loading && (
          <div className="space-y-4">
            {filteredShipments.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto mb-4 text-stone-400" />
                <p className="text-stone-600">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No shipments match your filters' 
                    : 'No shipments found'
                  }
                </p>
              </div>
            ) : (
              filteredShipments.map((shipment) => (
                <ShipmentCard 
                  key={shipment.id} 
                  shipment={shipment} 
                  onViewDetails={onViewDetails}
                  formatDate={formatDate}
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
              {pagination.total} shipments
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
  );
};

const ShipmentCard = ({ shipment, onViewDetails, formatDate }) => {
  const { generateLabel } = useShiprocket();

  const handleDownloadLabel = async (e) => {
    e.stopPropagation();
    if (shipment.shiprocket_shipment_id) {
      try {
        await generateLabel({ shipment_ids: [shipment.shiprocket_shipment_id] });
      } catch (error) {
        console.error('Failed to download label:', error);
      }
    }
  };

  return (
    <div 
      className="border border-stone-200 rounded-lg p-4 hover:bg-stone-50 cursor-pointer transition-colors"
      onClick={() => onViewDetails(shipment)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-medium text-stone-900">
              Order #{shipment.shiprocket_order_id || shipment.order_id}
            </h4>
            <ShipmentStatusBadge status={shipment.status} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-stone-600">
            {shipment.awb_code && (
              <div>
                <span className="font-medium">AWB:</span> {shipment.awb_code}
              </div>
            )}
            <div>
              <span className="font-medium">Courier:</span> {shipment.courier_name || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Weight:</span> {shipment.weight || 'N/A'} kg
            </div>
            <div>
              <span className="font-medium">Created:</span> {formatDate(shipment.created_at)}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">        
        {shipment.awb_code && (
          <Button
            onClick={handleDownloadLabel}
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-1" />
            Label
          </Button>
        )}
        
        {shipment.awb_code && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              window.open(`/track/shipment/${shipment.shiprocket_shipment_id}`, '_blank');
            }}
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

export default ShipmentList;