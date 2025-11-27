import { API } from "./base";

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
  validate: async (payload: CouponValidationRequest): Promise<CouponValidationResponse> => {
    const response = await API.post<CouponValidationResponse>("/coupons/validate", payload);
    return response.data;
  },
};


