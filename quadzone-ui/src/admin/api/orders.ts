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
    
    const response = await apiClient.get('/admin/orders', {
      params: {
        page,
        size: pageSize,
        search,
        sortBy,
        sortOrder,
      },
    });

    const payload = response.data as {
      data: Array<{
        id: number;
        orderNumber: string;
        customerName: string;
        totalAmount: number;
        status: string;
        orderDate: string;
        itemsCount: number;
      }>;
      total: number;
      page: number;
      pageSize: number;
    };

    const normalizeStatus = (status: string): Order['status'] => {
      switch (status?.toUpperCase()) {
        case 'PENDING':
          return 'pending';
        case 'PROCESSING':
        case 'IN_PROGRESS':
          return 'processing';
        case 'COMPLETED':
        case 'DELIVERED':
          return 'completed';
        case 'CANCELLED':
        case 'CANCELED':
          return 'cancelled';
        default:
          return 'pending';
      }
    };

    const mappedData: Order[] = (payload.data ?? []).map((order) => {
      const status = normalizeStatus(order.status);
      const paymentStatus: Order['paymentStatus'] = status === 'completed' ? 'paid' : 'pending';

      return {
        id: String(order.id),
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        total: Number(order.totalAmount ?? 0),
        status,
        paymentStatus,
        createdAt: order.orderDate ?? '',
        items: order.itemsCount ?? 0,
      };
    });

    return {
      data: mappedData,
      total: payload.total ?? 0,
      page: payload.page ?? page,
      pageSize: payload.pageSize ?? pageSize,
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
    const response = await apiClient.get(`/admin/orders/${id}`);
    const data = response.data as {
      id: number;
      orderNumber: string;
      customerName: string;
      totalAmount: number;
      status: string;
      orderDate: string;
      itemsCount: number;
    };

    const status = data.status?.toUpperCase?.() ?? 'PENDING';
    const normalizedStatus = ['PENDING', 'PROCESSING', 'COMPLETED', 'DELIVERED', 'CANCELLED', 'CANCELED'].includes(status)
      ? status
      : 'PENDING';
    const statusMap: Record<string, Order['status']> = {
      PENDING: 'pending',
      PROCESSING: 'processing',
      IN_PROGRESS: 'processing',
      COMPLETED: 'completed',
      DELIVERED: 'completed',
      CANCELLED: 'cancelled',
      CANCELED: 'cancelled',
    };

    return {
      id: String(data.id),
      orderNumber: data.orderNumber,
      customerName: data.customerName,
      total: Number(data.totalAmount ?? 0),
      status: statusMap[normalizedStatus] ?? 'pending',
      paymentStatus: (statusMap[normalizedStatus] ?? 'pending') === 'completed' ? 'paid' : 'pending',
      createdAt: data.orderDate ?? '',
      items: data.itemsCount ?? 0,
    };
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
    throw new Error('Order creation API is not implemented yet');
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
    throw new Error('Order update API is not implemented yet');
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
    throw new Error('Order delete API is not implemented yet');
  },
};
