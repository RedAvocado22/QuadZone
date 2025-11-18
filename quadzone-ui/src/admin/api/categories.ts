import apiClient from "./axios";
import { USE_MOCK_DATA } from "./config";
import { mockCategories, filterCategories, delay } from "../_mock/mock-data";

// ----------------------------------------------------------------------

export interface Category {
    id: string;
    name: string;
    description?: string;
    status: "active" | "inactive";
    productCount: number;
    createdAt: string;
    imageUrl?: string | null;
}

export interface CategoriesResponse {
    data: Category[];
    total: number;
    page: number;
    pageSize: number;
}

// ----------------------------------------------------------------------

interface GetAllCategoriesParams {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export const categoriesApi = {
    getAll: async (params: GetAllCategoriesParams = {}): Promise<CategoriesResponse> => {
        if (USE_MOCK_DATA) {
            await delay(300);
            const { sortBy = "name", sortOrder = "asc" } = params;
            return filterCategories(mockCategories, { ...params, sortBy, sortOrder });
        }

        const { page = 0, pageSize = 10, search = "", sortBy = "name", sortOrder = "asc" } = params;

        const response = await apiClient.get("/admin/categories", {
            params: {
                page,
                size: pageSize,
                search,
                sortBy,
                sortOrder
            }
        });

        const payload = response.data as {
            data: Array<{
                id: number;
                name: string;
                active: boolean;
                productCount: number;
                imageUrl: string | null;
            }>;
            total: number;
            page: number;
            pageSize: number;
        };

        const mappedData: Category[] = (payload.data ?? []).map((category) => ({
            id: String(category.id),
            name: category.name,
            status: category.active ? "active" : "inactive",
            productCount: category.productCount ?? 0,
            createdAt: "",
            description: "",
            imageUrl: category.imageUrl ?? null
        }));

        return {
            data: mappedData,
            total: payload.total ?? 0,
            page: payload.page ?? page,
            pageSize: payload.pageSize ?? pageSize
        };
    },

    getById: async (id: string): Promise<Category> => {
        if (USE_MOCK_DATA) {
            await delay(200);
            const category = mockCategories.find((cat) => cat.id === id);
            if (!category) {
                throw new Error("Category not found");
            }
            return category;
        }
        const response = await apiClient.get(`/admin/categories/${id}`);
        const data = response.data as {
            id: number;
            name: string;
            active: boolean;
            productCount: number;
            imageUrl: string | null;
        };

        return {
            id: String(data.id),
            name: data.name,
            status: data.active ? "active" : "inactive",
            productCount: data.productCount ?? 0,
            createdAt: "",
            description: "",
            imageUrl: data.imageUrl ?? null
        };
    },

    create: async (category: Omit<Category, "id">): Promise<Category> => {
        if (USE_MOCK_DATA) {
            await delay(300);
            const newCategory: Category = {
                id: `category-${Date.now()}`,
                ...category,
                productCount: category.productCount ?? 0,
                createdAt: category.createdAt || new Date().toISOString()
            };
            mockCategories.unshift(newCategory);
            return newCategory;
        }
        throw new Error("Category creation API is not implemented yet");
    },

    update: async (id: string, category: Partial<Category>): Promise<Category> => {
        if (USE_MOCK_DATA) {
            await delay(300);
            const index = mockCategories.findIndex((cat) => cat.id === id);
            if (index === -1) {
                throw new Error("Category not found");
            }
            mockCategories[index] = { ...mockCategories[index], ...category } as Category;
            return mockCategories[index];
        }
        throw new Error("Category update API is not implemented yet");
    },

    delete: async (id: string): Promise<void> => {
        if (USE_MOCK_DATA) {
            await delay(200);
            const index = mockCategories.findIndex((cat) => cat.id === id);
            if (index === -1) {
                throw new Error("Category not found");
            }
            mockCategories.splice(index, 1);
            return;
        }
        throw new Error("Category delete API is not implemented yet");
    }
};
