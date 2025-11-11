import apiClient from './axios';
import { USE_MOCK_DATA } from './config';
import { mockCategories, filterCategories, delay } from '../_mock/mock-data';

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
    if (USE_MOCK_DATA) {
      await delay(300);
      const { sortBy = 'name', sortOrder = 'asc' } = params;
      return filterCategories(mockCategories, { ...params, sortBy, sortOrder });
    }
    
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

  getById: async (id: string): Promise<Category> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      const category = mockCategories.find((cat) => cat.id === id);
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
    }
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },

  create: async (category: Omit<Category, 'id'>): Promise<Category> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const newCategory: Category = {
        id: `category-${Date.now()}`,
        ...category,
        productCount: category.productCount ?? 0,
        createdAt: category.createdAt || new Date().toISOString(),
      };
      mockCategories.unshift(newCategory);
      return newCategory;
    }
    const response = await apiClient.post('/categories', category);
    return response.data;
  },

  update: async (id: string, category: Partial<Category>): Promise<Category> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const index = mockCategories.findIndex((cat) => cat.id === id);
      if (index === -1) {
        throw new Error('Category not found');
      }
      mockCategories[index] = { ...mockCategories[index], ...category } as Category;
      return mockCategories[index];
    }
    const response = await apiClient.put(`/categories/${id}`, category);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      const index = mockCategories.findIndex((cat) => cat.id === id);
      if (index === -1) {
        throw new Error('Category not found');
      }
      mockCategories.splice(index, 1);
      return;
    }
    await apiClient.delete(`/categories/${id}`);
  },
};

