import API from "./base";

export interface ShippingCalculationRequest {
  address: string;      // Street Address
  apartment?: string;   // Village
  block?: string;       // Block
  district?: string;    // Town
  city?: string;        // City
  country?: "Vietnam";
}

export interface ShippingCalculationResponse {
  shippingCost: number;
  message: string;
}

export const shippingApi = {
  calculate: async (
    request: ShippingCalculationRequest
  ): Promise<ShippingCalculationResponse> => {
    const response = await API.post<ShippingCalculationResponse>(
      "/shipping/calculate",
      request
    );
    return response.data;
  },
};

