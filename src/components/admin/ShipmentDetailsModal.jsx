import React from 'react';
import { useOrderTracking } from '../../hooks/useOrderTracking';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import ShipmentDetails from '../shipping/ShipmentDetails';
import TrackingTimeline from '../shipping/TrackingTimeline';
import ShipmentStatusBadge from '../shipping/ShipmentStatusBadge';
import { 
  Package, 
  X, 
  RefreshCw, 
  Download, 
  ExternalLink,
  Calendar,
  Truck,
  User,
  MapPin,
  Phone,
  Mail,
  Weight,
  Ruler
} from 'lucide-react';

const ShipmentDetailsModal = ({ shipment, onClose, onDownloadLabel }) => {
  const {
    trackingData,
    loading: trackingLoading,
    error: trackingError,
    refreshTracking,
  } = useOrderTracking(shipment?.shiprocket_shipment_id);

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(new Date(dateString));
  };

  const handleTrackExternal = (url) => {
    window.open(url, '_blank');
  };

  if (!shipment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200">
          <div className="flex items-center space-x-3">
            <Package className="h-6 w-6 text-emerald-600" />
            <div>
              <h2 className="text-xl font-semibold text-stone-900">
                Shipment Details
              </h2>
              <p className="text-stone-600">
                Order #{shipment.shiprocket_order_id || shipment.order_id}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ShipmentStatusBadge status={shipment.status} />
            <Button
              onClick={refreshTracking}
              variant="outline"
              size="sm"
              disabled={trackingLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${trackingLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              {/* Shipment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Shipment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-stone-600">Shipment ID:</span>
                      <p className="font-mono font-medium">{shipment.shiprocket_shipment_id || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-stone-600">Order ID:</span>
                      <p className="font-mono font-medium">{shipment.shiprocket_order_id || shipment.order_id}</p>
                    </div>
                    <div>
                      <span className="text-stone-600">AWB Code:</span>
                      <p className="font-mono font-medium">{shipment.awb_code || 'Not Generated'}</p>
                    </div>
                    <div>
                      <span className="text-stone-600">Courier:</span>
                      <p className="font-medium">{shipment.courier_name || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-stone-600">Type:</span>
                      <Badge variant="outline">{shipment.shipment_type || 'forward'}</Badge>
                    </div>
                    <div>
                      <span className="text-stone-600">Created:</span>
                      <p className="text-xs">{formatDate(shipment.created_at)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Package Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Weight className="h-4 w-4 mr-2" />
                    Package Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-stone-600">Weight:</span>
                      <p className="font-medium">{shipment.weight || 'N/A'} kg</p>
                    </div>
                    <div>
                      <span className="text-stone-600">Dimensions:</span>
                      <p className="text-xs">
                        {shipment.length && shipment.breadth && shipment.height
                          ? `${shipment.length} × ${shipment.breadth} × ${shipment.height} cm`
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {shipment.awb_code && (
                    <Button
                      onClick={() => onDownloadLabel && onDownloadLabel(shipment)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Label
                    </Button>
                  )}
                  
                  {shipment.shiprocket_shipment_id && (
                    <Button
                      onClick={() => window.open(`/track/shipment/${shipment.shiprocket_shipment_id}`, '_blank')}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Public Tracking
                    </Button>
                  )}

                  {trackingData?.tracking_data?.track_url && (
                    <Button
                      onClick={() => handleTrackExternal(trackingData.tracking_data.track_url)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Track on Courier Site
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Middle Column - Shipment Details */}
            <div className="lg:col-span-1">
              <ShipmentDetails
                shipmentData={shipment}
                trackingData={trackingData}
                onDownloadLabel={() => onDownloadLabel && onDownloadLabel(shipment)}
                onTrackExternal={handleTrackExternal}
              />
            </div>

            {/* Right Column - Tracking Timeline */}
            <div className="lg:col-span-1">
              <TrackingTimeline
                trackingHistory={trackingData?.tracking_data?.shipment_track || []}
                currentStatus={trackingData?.tracking_data?.current_status || trackingData?.tracking_data?.shipment_status || shipment.status}
              />
            </div>
          </div>

          {/* Error Display */}
          {trackingError && (
            <div className="mt-6">
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <p className="text-red-700 text-sm">
                    <strong>Tracking Error:</strong> {trackingError}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetailsModal;