import apiClient from './axios';

// ----------------------------------------------------------------------

export interface Category {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  productCount: number;
  createdAt: string;
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
  sortOrder?: 'asc' | 'desc';
}

export const categoriesApi = {
  getAll: async (params: GetAllCategoriesParams = {}): Promise<CategoriesResponse> => {
    const { page = 0, pageSize = 10, search = '', sortBy = 'name', sortOrder = 'asc' } = params;
    
    const response = await apiClient.get('/categories', {
      params: {
        page,
        pageSize,
        search,
        sortBy,
        sortOrder,
      },
    });

    return {
      data: response.data.data || [],
      total: response.data.total || 0,
      page: response.data.page || page,
      pageSize: response.data.pageSize || pageSize,
    };
  },
};

