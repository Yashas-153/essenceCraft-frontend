import React from 'react';
import { Card, CardContent } from '../ui/card';
import ShipmentStatusBadge from './ShipmentStatusBadge';
import { CheckCircle, Circle, Clock } from 'lucide-react';

const TrackingTimeline = ({ trackingHistory = [], currentStatus }) => {
  // Define the standard shipping flow steps
  const standardSteps = [
    { key: 'pending', label: 'Order Created', description: 'Order placed and awaiting processing' },
    { key: 'awb_generated', label: 'AWB Generated', description: 'Shipping label generated' },
    { key: 'pickup_scheduled', label: 'Pickup Scheduled', description: 'Courier pickup arranged' },
    { key: 'pickup_completed', label: 'Picked Up', description: 'Package collected by courier' },
    { key: 'in_transit', label: 'In Transit', description: 'Package is on the way' },
    { key: 'out_for_delivery', label: 'Out for Delivery', description: 'Package is out for final delivery' },
    { key: 'delivered', label: 'Delivered', description: 'Package successfully delivered' }
  ];

  // Get the current step index
  const getCurrentStepIndex = () => {
    const statusLower = currentStatus?.toLowerCase()?.replace(/\s+/g, '_');
    return standardSteps.findIndex(step => step.key === statusLower);
  };

  const currentStepIndex = getCurrentStepIndex();

  // Process tracking history to show actual events
  const processedHistory = trackingHistory
    ?.map(event => ({
      ...event,
      date: new Date(event.date || event.updated_at || event.timestamp),
      activity: event.activity || event.status || event.message,
      location: event.location || event.scan_details?.location || ''
    }))
    ?.sort((a, b) => b.date - a.date) || [];

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const getStepStatus = (index) => {
    if (index < currentStepIndex) return 'completed';
    if (index === currentStepIndex) return 'current';
    return 'pending';
  };

  const renderStepIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case 'current':
        return <Clock className="h-5 w-5 text-blue-600 animate-pulse" />;
      default:
        return <Circle className="h-5 w-5 text-stone-300" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Standard Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Shipping Progress</h3>
          <div className="space-y-4">
            {standardSteps.map((step, index) => {
              const status = getStepStatus(index);
              const isCompleted = status === 'completed';
              const isCurrent = status === 'current';
              
              return (
                <div key={step.key} className="flex items-start space-x-3">
                  <div className="flex flex-col items-center">
                    {renderStepIcon(status)}
                    {index < standardSteps.length - 1 && (
                      <div className={`w-px h-8 mt-2 ${
                        isCompleted ? 'bg-emerald-600' : 'bg-stone-200'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className={`font-medium ${
                        isCurrent ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-stone-500'
                      }`}>
                        {step.label}
                      </h4>
                      {isCurrent && (
                        <ShipmentStatusBadge status={currentStatus} />
                      )}
                    </div>
                    <p className="text-sm text-stone-600">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tracking History */}
      {processedHistory.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Tracking History</h3>
            <div className="space-y-4">
              {processedHistory.map((event, index) => (
                <div key={index} className="flex items-start space-x-3 pb-4 border-b border-stone-100 last:border-b-0">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-stone-900">
                        {event.activity}
                      </p>
                      <span className="text-xs text-stone-500">
                        {formatDate(event.date)}
                      </span>
                    </div>
                    {event.location && (
                      <p className="text-sm text-stone-600">
                        📍 {event.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrackingTimeline;