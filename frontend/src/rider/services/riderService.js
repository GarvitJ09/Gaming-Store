import api from '../../services/api';

export const riderService = {
  getMyAssignedOrders: async () => {
    try {
      const response = await api.get('/rider/orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching assigned orders:', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.patch(`/rider/orders/${orderId}`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },
};
