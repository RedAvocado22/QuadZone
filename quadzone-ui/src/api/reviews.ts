import API from "./base";
import type { Review, PagedResponse } from "./types";

export interface ReviewFilterParams {
    page?: number;
    size?: number;
}

/**
 * Fetch reviews for a specific product
 * @param productId - The ID of the product
 * @param params - Pagination parameters (page, size)
 * @returns Promise with paginated review responses
 */
export const getProductReviews = async (
    productId: number,
    params: ReviewFilterParams = {}
): Promise<PagedResponse<Review>> => {
    try {
        const requestParams = {
            page: params.page ?? 0,
            size: params.size ?? 10,
        };

        const response = await API.get(`/public/products/${productId}/reviews`, { params: requestParams });
        return response.data;
    } catch (error) {
        console.error(`Error fetching reviews for product ${productId}:`, error);
        throw error;
    }
};

/**
 * Create a review for a product
 * @param productId - The ID of the product
 * @param review - Review data (rating, title, content)
 * @returns Promise with the created review
 */
export const createProductReview = async (
    productId: number,
    review: Omit<Review, "id" | "createdAt" | "userName" | "userId">
): Promise<Review> => {
    try {
        const response = await API.post(`/public/products/${productId}/reviews`, review);
        return response.data;
    } catch (error) {
        console.error(`Error creating review for product ${productId}:`, error);
        throw error;
    }
};
