import API from "./base";

export interface VnPayCreatePayload {
    orderId: string;
    amount: number;
    orderInfo: string;
    returnUrl: string;
}

export interface VnPayReturnData {
    vnp_TxnRef: string;
    vnp_Amount: string;
    vnp_ResponseCode: string;
    vnp_TransactionStatus?: string;
    vnp_SecureHash: string;
    vnp_OrderInfo?: string;
    vnp_TransactionNo?: string;
    vnp_BankCode?: string;
    vnp_PayDate?: string;
    message?: string;
}

export const paymentsApi = {
    async createVnPayPayment(payload: VnPayCreatePayload): Promise<string> {
        const response = await API.post<string>("/payments/create", payload);
        return response.data;
    },

    async confirmVnPay(queryString: string): Promise<VnPayReturnData> {
        const response = await API.get<VnPayReturnData>(`/payments/vnpay-return${queryString}`);
        return response.data;
    }
};

