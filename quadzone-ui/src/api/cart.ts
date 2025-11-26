import API from "./base";
import type { CartResponse } from "./types";
import { useUser } from "../hooks/useUser";

export interface CartMergeItem {
    productId: number;
    quantity: number;
}

// Base functions that accept userId
export const getCart = (userId: number): Promise<CartResponse> =>
    API.get(`/cart/${userId}`).then(res => res.data);

export const addToCart = (userId: number, productId: number): Promise<CartResponse> =>
    API.post(`/cart/${userId}/add/${productId}`).then(res => res.data);

export const removeFromCart = (userId: number, productId: number): Promise<CartResponse> =>
    API.delete(`/cart/${userId}/remove/${productId}`).then(res => res.data);

export const updateCartItemQuantity = (userId: number, productId: number, quantity: number): Promise<CartResponse> =>
    API.patch(`/cart/${userId}/update/${productId}?quantity=${quantity}`).then(res => res.data);

export const mergeCart = (items: CartMergeItem[]): Promise<CartResponse> =>
    API.post("/cart/merge", items).then(res => res.data);

// Hook for use in components that need automatic userId from context
export const useCartApi = () => {
    const { user } = useUser();

    return {
        getCart: () => {
            if (!user) throw new Error("User not logged in");
            return getCart(user.id);
        },
        addToCart: (productId: number) => {
            if (!user) throw new Error("User not logged in");
            return addToCart(user.id, productId);
        },
        removeFromCart: (productId: number) => {
            if (!user) throw new Error("User not logged in");
            return removeFromCart(user.id, productId);
        },
        updateCartItemQuantity: (productId: number, quantity: number) => {
            if (!user) throw new Error("User not logged in");
            return updateCartItemQuantity(user.id, productId, quantity);
        },
        mergeCart: (items: CartMergeItem[]) => {
            if (!user) throw new Error("User not logged in");
            return mergeCart(items);
        }
    };
};
