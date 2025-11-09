import apiClient from './axios';

// ----------------------------------------------------------------------

export interface Product {
  id: string;
  name: string;
  price: number;
  priceSale?: number | null;
  coverUrl?: string;
  colors?: string[];
  status?: 'sale' | 'new' | '';
  description?: string;
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
    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  // Get product by ID
  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Create product
  create: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await apiClient.post('/products', product);
    return response.data;
  },

  // Update product
  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const response = await apiClient.put(`/products/${id}`, product);
    return response.data;
  },

  // Delete product
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};

