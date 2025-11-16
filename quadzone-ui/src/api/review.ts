import API from "./base";

export interface ReviewDTO {
    id: number;
    rating: number;
    reviewTitle?: string;
    reviewText?: string;
    updatedAt?: string; // LocalDateTime → ISO string
    createdAt?: string;
    productName?: string;
    userName?: string;
}

export interface ReviewResponse {
    content: ReviewDTO[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    first: boolean;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    numberOfElements: number;
    empty: boolean;
}

/** Fetch paginated reviews by product ID */
export const getReviewsByProduct = async (productId: number, page = 0, size = 5): Promise<ReviewResponse> => {
    const response = await API.get<ReviewResponse>(`/public/products/${productId}/reviews?page=${page}&size=${size}`);
    return response.data;
};

/** Post a new review */
export const postReview = async (review: {
    productId: number;
    rating: number;
    reviewTitle?: string;
    reviewText: string;
}): Promise<ReviewDTO> => {
    const response = await API.post<ReviewDTO>("/reviews", review);
    return response.data;
};
