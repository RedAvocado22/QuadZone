import API from "./base";
import type { Product, Category, Brand, ProductDetails, PagedResponse } from "../api/types";

export interface ProductFilterParams {
    page?: number;
    size?: number;
    search?:string;
    brand?: string;
    categoryId?: number;
    subcategoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    query?: string;
    sortOrder?: "asc" | "desc";
}


export const getProducts = async (params: ProductFilterParams = {}): Promise<PagedResponse<Product>> => {
    try {
        const requestParams: Record<string, any> = {
            page: params.page ?? 0,
            size: params.size ?? 10,
        };

        // Add optional filters only if they exist
        if (params.search) requestParams.search = params.search;
        if (params.categoryId !== undefined) requestParams.categoryId = params.categoryId;
        if (params.subcategoryId !== undefined) requestParams.subcategoryId = params.subcategoryId;
        if (params.brand) requestParams.brand = params.brand;
        if (params.minPrice !== undefined) requestParams.minPrice = params.minPrice;
        if (params.maxPrice !== undefined) requestParams.maxPrice = params.maxPrice;
        if (params.sortBy) requestParams.sortBy = params.sortBy;
        if (params.sortOrder) requestParams.sortOrder = params.sortOrder;

        const response = await API.get(`/public/products`, { params: requestParams });
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

// Fetch single product details
export const getProductDetails = async (id: number): Promise<ProductDetails> => {
    try {
        const response = await API.get(`/public/products/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        throw error;
    }
};

// Fetch categories
export const getCategories = async (): Promise<Category[]> => {
    try {
        const response = await API.get('/public/categories/names');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};

// Fetch brands
export const getBrands = async (): Promise<Brand[]> => {
    try {
        const response = await API.get('/public/products/brands');
        return response.data;
    } catch (error) {
        console.error('Error fetching brands:', error);
        return [];
    }
};

