import apiClient from './axios';
import { USE_MOCK_DATA } from './config';
import { mockProducts, filterProducts, delay } from '../_mock/mock-data';

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
    if (USE_MOCK_DATA) {
      await delay(300);
      return filterProducts(mockProducts, params);
    }
    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  // Get product by ID
  getById: async (id: string): Promise<Product> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      const product = mockProducts.find((p) => p.id === id);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    }
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Create product
  create: async (product: Omit<Product, 'id'>): Promise<Product> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const newProduct: Product = {
        ...product,
        id: `product-${Date.now()}`,
      };
      mockProducts.unshift(newProduct);
      return newProduct;
    }
    const response = await apiClient.post('/products', product);
    return response.data;
  },

  // Update product
  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const index = mockProducts.findIndex((p) => p.id === id);
      if (index === -1) {
        throw new Error('Product not found');
      }
      mockProducts[index] = { ...mockProducts[index], ...product };
      return mockProducts[index];
    }
    const response = await apiClient.put(`/products/${id}`, product);
    return response.data;
  },

  // Delete product
  delete: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      const index = mockProducts.findIndex((p) => p.id === id);
      if (index === -1) {
        throw new Error('Product not found');
      }
      mockProducts.splice(index, 1);
      return;
    }
    await apiClient.delete(`/products/${id}`);
  },
};

