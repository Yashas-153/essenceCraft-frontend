import React from 'react';
import { Badge } from '../ui/badge';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  RotateCcw,
  MapPin
} from 'lucide-react';

const ShipmentStatusBadge = ({ status, className = "" }) => {
  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase();
    
    switch (statusLower) {
      case 'pending':
        return {
          icon: Clock,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          label: 'Pending'
        };
      case 'awb_generated':
        return {
          icon: Package,
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          label: 'AWB Generated'
        };
      case 'pickup_scheduled':
        return {
          icon: Clock,
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          label: 'Pickup Scheduled'
        };
      case 'pickup_completed':
      case 'picked_up':
        return {
          icon: Package,
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          label: 'Picked Up'
        };
      case 'in_transit':
      case 'in transit':
        return {
          icon: Truck,
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          label: 'In Transit'
        };
      case 'out_for_delivery':
      case 'out for delivery':
        return {
          icon: MapPin,
          color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          label: 'Out for Delivery'
        };
      case 'delivered':
        return {
          icon: CheckCircle,
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          label: 'Delivered'
        };
      case 'rto_initiated':
        return {
          icon: RotateCcw,
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          label: 'Return Initiated'
        };
      case 'rto_delivered':
        return {
          icon: RotateCcw,
          color: 'bg-red-100 text-red-800 border-red-200',
          label: 'Returned'
        };
      case 'cancelled':
        return {
          icon: XCircle,
          color: 'bg-red-100 text-red-800 border-red-200',
          label: 'Cancelled'
        };
      case 'lost':
        return {
          icon: AlertCircle,
          color: 'bg-red-100 text-red-800 border-red-200',
          label: 'Lost'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'bg-stone-100 text-stone-800 border-stone-200',
          label: status || 'Unknown'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge className={`${config.color} ${className} flex items-center gap-1 px-2 py-1`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

export default ShipmentStatusBadge;