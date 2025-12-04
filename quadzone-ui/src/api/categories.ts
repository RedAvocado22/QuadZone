import API from "./base";
import type { CategoryAdminResponse, PagedResponse, SubCategoryResponse } from "./types";

// Re-export for convenience
export type { CategoryAdminResponse as Category } from "./types";
export type { CategoryResponse } from "./types";
export type { PagedResponse as CategoriesResponse } from "./types";
export type { SubCategoryResponse as SubCategory } from "./types";

export const categoriesApi = {
    getAll: async (
        params: {
            page?: number;
            pageSize?: number;
            search?: string;
            sortBy?: string;
            sortOrder?: "asc" | "desc";
        } = {}
    ): Promise<PagedResponse<CategoryAdminResponse>> => {
        const { page = 0, pageSize = 10, search = "" } = params;

        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: pageSize.toString(),
            search
        });

        const response = await API.get<PagedResponse<CategoryAdminResponse>>(
            `/admin/categories?${queryParams.toString()}`
        );
        return response.data;
    },

    getAllCategories: async (): Promise<CategoryAdminResponse[]> => {
        const response = await API.get<CategoryAdminResponse[]>("/admin/categories/all");
        return response.data;
    },

    getById: async (id: string | number): Promise<CategoryAdminResponse> => {
        const response = await API.get<CategoryAdminResponse>(`/admin/categories/${id}`);
        return response.data;
    },

    create: async (
        category: Omit<CategoryAdminResponse, "id" | "productCount" | "subcategoryCount" | "subcategories">
    ): Promise<CategoryAdminResponse> => {
        const requestBody = {
            name: category.name,
            active: category.active ?? true,
            imageUrl: category.imageUrl || ""
        };

        const response = await API.post<CategoryAdminResponse>("/admin/categories", requestBody);
        return response.data;
    },

    update: async (
        id: string | number,
        category: Partial<Omit<CategoryAdminResponse, "id" | "productCount" | "subcategoryCount" | "subcategories">>
    ): Promise<CategoryAdminResponse> => {
        const requestBody: any = {};
        if (category.name !== undefined) requestBody.name = category.name;
        if (category.active !== undefined) requestBody.active = category.active;
        if (category.imageUrl !== undefined) requestBody.imageUrl = category.imageUrl;

        const response = await API.put<CategoryAdminResponse>(`/admin/categories/${id}`, requestBody);
        return response.data;
    },

    delete: async (id: string | number): Promise<void> => {
        await API.delete(`/admin/categories/${id}`);
    },

    // ------------------ SUBCATEGORY ------------------

    /**
     * Get subcategories by category ID (public endpoint)
     * @param categoryId The category ID
     * @returns List of subcategories for the category
     */
    getSubCategoriesByCategoryId: async (categoryId: number): Promise<SubCategoryResponse[]> => {
        const response = await API.get<SubCategoryResponse[]>(`/categories/${categoryId}/subcategories`);
        return response.data;
    },

    /**
     * Create a new subcategory under a category
     * @param categoryId The parent category ID
     * @param subCategory Object with name and optional active status
     * @returns The created subcategory
     */
    createSubCategory: async (
        categoryId: number,
        subCategory: { name: string; active?: boolean }
    ): Promise<SubCategoryResponse> => {
        const requestBody = {
            name: subCategory.name,
            categoryId: categoryId,
            active: subCategory.active ?? true
        };
        const response = await API.post<SubCategoryResponse>(`/admin/subcategories`, requestBody);
        return response.data;
    },

    /**
     * Update an existing subcategory
     * @param categoryId The parent category ID
     * @param subId The subcategory ID to update
     * @param subCategory Object with fields to update (name, active)
     * @returns The updated subcategory
     */
    updateSubCategory: async (
        categoryId: number,
        subId: number,
        subCategory: { name?: string; active?: boolean }
    ): Promise<SubCategoryResponse> => {
        const requestBody: any = {
            categoryId: categoryId
        };
        if (subCategory.name !== undefined) requestBody.name = subCategory.name;
        if (subCategory.active !== undefined) requestBody.active = subCategory.active;
        const response = await API.put<SubCategoryResponse>(
            `/admin/subcategories/${subId}`,
            requestBody
        );
        return response.data;
    },

    /**
     * Delete a subcategory
     * @param categoryId The parent category ID
     * @param subId The subcategory ID to delete
     */
    deleteSubCategory: async (_categoryId: number, subId: number): Promise<void> => {
        await API.delete(`/admin/subcategories/${subId}`);
    }
};

