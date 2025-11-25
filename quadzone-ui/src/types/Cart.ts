import type { Product } from "./Product";

export interface CartResponse {
    id: number;
    customerId: number;
    updateAt: string; // LocalDateTime -> string
    cart_item_list: CartItemResponse[];
}

export interface CartItemResponse {
    id: number;
    quantity: number;
    addedAt: string;
    productResponse: Product;
}
