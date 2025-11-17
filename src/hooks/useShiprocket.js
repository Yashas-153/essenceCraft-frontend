import { useState, useCallback } from 'react';
import { shiprocketAPI } from '../services/api';

export const useShiprocket = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRequest = useCallback(async (requestFn) => {
    setLoading(true);
    setError(null);
    try {
      const response = await requestFn();
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Order Management
  const createOrder = useCallback(async (orderData) => {
    return handleRequest(() => shiprocketAPI.createOrder(orderData));
  }, [handleRequest]);

  const getOrder = useCallback(async (orderId) => {
    return handleRequest(() => shiprocketAPI.getOrder(orderId));
  }, [handleRequest]);

  const cancelOrders = useCallback(async (orderIds) => {
    return handleRequest(() => shiprocketAPI.cancelOrders({ order_ids: orderIds }));
  }, [handleRequest]);

  // Courier Management
  const checkServiceability = useCallback(async (serviceabilityData) => {
    return handleRequest(() => shiprocketAPI.checkServiceability(serviceabilityData));
  }, [handleRequest]);

  const getCouriers = useCallback(async () => {
    return handleRequest(() => shiprocketAPI.getCouriers());
  }, [handleRequest]);

  // Shipment Management
  const createShipment = useCallback(async (shipmentData) => {
    return handleRequest(() => shiprocketAPI.createShipment(shipmentData));
  }, [handleRequest]);

  const schedulePickup = useCallback(async (shipmentId) => {
    return handleRequest(() => shiprocketAPI.schedulePickup(shipmentId));
  }, [handleRequest]);

  const generateManifest = useCallback(async (shipmentIds) => {
    return handleRequest(() => shiprocketAPI.generateManifest({ shipment_ids: shipmentIds }));
  }, [handleRequest]);

  const generateLabel = useCallback(async (shipmentIds) => {
    return handleRequest(() => shiprocketAPI.generateLabel({ shipment_ids: shipmentIds }));
  }, [handleRequest]);

  const generateInvoice = useCallback(async (orderIds) => {
    return handleRequest(() => shiprocketAPI.generateInvoice({ order_ids: orderIds }));
  }, [handleRequest]);

  return {
    loading,
    error,
    createOrder,
    getOrder,
    cancelOrders,
    checkServiceability,
    getCouriers,
    createShipment,
    schedulePickup,
    generateManifest,
    generateLabel,
    generateInvoice,
  };
};