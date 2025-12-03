import * as React from "react";
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
    getCart,
    addToCart as apiAddToCart,
    removeFromCart as apiRemoveFromCart,
    updateCartItemQuantity,
    mergeCart as apiMergeCart,
    type CartMergeItem
} from "../api/cart";
import { useUser } from "../hooks/useUser";
import { toast } from "react-toastify";
import type { Product, CartItem } from "../api/types";

interface CartContextType {
    items: CartItem[];
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

const LOCAL_CART_STORAGE_KEY = "guest_cart_items";
const isBrowser = typeof window !== "undefined";

const readGuestCart = (): CartItem[] => {
    if (!isBrowser) {
        return [];
    }
    try {
        const stored = localStorage.getItem(LOCAL_CART_STORAGE_KEY);
        return stored ? (JSON.parse(stored) as CartItem[]) : [];
    } catch (error) {
        console.error("Failed to parse guest cart from storage:", error);
        return [];
    }
};

const writeGuestCart = (cartItems: CartItem[]) => {
    if (!isBrowser) {
        return;
    }
    localStorage.setItem(LOCAL_CART_STORAGE_KEY, JSON.stringify(cartItems));
};

const clearGuestCartStorage = () => {
    if (!isBrowser) {
        return;
    }
    localStorage.removeItem(LOCAL_CART_STORAGE_KEY);
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>(() => readGuestCart());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { user } = useUser();

    // Fetch cart from backend
    const refreshCart = async () => {
        if (!user) {
            const localItems = readGuestCart();
            setItems(localItems);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const cartResponse = await getCart(user.id);
            // Transform CartResponse to CartItem[]
            const cartItems = cartResponse.cart_item_list.map((item) => ({
                ...item.productResponse,
                quantity: item.quantity,
                addedAt: item.addedAt
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
        const initializeCart = async () => {
            if (!user) {
                setItems(readGuestCart());
                return;
            }

            const localItems = readGuestCart();
            if (localItems.length) {
                const payload: CartMergeItem[] = localItems.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity
                }));
                try {
                    await apiMergeCart(payload);
                    clearGuestCartStorage();
                } catch (err) {
                    const errorMsg = err instanceof Error ? err.message : "Unable to sync local cart";
                    toast.error(errorMsg, {
                        position: "top-right",
                        autoClose: 1500
                    });
                }
            }

            await refreshCart();
        };

        void initializeCart();
    }, [user?.id]);

    const addToCart = async (product: Product, quantity = 1) => {
        const qtyToAdd = quantity > 0 ? quantity : 1;

        if (!user) {
            setItems((prevItems) => {
                const existingItem = prevItems.find((item) => item.id === product.id);
                let updatedItems: CartItem[];

                if (existingItem) {
                    updatedItems = prevItems.map((item) =>
                        item.id === product.id ? { ...item, quantity: item.quantity + qtyToAdd } : item
                    );
                } else {
                    updatedItems = [
                        ...prevItems,
                        {
                            ...product,
                            quantity: qtyToAdd,
                            addedAt: new Date().toISOString()
                        }
                    ];
                }

                writeGuestCart(updatedItems);
                return updatedItems;
            });

            toast.success(`${product.name} added to cart!`, {
                position: "top-right",
                autoClose: 1500
            });
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
        const removedItem = items.find((item) => item.id === productId);

        if (!user) {
            setItems((prevItems) => {
                const updatedItems = prevItems.filter((item) => item.id !== productId);
                writeGuestCart(updatedItems);
                return updatedItems;
            });
            if (removedItem) {
                toast.error(`${removedItem.name} removed from cart`, {
                    position: "top-right",
                    autoClose: 1500
                });
            }
            return;
        }

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
        if (!user) {
            if (quantity <= 0) {
                setItems((prevItems) => {
                    const updatedItems = prevItems.filter((item) => item.id !== productId);
                    writeGuestCart(updatedItems);
                    return updatedItems;
                });
                return;
            }
            setItems((prevItems) => {
                const updatedItems = prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item));
                writeGuestCart(updatedItems);
                return updatedItems;
            });
            return;
        }

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
            if (!user) {
                clearGuestCartStorage();
            }
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
        [
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
        ]
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
