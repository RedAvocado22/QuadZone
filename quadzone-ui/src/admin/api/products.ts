import apiClient from "./axios";
import { USE_MOCK_DATA } from "./config";
import { mockProducts, filterProducts, delay } from "../_mock/mock-data";

// ----------------------------------------------------------------------

export interface Product {
    id: string;
    name: string;
    price: number;
    priceSale?: number | null;
    coverUrl?: string;
    colors?: string[];
    status?: "sale" | "new" | "locked" | "active" | "";
    description?: string;
    brand?: string | null;
    quantity?: number | null;
}

interface AdminProductDto {
    id: number;
    name: string;
    brand: string | null;
    price: number;
    quantity: number | null;
    active: boolean;
    imageUrl: string | null;
}

export interface ProductsResponse {
    data: Product[];
    total: number;
    page: number;
    pageSize: number;
}

// ----------------------------------------------------------------------

export const productsApi = {
    // Get all products
    getAll: async (params?: {
        page?: number;
        pageSize?: number;
        search?: string;
        category?: string;
        price?: string;
        gender?: string[];
        colors?: string[];
        rating?: string;
    }): Promise<ProductsResponse> => {
        if (USE_MOCK_DATA) {
            await delay(300);
            return filterProducts(mockProducts, params);
        }
        const { page = 0, pageSize = 12, search = "", category, price, gender, colors, rating } = params ?? {};

        const response = await apiClient.get("/admin/products", {
            params: {
                page,
                size: pageSize,
                search,
                category,
                price,
                gender,
                colors,
                rating
            }
        });

        const payload = response.data as {
            data: AdminProductDto[];
            total: number;
            page: number;
            pageSize: number;
        };

        const mappedData: Product[] = (payload.data ?? []).map((item) => ({
            id: String(item.id),
            name: item.name,
            price: item.price,
            priceSale: null,
            coverUrl: item.imageUrl ?? "https://via.placeholder.com/400x400?text=Product",
            colors: [],
            status: item.active ? "active" : "locked",
            description: item.brand ?? "",
            brand: item.brand,
            quantity: item.quantity
        }));

        return {
            data: mappedData,
            total: payload.total ?? 0,
            page: payload.page ?? page,
            pageSize: payload.pageSize ?? pageSize
        };
    },

    // Get product by ID
    getById: async (id: string): Promise<Product> => {
        if (USE_MOCK_DATA) {
            await delay(200);
            const product = mockProducts.find((p) => p.id === id);
            if (!product) {
                throw new Error("Product not found");
            }
            return product;
        }
        const response = await apiClient.get(`/admin/products/${id}`);
        const data = response.data as AdminProductDto;

        return {
            id: String(data.id),
            name: data.name,
            price: data.price,
            priceSale: null,
            coverUrl: data.imageUrl ?? "https://via.placeholder.com/400x400?text=Product",
            colors: [],
            status: data.active ? "active" : "locked",
            description: data.brand ?? "",
            brand: data.brand,
            quantity: data.quantity
        };
    },

    // Create product
    create: async (product: Omit<Product, "id">): Promise<Product> => {
        if (USE_MOCK_DATA) {
            await delay(300);
            const newProduct: Product = {
                ...product,
                id: `product-${Date.now()}`
            };
            mockProducts.unshift(newProduct);
            return newProduct;
        }
        throw new Error("Product creation API is not implemented yet");
    },

    // Update product
    update: async (id: string, product: Partial<Product>): Promise<Product> => {
        if (USE_MOCK_DATA) {
            await delay(300);
            const index = mockProducts.findIndex((p) => p.id === id);
            if (index === -1) {
                throw new Error("Product not found");
            }
            mockProducts[index] = { ...mockProducts[index], ...product };
            return mockProducts[index];
        }
        throw new Error("Product update API is not implemented yet");
    },

    // Delete product
    delete: async (id: string): Promise<void> => {
        if (USE_MOCK_DATA) {
            await delay(200);
            const index = mockProducts.findIndex((p) => p.id === id);
            if (index === -1) {
                throw new Error("Product not found");
            }
            mockProducts.splice(index, 1);
            return;
        }
        throw new Error("Product delete API is not implemented yet");
    }
};
