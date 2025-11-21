import API from "./base";
import type { PublicProductDTO } from "./types";

// Re-export for convenience
export type { PublicProductDTO as ProductDTO } from "./types";

// ProductResponse for public API endpoint (may differ from admin endpoint)
export interface ProductResponse {
    content: PublicProductDTO[];
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

export const getProducts = async (page = 0, size = 20, query?: string): Promise<ProductResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
    });

    if (query) {
        params.append("q", query);
    }

    const response = await API.get<ProductResponse>(`/public/products?${params.toString()}`);
    return response.data;
};

export const getProduct = async (id: number): Promise<PublicProductDTO> => {
    const response = await API.get<PublicProductDTO>(`/public/products/${id}`);
    return response.data;
};
