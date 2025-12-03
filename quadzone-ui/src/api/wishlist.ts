// api/wishlist.ts
// API functions for wishlist operations

import API from './base';
import type { WishList } from './types';

/**
 * Get user's wishlist
 * GET /api/v1/wishlist
 */
export const getWishlist = async (): Promise<WishList> => {
  try {
    const response = await API.get('/wishlist');
    return response.data;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

/**
 * Add product to wishlist
 * POST /api/v1/wishlist/{productId}
 */
export const addToWishlist = async (productId: number): Promise<WishList> => {
  try {
    const response = await API.post(`/wishlist/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

/**
 * Remove product from wishlist
 * DELETE /api/v1/wishlist/{productId}
 */
export const removeFromWishlist = async (productId: number): Promise<WishList> => {
  try {
    const response = await API.delete(`/wishlist/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

/**
 * Clear entire wishlist
 * DELETE /api/v1/wishlist/clear
 */
export const clearWishlist = async (): Promise<void> => {
  try {
    await API.delete('/wishlist/clear');
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    throw error;
  }
};

/**
 * Check if product is in wishlist
 * Helper function that uses getWishlist
 */
export const isProductInWishlist = async (productId: number): Promise<boolean> => {
  try {
    const wishlist = await getWishlist();
    return wishlist.products.some(product => product.id === productId);
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
};