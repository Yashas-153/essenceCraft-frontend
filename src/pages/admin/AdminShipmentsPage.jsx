import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ShipmentList from '../../components/admin/ShipmentList';
import ShipmentDetailsModal from '../../components/admin/ShipmentDetailsModal';
import { useShiprocket } from '../../hooks/useShiprocket';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Download,
  RefreshCw
} from 'lucide-react';

const AdminShipmentsPage = () => {
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { generateLabel, generateManifest, loading, error } = useShiprocket();

  const handleViewShipmentDetails = (shipment) => {
    setSelectedShipment(shipment);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedShipment(null);
  };

  const handleDownloadLabel = async (shipment) => {
    if (shipment?.shiprocket_shipment_id) {
      try {
        await generateLabel({ shipment_ids: [shipment.shiprocket_shipment_id] });
      } catch (error) {
        console.error('Failed to download label:', error);
      }
    }
  };

  // Mock stats - replace with real data from your API
  const shipmentStats = {
    total: 156,
    pending: 23,
    in_transit: 45,
    delivered: 78,
    issues: 10
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Shipment Management</h1>
            <p className="text-stone-600">Monitor and manage all shipments</p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => generateManifest({ shipment_ids: [] })} // Add logic for selected shipments
              variant="outline"
              disabled={loading}
            >
              <Download className="h-4 w-4 mr-2" />
              Generate Manifest
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600">Total Shipments</p>
                  <p className="text-2xl font-bold text-stone-900">{shipmentStats.total}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">{shipmentStats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600">In Transit</p>
                  <p className="text-2xl font-bold text-blue-600">{shipmentStats.in_transit}</p>
                </div>
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600">Delivered</p>
                  <p className="text-2xl font-bold text-emerald-600">{shipmentStats.delivered}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600">Issues</p>
                  <p className="text-2xl font-bold text-red-600">{shipmentStats.issues}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shipments List */}
        <ShipmentList onViewDetails={handleViewShipmentDetails} />

        {/* Shipment Details Modal */}
        {showDetailsModal && (
          <ShipmentDetailsModal
            shipment={selectedShipment}
            onClose={handleCloseDetailsModal}
            onDownloadLabel={handleDownloadLabel}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminShipmentsPage;