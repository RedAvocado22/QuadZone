import API from "../../api/base";

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

interface OrderDto {
  id: number;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  orderDate: string;
  itemsCount: number;
}

function normalizeStatus(status: string): Order['status'] {
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
}

function mapOrderToFrontend(dto: OrderDto): Order {
  const status = normalizeStatus(dto.status);
  const paymentStatus: Order['paymentStatus'] = status === 'completed' ? 'paid' : 'pending';

  return {
    id: String(dto.id),
    orderNumber: dto.orderNumber,
    customerName: dto.customerName,
    total: Number(dto.totalAmount ?? 0),
    status,
    paymentStatus,
    createdAt: dto.orderDate ?? '',
    items: dto.itemsCount ?? 0,
  };
}

export const ordersApi = {
  getAll: async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<OrdersResponse> => {
    const { page = 0, pageSize = 10, search = '' } = params;
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: pageSize.toString(),
      search,
    });
    
    const response = await API.get<{
      data: OrderDto[];
      total: number;
      page: number;
      pageSize: number;
    }>(`/orders/admin?${queryParams.toString()}`);

    const payload = response.data;

    return {
      data: (payload.data ?? []).map(mapOrderToFrontend),
      total: payload.total ?? 0,
      page: payload.page ?? page,
      pageSize: payload.pageSize ?? pageSize,
    };
  },

  getById: async (id: string): Promise<Order> => {
    const response = await API.get<OrderDto>(`/orders/admin/${id}`);
    return mapOrderToFrontend(response.data);
  },

  create: async (order: Omit<Order, 'id'>): Promise<Order> => {
    // Note: Order creation requires userId which should come from the form
    const requestBody = {
      userId: 1, // This should come from the form/context
      subtotal: order.total * 0.9,
      taxAmount: order.total * 0.1,
      shippingCost: 0,
      discountAmount: 0,
      totalAmount: order.total,
      orderStatus: order.status.toUpperCase(),
      notes: '',
      address: '',
    };

    const response = await API.post<OrderDto>('/orders/admin', requestBody);
    return mapOrderToFrontend(response.data);
  },

  update: async (id: string, order: Partial<Order>): Promise<Order> => {
    const requestBody: any = {};
    if (order.total !== undefined) requestBody.totalAmount = order.total;
    if (order.status !== undefined) requestBody.orderStatus = order.status.toUpperCase();

    const response = await API.put<OrderDto>(`/orders/${id}`, requestBody);
    return mapOrderToFrontend(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await API.delete(`/orders/${id}`);
  },
};
