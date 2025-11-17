import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import ShipmentStatusBadge from './ShipmentStatusBadge';
import { 
  Package, 
  Truck, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Weight,
  ExternalLink,
  Download,
  Copy,
  CheckCircle
} from 'lucide-react';
import { useState } from 'react';

const ShipmentDetails = ({ 
  shipmentData, 
  trackingData, 
  onDownloadLabel, 
  onTrackExternal 
}) => {
  const [copiedField, setCopiedField] = useState(null);

  const copyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(new Date(dateString));
  };

  if (!shipmentData && !trackingData) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-stone-500">
          <Package className="h-12 w-12 mx-auto mb-4 text-stone-300" />
          <p>No shipment data available</p>
        </CardContent>
      </Card>
    );
  }

  const data = trackingData?.tracking_data || shipmentData || {};

  return (
    <div className="space-y-6">
      {/* Shipment Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Shipment Details
            </div>
            <ShipmentStatusBadge status={data.current_status || data.shipment_status || data.status} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Key Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.awb_code && (
              <div className="p-4 bg-stone-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-stone-600">AWB Code</span>
                    <p className="font-mono font-medium">{data.awb_code}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(data.awb_code, 'awb')}
                  >
                    {copiedField === 'awb' ? (
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {data.courier_name && (
              <div className="p-4 bg-stone-50 rounded-lg">
                <span className="text-sm text-stone-600">Courier Partner</span>
                <p className="font-medium flex items-center">
                  <Truck className="h-4 w-4 mr-1" />
                  {data.courier_name}
                </p>
              </div>
            )}

            {(shipmentData?.shiprocket_shipment_id || data.shipment_id) && (
              <div className="p-4 bg-stone-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-stone-600">Shipment ID</span>
                    <p className="font-mono font-medium">
                      {shipmentData?.shiprocket_shipment_id || data.shipment_id}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(
                      shipmentData?.shiprocket_shipment_id || data.shipment_id, 
                      'shipment'
                    )}
                  >
                    {copiedField === 'shipment' ? (
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {(shipmentData?.created_at || data.order_date) && (
              <div className="p-4 bg-stone-50 rounded-lg">
                <span className="text-sm text-stone-600">Order Date</span>
                <p className="font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(shipmentData?.created_at || data.order_date)}
                </p>
              </div>
            )}

            {shipmentData?.weight && (
              <div className="p-4 bg-stone-50 rounded-lg">
                <span className="text-sm text-stone-600">Weight</span>
                <p className="font-medium flex items-center">
                  <Weight className="h-4 w-4 mr-1" />
                  {shipmentData.weight} kg
                </p>
              </div>
            )}

            {(shipmentData?.length && shipmentData?.breadth && shipmentData?.height) && (
              <div className="p-4 bg-stone-50 rounded-lg">
                <span className="text-sm text-stone-600">Dimensions (L×W×H)</span>
                <p className="font-medium">
                  {shipmentData.length} × {shipmentData.breadth} × {shipmentData.height} cm
                </p>
              </div>
            )}
          </div>

          {/* Expected Delivery */}
          {data.expected_delivery && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-emerald-600 mr-2" />
                <div>
                  <span className="text-sm text-emerald-700">Expected Delivery</span>
                  <p className="font-medium text-emerald-900">
                    {formatDate(data.expected_delivery)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delivery Address */}
      {(data.delivery_address || shipmentData?.delivery_address) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Delivery Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">
                {data.delivery_customer_name || shipmentData?.customer_name}
              </p>
              <p className="text-stone-600">
                {data.delivery_address || shipmentData?.delivery_address}
              </p>
              <div className="flex items-center space-x-4 text-sm text-stone-600">
                {(data.delivery_phone || shipmentData?.customer_phone) && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {data.delivery_phone || shipmentData?.customer_phone}
                  </div>
                )}
                {(data.delivery_email || shipmentData?.customer_email) && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {data.delivery_email || shipmentData?.customer_email}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3">
            {data.track_url && (
              <Button
                variant="outline"
                onClick={() => onTrackExternal ? onTrackExternal(data.track_url) : window.open(data.track_url, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Track on Courier Website
              </Button>
            )}
            
            {onDownloadLabel && (
              <Button
                variant="outline"
                onClick={onDownloadLabel}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Label
              </Button>
            )}

            {data.awb_code && (
              <Button
                variant="outline"
                onClick={() => copyToClipboard(data.awb_code, 'awb-action')}
              >
                {copiedField === 'awb-action' ? (
                  <CheckCircle className="h-4 w-4 mr-2 text-emerald-600" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                Copy AWB Code
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipmentDetails;