import API from "./base";
import type { CategoryAdminResponse, CategoryResponse, PagedResponse, SubCategoryResponse } from "./types";

// Re-export for convenience
export type { CategoryAdminResponse as Category } from "./types";
export type { CategoryResponse } from "./types";
export type { PagedResponse as CategoriesResponse } from "./types";
export type { SubCategoryResponse as SubCategory } from "./types";

export const categoriesApi = {
  getAll: async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<PagedResponse<CategoryAdminResponse>> => {
    const { page = 0, pageSize = 10, search = '' } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: pageSize.toString(),
      search,
    });

    const response = await API.get<PagedResponse<CategoryAdminResponse>>(`/admin/categories?${queryParams.toString()}`);
    return response.data;
  },


  getAllCategories: async (): Promise<CategoryAdminResponse[]> => {
    const response = await API.get<CategoryAdminResponse[]>('categories/admin/all');
    return response.data;
  },

  getById: async (id: string | number): Promise<CategoryAdminResponse> => {
    const response = await API.get<CategoryAdminResponse>(`categories/admin/${id}`);
    return response.data;
  },

  getSubCategoriesByCategoryId: async (categoryId: number): Promise<SubCategoryResponse[]> => {
    const response = await API.get<SubCategoryResponse[]>(`categories/${categoryId}/subcategories`);
    return response.data;
  },

  create: async (category: Omit<CategoryAdminResponse, 'id' | 'productCount' | 'subcategoryCount' | 'subcategories'>): Promise<CategoryAdminResponse> => {
    const requestBody = {
      name: category.name,
      active: category.active ?? true,
      imageUrl: category.imageUrl || '',
    };

    const response = await API.post<CategoryAdminResponse>('/admin/categories', requestBody);
    return response.data;
  },

  update: async (id: string | number, category: Partial<Omit<CategoryAdminResponse, 'id' | 'productCount' | 'subcategoryCount' | 'subcategories'>>): Promise<CategoryAdminResponse> => {
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

  getSubCategoriesByCategoryId: async (categoryId: number): Promise<SubCategoryResponse[]> => {
    const response = await API.get<SubCategoryResponse[]>(`/categories/${categoryId}/subcategories`);
    return response.data;
  },

  createSubCategory: async (categoryId: number, subCategory: { name: string; active?: boolean }): Promise<SubCategoryResponse> => {
    const requestBody = {
      name: subCategory.name,
      active: subCategory.active ?? true,
    };
    const response = await API.post<SubCategoryResponse>(`/categories/${categoryId}/subcategories`, requestBody);
    return response.data;
  },

  updateSubCategory: async (categoryId: number, subId: number, subCategory: { name?: string; active?: boolean }): Promise<SubCategoryResponse> => {
    const requestBody: any = {};
    if (subCategory.name !== undefined) requestBody.name = subCategory.name;
    if (subCategory.active !== undefined) requestBody.active = subCategory.active;
    const response = await API.put<SubCategoryResponse>(`/categories/${categoryId}/subcategories/${subId}`, requestBody);
    return response.data;
  },

  deleteSubCategory: async (categoryId: number, subId: number): Promise<void> => {
    await API.delete(`/categories/${categoryId}/subcategories/${subId}`);
  },
};