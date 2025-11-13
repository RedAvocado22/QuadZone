import apiClient from './axios';
import { USE_MOCK_DATA } from './config';
import { mockOrders, filterOrders, delay } from '../_mock/mock-data';

// ----------------------------------------------------------------------

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  items: number;
}

export interface OrdersResponse {
  data: Order[];
  total: number;
  page: number;
  pageSize: number;
}

// ----------------------------------------------------------------------

interface GetAllOrdersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const ordersApi = {
  getAll: async (params: GetAllOrdersParams = {}): Promise<OrdersResponse> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const { sortBy = 'createdAt', sortOrder = 'desc' } = params;
      return filterOrders(mockOrders, { ...params, sortBy, sortOrder });
    }
    
    const { page = 0, pageSize = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = params;
    
    const response = await apiClient.get('/orders', {
      params: {
        page,
        pageSize,
        search,
        sortBy,
        sortOrder,
      },
    });

    return {
      data: response.data.data || [],
      total: response.data.total || 0,
      page: response.data.page || page,
      pageSize: response.data.pageSize || pageSize,
    };
  },

  getById: async (id: string): Promise<Order> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      const order = mockOrders.find((ord) => ord.id === id);
      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    }
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  create: async (order: Omit<Order, 'id'>): Promise<Order> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const newOrder: Order = {
        id: `order-${Date.now()}`,
        ...order,
        createdAt: order.createdAt || new Date().toISOString(),
      };
      mockOrders.unshift(newOrder);
      return newOrder;
    }
    const response = await apiClient.post('/orders', order);
    return response.data;
  },

  update: async (id: string, order: Partial<Order>): Promise<Order> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const index = mockOrders.findIndex((ord) => ord.id === id);
      if (index === -1) {
        throw new Error('Order not found');
      }
      mockOrders[index] = { ...mockOrders[index], ...order } as Order;
      return mockOrders[index];
    }
    const response = await apiClient.put(`/orders/${id}`, order);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      const index = mockOrders.findIndex((ord) => ord.id === id);
      if (index === -1) {
        throw new Error('Order not found');
      }
      mockOrders.splice(index, 1);
      return;
    }
    await apiClient.delete(`/orders/${id}`);
  },
};

