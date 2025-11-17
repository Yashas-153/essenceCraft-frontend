import { useState, useEffect, useCallback } from 'react';
import { shiprocketAPI } from '../services/api';

export const useOrderTracking = (shipmentId, awbCode = null) => {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchTrackingData = useCallback(async () => {
    if (!shipmentId && !awbCode) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let response;
      if (shipmentId) {
        response = await shiprocketAPI.trackByShipmentId(shipmentId);
      } else if (awbCode) {
        response = await shiprocketAPI.trackByAwbCode(awbCode);
      }
      
      setTrackingData(response.data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tracking data');
    } finally {
      setLoading(false);
    }
  }, [shipmentId, awbCode]);

  // Auto refresh tracking data every 5 minutes
  useEffect(() => {
    if (shipmentId || awbCode) {
      fetchTrackingData();
      
      const interval = setInterval(fetchTrackingData, 5 * 60 * 1000); // 5 minutes
      
      return () => clearInterval(interval);
    }
  }, [fetchTrackingData, shipmentId, awbCode]);

  const refreshTracking = useCallback(() => {
    fetchTrackingData();
  }, [fetchTrackingData]);

  return {
    trackingData,
    loading,
    error,
    lastUpdated,
    refreshTracking,
  };
};

export const useShipmentManagement = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchShipments = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await shiprocketAPI.getUserShipments({ page, limit });
      setShipments(response.data.shipments || []);
      setPagination({
        page: response.data.page || 1,
        limit: response.data.limit || 10,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 0,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch shipments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  const nextPage = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      fetchShipments(pagination.page + 1, pagination.limit);
    }
  }, [fetchShipments, pagination.page, pagination.totalPages, pagination.limit]);

  const prevPage = useCallback(() => {
    if (pagination.page > 1) {
      fetchShipments(pagination.page - 1, pagination.limit);
    }
  }, [fetchShipments, pagination.page, pagination.limit]);

  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchShipments(page, pagination.limit);
    }
  }, [fetchShipments, pagination.totalPages, pagination.limit]);

  return {
    shipments,
    loading,
    error,
    pagination,
    nextPage,
    prevPage,
    goToPage,
    refreshShipments: fetchShipments,
  };
};