import API from "./base";
import type { Review, PagedResponse } from "./types";

export interface CreateReviewRequest {
    productId: number;
    rating: number;
    title?: string;
    text: string;
}

export interface UpdateReviewRequest {
    rating?: number;
    title?: string;
    text?: string;
}

export interface CheckReviewResponse {
    hasReviewed: boolean;
    review: Review | null;
}

export interface ReviewFilterParams {
    page?: number;
    size?: number;
}

export const reviewsApi = {
    // Check if user has already reviewed a product
    checkReview: async (productId: number): Promise<CheckReviewResponse> => {
        try {
            const response = await API.get<CheckReviewResponse>(`/reviews/check/${productId}`);
            return response.data;
        } catch {
            return { hasReviewed: false, review: null };
        }
    },

    // Get all reviews by current user
    getMyReviews: async (): Promise<Review[]> => {
        const response = await API.get<Review[]>('/reviews/my-reviews');
        return response.data;
    },

    // Create a review
    create: async (data: CreateReviewRequest): Promise<Review> => {
        const response = await API.post<Review>('/reviews', data);
        return response.data;
    },

    // Update a review
    update: async (reviewId: number, data: UpdateReviewRequest): Promise<Review> => {
        const response = await API.put<Review>(`/reviews/${reviewId}`, data);
        return response.data;
    },

    // Delete a review
    delete: async (reviewId: number): Promise<void> => {
        await API.delete(`/reviews/${reviewId}`);
    },

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
