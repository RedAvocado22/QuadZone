// hooks/useWishlistOperations.ts
// Custom hook for wishlist operations with enhanced functionality

import { useState } from 'react';
import { useWishlist } from '../contexts/WishListContext';

/**
 * Custom hook for wishlist operations with loading and error states
 * Provides additional helper functions and state management
 */
export const useWishlistOperations = () => {
  const {
    addToWishlist: addToWishlistApi,
    removeFromWishlist: removeFromWishlistApi,
    isInWishlist,
    wishlistItems,
    loading: globalLoading,
    error: globalError,
  } = useWishlist();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addToWishlist = async (productId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await addToWishlistApi(productId);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to add to wishlist');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await removeFromWishlistApi(productId);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to remove from wishlist');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle wishlist status - add if not in wishlist, remove if in wishlist
   */
  const toggleWishlist = async (productId: number): Promise<boolean> => {
    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  return {
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    wishlistItems,
    loading: loading || globalLoading,
    error: error || globalError,
    wishlistCount: wishlistItems.length,
  };
};