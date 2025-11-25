import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { getCart, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart, updateCartItemQuantity } from "../api/cart";
import { useUser } from "../hooks/useUser";
import { toast } from "react-toastify";
import type { CartItemResponse, Product } from "../api/types";


interface CartContextType {
    items: CartItemResponse[];
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    totalPrice: number;
    totalItems: number;
    loading: boolean;
    error: string | null;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<CartItemResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const { user } = useUser();

    // Fetch cart from backend
    const refreshCart = async () => {
        if (!user) return;
        
        setLoading(true);
        setError(null);
        try {
            const cartResponse = await getCart(user.id);
            // Transform CartResponse to CartItem[]
            const cartItems = cartResponse.cart_item_list.map((item) => ({
                ...item.productResponse,
                quantity: item.quantity
            }));
            setItems(cartItems);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Failed to load cart";
            setError(errorMsg);
            console.error("Error loading cart:", err);
        } finally {
            setLoading(false);
        }
    };

    // Load cart on mount and when user changes
    useEffect(() => {
        refreshCart();
    }, [user?.id]);

    const addToCart = async (product: Product) => {
        if (!user) {
            toast.error("Please log in to add items to cart");
            return;
        }
        try {
            await apiAddToCart(user.id, product.id);
            await refreshCart();
            toast.success(`${product.name} added to cart!`, {
                position: "top-right",
                autoClose: 1500
            });
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Failed to add to cart";
            toast.error(errorMsg, {
                position: "top-right",
                autoClose: 1500
            });
            console.error("Error adding to cart:", err);
        }
    };

    const removeFromCart = async (productId: number) => {
        if (!user) return;
        
        const removedItem = items.find((item) => item.id === productId);
        try {
            await apiRemoveFromCart(user.id, productId);
            await refreshCart();
            if (removedItem) {
                toast.error(`${removedItem.name} removed from cart`, {
                    position: "top-right",
                    autoClose: 1500
                });
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Failed to remove from cart";
            toast.error(errorMsg, {
                position: "top-right",
                autoClose: 1500
            });
            console.error("Error removing from cart:", err);
        }
    };

    const updateQuantity = async (productId: number, quantity: number) => {
        if (!user) return;
        
        if (quantity <= 0) {
            await removeFromCart(productId);
            return;
        }

        try {
            await updateCartItemQuantity(user.id, productId, quantity);
            await refreshCart();
            toast.info(`Quantity updated`, {
                position: "top-right",
                autoClose: 1500
            });
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Failed to update quantity";
            toast.error(errorMsg, {
                position: "top-right",
                autoClose: 1500
            });
            console.error("Error updating quantity:", err);
        }
    };

    const clearCart = async () => {
        try {
            setItems([]);
            toast.warn("Cart cleared", {
                position: "top-right",
                autoClose: 1500
            });
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Failed to clear cart";
            toast.error(errorMsg, {
                position: "top-right",
                autoClose: 1500
            });
        }
    };

    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    const contextValue: CartContextType = useMemo(
        () => ({
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalPrice,
            totalItems,
            loading,
            error,
            refreshCart
        }),
        [items, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems, loading, error, refreshCart]
    );

    return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
};
