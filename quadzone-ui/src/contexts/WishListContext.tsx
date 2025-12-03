// contexts/WishlistContext.tsx
// Global state management for wishlist with backend integration

import React, { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import type { WishList, Product } from '../api/types';
import * as wishlistApi from '../api/wishlist';
import { useUser } from '../hooks/useUser';

interface WishlistContextType {
  wishlist: WishList | null;
  wishlistItems: Product[];
  loading: boolean;
  error: string | null;
  addToWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }: WishlistProviderProps) => {
  const { user } = useUser();
  const [wishlist, setWishlist] = useState<WishList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch wishlist only when user is authenticated
  const fetchWishlist = async () => {
    if (!user) {
      setWishlist(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await wishlistApi.getWishlist();
      setWishlist(data);
    } catch (err: any) {
      console.error('Error fetching wishlist:', err);
      setError(err.response?.data?.message || 'Failed to load wishlist');
      setWishlist(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user?.id]);

  const addToWishlist = async (productId: number) => {
    if (!user) {
      throw new Error('Must be logged in to add to wishlist');
    }
    try {
      setError(null);
      const updatedWishlist = await wishlistApi.addToWishlist(productId);
      setWishlist(updatedWishlist);
    } catch (err: any) {
      console.error('Error adding to wishlist:', err);
      setError(err.response?.data?.message || 'Failed to add to wishlist');
      throw err;
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (!user) {
      throw new Error('Must be logged in to remove from wishlist');
    }
    try {
      setError(null);
      const updatedWishlist = await wishlistApi.removeFromWishlist(productId);
      setWishlist(updatedWishlist);
    } catch (err: any) {
      console.error('Error removing from wishlist:', err);
      setError(err.response?.data?.message || 'Failed to remove from wishlist');
      throw err;
    }
  };

  const isInWishlist = (productId: number): boolean => {
    if (!wishlist) return false;
    return wishlist.products.some((product) => product.id === productId);
  };

  const clearWishlist = async () => {
    if (!user) {
      throw new Error('Must be logged in to clear wishlist');
    }
    try {
      setError(null);
      await wishlistApi.clearWishlist();
      setWishlist(null);
    } catch (err: any) {
      console.error('Error clearing wishlist:', err);
      setError(err.response?.data?.message || 'Failed to clear wishlist');
      throw err;
    }
  };

  const refreshWishlist = async () => {
    await fetchWishlist();
  };

  const wishlistItems = wishlist?.products || [];

  const contextValue = useMemo(
    () => ({
      wishlist,
      wishlistItems,
      loading,
      error,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
      refreshWishlist,
    }),
    [wishlist, wishlistItems, loading, error]
  );

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;