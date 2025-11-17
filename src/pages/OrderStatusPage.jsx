import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrderTracking } from '@/hooks/useOrderTracking';
import { useShiprocket } from '@/hooks/useShiprocket';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ShipmentDetails from '@/components/shipping/ShipmentDetails';
import TrackingTimeline from '@/components/shipping/TrackingTimeline';

import { 
  Search, 
  RefreshCw, 
  Package, 
  AlertCircle, 
  ArrowLeft,
  ExternalLink,
  Download
} from 'lucide-react';

const OrderStatusPage = () => {
  const { shipmentId, awbCode } = useParams();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [searchType, setSearchType] = useState('shipment'); // 'shipment' or 'awb'

  // Use the tracking hook with URL parameters
  const {
    trackingData,
    loading: trackingLoading,
    error: trackingError,
    lastUpdated,
    refreshTracking,
  } = useOrderTracking(shipmentId, awbCode);

  const { generateLabel, loading: actionLoading } = useShiprocket();

  useEffect(() => {
    // Set search input based on URL parameters
    if (shipmentId) {
      setSearchInput(shipmentId);
      setSearchType('shipment');
    } else if (awbCode) {
      setSearchInput(awbCode);
      setSearchType('awb');
    }
  }, [shipmentId, awbCode]);

  const handleSearch = () => {
    if (!searchInput.trim()) return;
    
    if (searchType === 'shipment') {
      navigate(`/track/shipment/${searchInput.trim()}`);
    } else {
      navigate(`/track/awb/${searchInput.trim()}`);
    }
  };

  const handleDownloadLabel = async () => {
    if (!shipmentId && !trackingData?.tracking_data?.shipment_id) return;
    
    try {
      const id = shipmentId || trackingData.tracking_data.shipment_id;
      await generateLabel({ shipment_ids: [parseInt(id)] });
    } catch (error) {
      console.error('Failed to download label:', error);
    }
  };

  const handleTrackExternal = (url) => {
    window.open(url, '_blank');
  };

  const formatLastUpdated = (date) => {
    if (!date) return '';
    return `Last updated: ${new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date)}`;
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-stone-900">Track Your Order</h1>
              <p className="text-stone-600 mt-2">
                Track your shipment in real-time using shipment ID or AWB code
              </p>
            </div>
            
            {lastUpdated && (
              <div className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshTracking}
                  disabled={trackingLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${trackingLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <p className="text-xs text-stone-500 mt-1">
                  {formatLastUpdated(lastUpdated)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Search Shipment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Enter Shipment ID or AWB Code</Label>
                <Input
                  id="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="e.g., 12345678 or SR123456789"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="sm:w-32">
                <Label htmlFor="searchType">Type</Label>
                <select
                  id="searchType"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="shipment">Shipment ID</option>
                  <option value="awb">AWB Code</option>
                </select>
              </div>
              <div className="sm:w-24 flex items-end">
                <Button 
                  onClick={handleSearch}
                  disabled={!searchInput.trim()}
                  className="w-full"
                >
                  Track
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {trackingError && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {trackingError}. Please check your shipment ID or AWB code and try again.
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {trackingLoading && (
          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-stone-400 animate-pulse" />
              <p className="text-stone-600">Loading tracking information...</p>
            </CardContent>
          </Card>
        )}

        {/* Tracking Results */}
        {trackingData && !trackingLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Tracking Timeline */}
            <div className="lg:col-span-2 space-y-6">
              <TrackingTimeline
                trackingHistory={trackingData.tracking_data?.shipment_track || []}
                currentStatus={trackingData.tracking_data?.current_status || trackingData.tracking_data?.shipment_status}
              />
            </div>

            {/* Sidebar - Shipment Details */}
            <div className="lg:col-span-1">
              <ShipmentDetails
                trackingData={trackingData}
                onDownloadLabel={handleDownloadLabel}
                onTrackExternal={handleTrackExternal}
              />
            </div>
          </div>
        )}

        {/* No Results State */}
        {!trackingData && !trackingLoading && !trackingError && (shipmentId || awbCode) && (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-stone-400" />
              <h3 className="text-lg font-semibold text-stone-900 mb-2">
                No Tracking Information Found
              </h3>
              <p className="text-stone-600 mb-6">
                We couldn't find any tracking information for the provided ID. 
                This could mean:
              </p>
              <ul className="text-left text-stone-600 space-y-2 max-w-md mx-auto mb-6">
                <li>• The shipment hasn't been created yet</li>
                <li>• The ID is incorrect</li>
                <li>• Tracking information hasn't been updated by the courier</li>
              </ul>
              <Button onClick={() => setSearchInput('')} variant="outline">
                Try Another Search
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Welcome State */}
        {!shipmentId && !awbCode && !trackingData && (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-16 w-16 mx-auto mb-6 text-emerald-600" />
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                Track Your Shipment
              </h2>
              <p className="text-stone-600 mb-6 max-w-2xl mx-auto">
                Enter your shipment ID or AWB code above to get real-time updates on your package delivery. 
                You can find these details in your order confirmation email or SMS.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <h4 className="font-semibold text-emerald-900 mb-2">Shipment ID</h4>
                  <p className="text-sm text-emerald-700">
                    Usually a 6-8 digit number provided when your order is shipped
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">AWB Code</h4>
                  <p className="text-sm text-blue-700">
                    Air Waybill number from your courier partner (10-12 digits)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrderStatusPage;