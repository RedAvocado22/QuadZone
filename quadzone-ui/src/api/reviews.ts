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
};

/**
 * Fetch reviews for a specific product
 * Maps backend ReviewResponse (content) to frontend Review (text)
 */
export const getProductReviews = async (
    productId: number,
    params: ReviewFilterParams = {}
): Promise<PagedResponse<Review>> => {
    const requestParams = {
        page: params.page ?? 0,
        size: params.size ?? 10,
    };

    const { data }: { data: any } = await API.get(`/public/products/${productId}/reviews`, { params: requestParams });

    const content: Review[] = Array.isArray(data?.content)
        ? data.content.map((r: any) => ({
              id: r.id,
              rating: r.rating,
              title: r.title ?? null,
              text: r.content ?? "",
              createdAt: r.createdAt,
              userName: r.userName,
              userId: r.userId,
          }))
        : [];

    return {
        content,
        page: {
            size: typeof data?.size === "number" ? data.size : requestParams.size,
            number: typeof data?.number === "number" ? data.number : requestParams.page,
            totalElements: typeof data?.totalElements === "number" ? data.totalElements : content.length,
            totalPages: typeof data?.totalPages === "number" ? data.totalPages : 1,
        },
    };
};
