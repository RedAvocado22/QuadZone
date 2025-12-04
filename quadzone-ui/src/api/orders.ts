import API from "./base";
import type { OrderResponse, SimplePagedResponse } from "./types";

// Re-export for convenience
export type { OrderResponse as Order } from "./types";
export type { SimplePagedResponse as OrdersResponse } from "./types";

export const ordersApi = {
  getAll: async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<SimplePagedResponse<OrderResponse>> => {
    const { page = 0, pageSize = 10, search = '' } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: pageSize.toString(),
      search,
    });

    const response = await API.get<SimplePagedResponse<OrderResponse>>(`/orders/admin?${queryParams.toString()}`);
    return response.data;
  },

  getById: async (id: string | number): Promise<OrderResponse> => {
    const response = await API.get<OrderResponse>(`/orders/admin/${id}`);
    return response.data;
  },

  create: async (order: { userId: number; totalAmount: number; status?: OrderResponse['status']; subtotal?: number; taxAmount?: number; shippingCost?: number; discountAmount?: number; notes?: string; address?: string }): Promise<OrderResponse> => {
    const requestBody = {
      userId: order.userId,
      subtotal: order.subtotal ?? order.totalAmount * 0.9,
      taxAmount: order.taxAmount ?? order.totalAmount * 0.1,
      shippingCost: order.shippingCost ?? 0,
      discountAmount: order.discountAmount ?? 0,
      totalAmount: order.totalAmount,
      orderStatus: order.status ?? 'PENDING',
      notes: order.notes ?? '',
      address: order.address ?? '',
    };

    const response = await API.post<OrderResponse>('/orders/admin', requestBody);
    return response.data;
  },

  update: async (id: string | number, order: { totalAmount?: number; status?: OrderResponse['status'] }): Promise<OrderResponse> => {
    const requestBody: any = {};
    if (order.totalAmount !== undefined) requestBody.totalAmount = order.totalAmount;
    if (order.status !== undefined) requestBody.orderStatus = order.status;

    const response = await API.put<OrderResponse>(`/orders/${id}`, requestBody);
    return response.data;
  },

  delete: async (id: string | number): Promise<void> => {
    await API.delete(`/orders/${id}`);
  },

  checkout: async (checkoutData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city?: string;
    state?: string;
    apartment?: string;
    items: Array<{ productId: number; quantity: number }>;
    subtotal: number;
    taxAmount?: number;
    shippingCost: number;
    discountAmount?: number;
    totalAmount: number;
    paymentMethod: string;
    notes?: string;
  }): Promise<OrderResponse> => {
    const response = await API.post<OrderResponse>('/orders/checkout', checkoutData);
    return response.data;
  },

  // Assign order to shipper
  assignToShipper: async (orderId: string | number, data: {
    shipperId: number;
    trackingNumber?: string;
    carrier?: string;
    estimatedDeliveryDate?: string;
    deliveryNotes?: string;
  }): Promise<OrderResponse> => {
    const response = await API.post<OrderResponse>(`/orders/admin/${orderId}/assign-shipper`, data);
    return response.data;
  },

  // Get orders for current user
  getMyOrders: async (params: {
    page?: number;
    pageSize?: number;
  } = {}): Promise<SimplePagedResponse<OrderResponse>> => {
    const { page = 0, pageSize = 10 } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: pageSize.toString(),
    });

    const response = await API.get<SimplePagedResponse<OrderResponse>>(`/orders/my-orders?${queryParams.toString()}`);
    return response.data;
  },
};
