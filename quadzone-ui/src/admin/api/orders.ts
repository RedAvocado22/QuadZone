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
};

