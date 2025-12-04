import { API } from "./base";
import type { PagedResponse } from "./types";

export type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT";

export interface Coupon {
  id: number;
  code: string;
  discountType: DiscountType;
  couponValue: number;
  maxDiscountAmount: number;
  minOrderAmount: number;
  maxUsage: number;
  usageCount: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface CouponCreateRequest {
  code: string;
  discountType: DiscountType;
  couponValue: number;
  maxDiscountAmount?: number;
  minOrderAmount?: number;
  maxUsage?: number;
  startDate?: string;
  endDate?: string;
  active?: boolean;
}

export interface CouponValidationRequest {
  code: string;
  subtotal: number;
}

export interface CouponValidationResponse {
  valid: boolean;
  message: string;
  code: string | null;
  discountAmount: number;
  finalTotal: number;
}

export const couponsApi = {
  getAll: async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
  } = {}): Promise<PagedResponse<Coupon>> => {
    const { page = 0, pageSize = 10, search = '' } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: pageSize.toString(),
      search,
    });

    const response = await API.get<PagedResponse<Coupon>>(`/coupons/admin?${queryParams.toString()}`);
    return response.data;
  },

  getById: async (id: string | number): Promise<Coupon> => {
    const response = await API.get<Coupon>(`/coupons/admin/${id}`);
    return response.data;
  },

  create: async (coupon: CouponCreateRequest): Promise<Coupon> => {
    const response = await API.post<Coupon>('/coupons', coupon);
    return response.data;
  },

  update: async (id: string | number, coupon: Partial<CouponCreateRequest>): Promise<Coupon> => {
    const response = await API.put<Coupon>(`/coupons/${id}`, coupon);
    return response.data;
  },

  delete: async (id: string | number): Promise<void> => {
    await API.delete(`/coupons/${id}`);
  },

  validate: async (payload: CouponValidationRequest): Promise<CouponValidationResponse> => {
    const response = await API.post<CouponValidationResponse>("/coupons/validate", payload);
    return response.data;
  },
};

