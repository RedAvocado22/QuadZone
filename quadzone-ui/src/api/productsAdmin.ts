import API from "./base";
import type { ProductAdminResponse, PagedResponse } from "./types";

// Re-export for convenience
export type { ProductAdminResponse as Product } from "./types";
export type { PagedResponse as ProductsResponse } from "./types";

export const productsApi = {
  // Get all products
  getAll: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
  }): Promise<PagedResponse<ProductAdminResponse>> => {
    const {
      page = 0,
      pageSize = 12,
      search = '',
      sortBy = 'newest',
    } = params ?? {};

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: pageSize.toString(),
      search,
    });

    // Map frontend sort options to backend sort format
    if (sortBy) {
      switch (sortBy) {
        case 'priceDesc':
          queryParams.append('sortBy', 'price:desc');
          break;
        case 'priceAsc':
          queryParams.append('sortBy', 'price:asc');
          break;
        case 'newest':
        default:
          queryParams.append('sortBy', 'createdAt:desc');
          break;
      }
    }

    const response = await API.get<PagedResponse<ProductAdminResponse>>(`/admin/products?${queryParams.toString()}`);
    return response.data;
  },

  // Get product by ID
  getById: async (id: string | number): Promise<ProductAdminResponse> => {
    const response = await API.get<ProductAdminResponse>(`/admin/products/${id}`);
    return response.data;
  },

  // Create product
  create: async (product: Omit<ProductAdminResponse, 'id' | 'subCategory' | 'category' | 'createdAt' | 'updatedAt'> & { subCategoryId ?: number } &{categoryId ?: number}): Promise<ProductAdminResponse> => {
    const requestBody: any = {
      name: product.name,
      brand: product.brand || '',
      modelNumber: product.modelNumber || '',
      description: product.description || '',
      stock: product.quantity || 0,
      price: product.price,
      costPrice: product.costPrice || (product.price * 0.8),
      weight: product.weight || 0,
      color: product.color || '',
      imageUrl: product.imageUrl || '',
      subCategory: product.subCategoryId ? { id: product.subCategoryId } : null,
      category: product.categoryId ? { id: product.categoryId } : null,
      isActive: product.isActive ?? true,
    }; 

    const response = await API.post<ProductAdminResponse>('/products', requestBody);
    return response.data;
  },

  // Update product
  update: async (id: string | number, product: Partial<Omit<ProductAdminResponse, 'id' | 'subCategory' | 'category' | 'createdAt' | 'updatedAt'>> & { subCategoryId?: number; status?: string }): Promise<ProductAdminResponse> => {
    const requestBody: any = {};
    if (product.name !== undefined) requestBody.name = product.name;
    if (product.brand !== undefined) requestBody.brand = product.brand;
    if (product.price !== undefined) requestBody.price = product.price;
    if (product.quantity !== undefined) requestBody.quantity = product.quantity;
    if (product.description !== undefined) requestBody.description = product.description;
    if (product.imageUrl !== undefined) requestBody.imageUrl = product.imageUrl;
    if (product.subCategoryId !== undefined) requestBody.subCategory = { id: product.subCategoryId };
    if (product.status !== undefined) requestBody.isActive = product.status !== 'locked';

    const response = await API.put<ProductAdminResponse>(`/admin/products/${id}`, requestBody);
    return response.data;
  },

  // Delete product
  delete: async (id: string | number): Promise<void> => {
    await API.delete(`/admin/products/${id}`);
  },
};
