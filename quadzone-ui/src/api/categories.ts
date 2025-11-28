import API from "./base";
import type { CategoryResponse, PagedResponse } from "./types";

// Re-export for convenience
export type { CategoryResponse as Category } from "./types";
export type { PagedResponse as CategoriesResponse } from "./types";

export const categoriesApi = {
  getAll: async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<PagedResponse<CategoryResponse>> => {
    const { page = 0, pageSize = 10, search = '' } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: pageSize.toString(),
      search,
    });

    const response = await API.get<PagedResponse<CategoryResponse>>(`/admin/categories?${queryParams.toString()}`);
    return response.data;
  },

  getAllCategories: async (): Promise<CategoryResponse[]> => {
      const response = await API.get<CategoryResponse[]>('/categories/admin/all');
      return response.data;
    },  
     getSubCategoriesByCategoryId: async (categoryId: number): Promise<SubCategory[]> => {
    const response = await API.get<SubCategory[]>(`categories/${categoryId}/subcategories`);
    return response.data;
  },

  getById: async (id: string | number): Promise<CategoryResponse> => {
    const response = await API.get<CategoryResponse>(`/admin/categories/${id}`);
    return response.data;
  },

  create: async (category: Omit<CategoryResponse, 'id' | 'productCount'>): Promise<CategoryResponse> => {
    const requestBody = {
      name: category.name,
      active: category.active ?? true,
      imageUrl: category.imageUrl || '',
    };

    const response = await API.post<CategoryResponse>('/admin/categories', requestBody);
    return response.data;
  },

  update: async (id: string | number, category: Partial<Omit<CategoryResponse, 'id' | 'productCount'>>): Promise<CategoryResponse> => {
    const requestBody: any = {};
    if (category.name !== undefined) requestBody.name = category.name;
    if (category.active !== undefined) requestBody.active = category.active;
    if (category.imageUrl !== undefined) requestBody.imageUrl = category.imageUrl;

    const response = await API.put<CategoryResponse>(`/admin/categories/${id}`, requestBody);
    return response.data;
  },

  delete: async (id: string | number): Promise<void> => {
    await API.delete(`/admin/categories/${id}`);
  },
};
