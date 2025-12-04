import API from "./base";
import type { Review } from "./types";

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
};
