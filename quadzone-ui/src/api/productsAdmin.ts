import API from "./base";

// ----------------------------------------------------------------------

export interface Product {
  id: string;
  name: string;
  price: number;
  priceSale?: number | null;
  coverUrl?: string;
  colors?: string[];
  status?: 'sale' | 'new' | 'locked' | 'active' | '';
  description?: string;
  brand?: string | null;
  quantity?: number | null;
}

interface ProductDto {
  id: number;
  name: string;
  brand: string | null;
  price: number;
  quantity: number | null;
  imageUrl: string | null;
  modelNumber?: string | null;
  description?: string | null;
  subCategory?: any;
  category?: any;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
}

// ----------------------------------------------------------------------

function mapProductToFrontend(dto: ProductDto): Product {
  return {
    id: String(dto.id),
    name: dto.name,
    price: dto.price,
    priceSale: null,
    coverUrl: dto.imageUrl ?? 'https://via.placeholder.com/400x400?text=Product',
    colors: [],
    status: 'active',
    description: dto.description ?? dto.brand ?? '',
    brand: dto.brand,
    quantity: dto.quantity,
  };
}

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
    const {
      page = 0,
      pageSize = 12,
      search = '',
      category,
      price,
      gender,
      colors,
      rating,
    } = params ?? {};

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: pageSize.toString(),
      search,
    });

    if (category) queryParams.append('category', category);
    if (price) queryParams.append('price', price);
    if (gender) queryParams.append('gender', gender.join(','));
    if (colors) queryParams.append('colors', colors.join(','));
    if (rating) queryParams.append('rating', rating);

    const response = await API.get<{
      data: ProductDto[];
      total: number;
      page: number;
      pageSize: number;
    }>(`/products/admin?${queryParams.toString()}`);

    const payload = response.data;

    return {
      data: (payload.data ?? []).map(mapProductToFrontend),
      total: payload.total ?? 0,
      page: payload.page ?? page,
      pageSize: payload.pageSize ?? pageSize,
    };
  },

  // Get product by ID
  getById: async (id: string): Promise<Product> => {
    const response = await API.get<ProductDto>(`/products/admin/${id}`);
    const data = response.data;

    return mapProductToFrontend(data);
  },

  // Create product
  create: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const requestBody = {
      name: product.name,
      brand: product.brand || '',
      modelNumber: '',
      description: product.description || '',
      quantity: product.quantity || 0,
      price: product.price,
      costPrice: product.price * 0.8,
      weight: 0,
      color: product.colors?.[0] || '',
      imageUrl: product.coverUrl || '',
      subCategory: null, // This needs to be provided from the form
    };

    const response = await API.post<ProductDto>('/products/admin', requestBody);
    return mapProductToFrontend(response.data);
  },

  // Update product
  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const requestBody: any = {};
    if (product.name !== undefined) requestBody.name = product.name;
    if (product.brand !== undefined) requestBody.brand = product.brand;
    if (product.description !== undefined) requestBody.description = product.description;
    if (product.quantity !== undefined) requestBody.quantity = product.quantity;
    if (product.price !== undefined) requestBody.price = product.price;
    if (product.coverUrl !== undefined) requestBody.imageUrl = product.coverUrl;

    const response = await API.put<ProductDto>(`/products/${id}`, requestBody);
    return mapProductToFrontend(response.data);
  },

  // Delete product
  delete: async (id: string): Promise<void> => {
    await API.delete(`/products/${id}`);
  },
};
