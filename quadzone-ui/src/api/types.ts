// Unified API Types - These match the backend DTOs exactly
// ----------------------------------------------------------------------

// Common Types
export type UserRole = 'ADMIN' | 'STAFF' | 'CUSTOMER' | 'SHIPPER';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

// Paged Response (matches PagedResponse<T>)
export interface PagedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Category Types (matches CategoryResponse)
export interface CategoryResponse {
  id: number;
  name: string;
  active: boolean;
  productCount: number;
  imageUrl: string | null;
}

export interface SubCategoryResponse {
  id: number;
  name: string;
}

// Product Types (matches ProductResponse and ProductDetailsResponse)
export interface ProductResponse {
  id: number;
  name: string;
  brand: string | null;
  price: number;
  imageUrl: string | null;
  quantity: number;
  subCategory: SubCategoryResponse;
  category: CategoryResponse;
}

// Product Admin Response (matches ProductAdminResponse from backend)
export interface ProductAdminResponse {
  id: number;
  name: string;
  brand: string | null;
  modelNumber: string | null;
  color: string | null;
  description: string | null;
  price: number;
  costPrice: number | null;
  weight: number | null;
  quantity: number;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  subCategory: SubCategoryResponse;
  category: CategoryResponse;
}

export interface ReviewResponse {
  id: number;
  rating: number;
  title: string | null;
  text: string;
  createdAt: string;
  userName: string;
  userId: number;
}

export interface ProductDetailsResponse extends ProductResponse {
  modelNumber: string | null;
  description: string | null;
  reviews: ReviewResponse[];
}

// User Types (matches UserResponse and CurrentUserResponse)
export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface CurrentUserResponse {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

// Order Types (matches OrderResponse)
export interface OrderResponse {
  id: number;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
  itemsCount: number;
}

// Public Product DTO (for public API endpoint - may have different structure)
export interface PublicProductDTO {
  id: number;
  name: string;
  brand?: string;
  modelNumber?: string;
  description?: string;
  price: number;
  priceVND: number;
  imageUrl?: string;
  quantity: number;
  isActive: boolean;
  subCategoryId?: number;
  subCategoryName?: string;
  createdAt: string;
}
