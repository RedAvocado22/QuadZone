import API from "./base";
import type { Product, Category, Brand, ProductDetails, PagedResponse } from "../api/types";

export interface ProductFilterParams {
    page?: number;
    size?: number;
    brand?: string;
    categoryId?: number;
    subcategoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    query?: string;
}


export const getProducts = async (params: ProductFilterParams = {}): Promise<PagedResponse<Product>> => {
    try {
        const requestParams = {
            page: params.page ?? 0,
            size: params.size ?? 10,
            ...(params.brand && { brand: params.brand }),
            ...(params.categoryId && { categoryId: params.categoryId }),
            ...(params.subcategoryId && { subcategoryId: params.subcategoryId }),
            ...(params.minPrice !== undefined && { minPrice: params.minPrice }),
            ...(params.maxPrice !== undefined && { maxPrice: params.maxPrice }),
            ...(params.sortBy && { sortBy: params.sortBy }),
            ...(params.query && { query: params.query })
        };
        console.log(" Requesting products with params:", requestParams);
        const response = await API.get(`/public/products`, {
            params: requestParams
        });
        console.log(" Products response received:", response.data);
        return response.data;
    } catch (error) {
        console.error(" Error fetching products:", error);
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

