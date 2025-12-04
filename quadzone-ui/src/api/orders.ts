import API from "./base";
import type { OrderResponse, OrderCreateRequest, OrderUpdateRequest, PagedResponse, OrderStatus } from "./types";

// Re-export for convenience
export type { OrderResponse as Order, OrderDetailsResponse as OrderDetails } from "./types";
export type { SimplePagedResponse as OrdersResponse } from "./types";

export const ordersApi = {
  getAll: async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
  } = {}): Promise<PagedResponse<OrderResponse>> => {
    const { page = 0, pageSize = 10, search = '', status } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: pageSize.toString(),
      search,
    });

    if (status) {
      queryParams.append('status', status);
    }

    const response = await API.get<PagedResponse<OrderResponse>>(`/orders/admin?${queryParams.toString()}`);
    return response.data;
  },

  getById: async (id: string | number): Promise<OrderResponse> => {
    const response = await API.get<OrderResponse>(`/orders/admin/${id}`);
    return response.data;
  },

  create: async (order: OrderCreateRequest): Promise<OrderResponse> => {
    const response = await API.post<OrderResponse>('/orders/admin', order);
    return response.data;
  },

  update: async (id: string | number, order: OrderUpdateRequest): Promise<OrderResponse> => {
    const response = await API.put<OrderResponse>(`/orders/${id}`, order);
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

  // Get order details with items for current user
  getMyOrderDetails: async (orderId: number): Promise<OrderDetailsResponse> => {
    const response = await API.get<OrderDetailsResponse>(`/orders/my-orders/${orderId}`);
    return response.data;
  },
};
