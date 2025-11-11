import API from "./base";

export interface ProductDTO {
    id: number;
    name: string;
    brand?: string;
    modelNumber?: string;
    price: number;
    imageUrl?: string;
    quantity: number;
    isActive: boolean;
    subCategoryId?: number;
    subCategoryName?: string;
    createdAt: string;
}

export interface ProductResponse {
    content: ProductDTO[];
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

export const getProduct = async (id: number): Promise<ProductDTO> => {
    const response = await API.get<ProductDTO>(`/public/products/${id}`);
    return response.data;
};
