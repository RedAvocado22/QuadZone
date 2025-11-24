// Unified API Types - Accurately matching backend DTOs
// =====================================================

// ============== ENUMS ==============
export type UserRole = 'ADMIN' | 'STAFF' | 'CUSTOMER' | 'SHIPPER';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

// ============== PAGED RESPONSE ==============
export interface PagedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ============== CATEGORY & SUBCATEGORY ==============
/** Minimal category info (used in ProductResponse) */
export interface CategoryName {
  id: number;
  name: string;
}

/** Full category with subcategories (used in ProductDetailsResponse, /categories/names endpoint) */
export interface Category {
  id: number;
  name: string;
  subCategories: SubCategory[];
}

export interface SubCategory {
  id: number;
  name: string;
}

// Legacy type aliases for backward compatibility
export type CategoryNameResponse = CategoryName;
export type CategoryResponse = Category;
export type SubCategoryResponse = SubCategory;
export type PublicSubCategoryDTO = SubCategory;
export type PublicCategoryDTO = Category;

// ============== REVIEW ==============
export interface Review {
  id: number;
  rating: number;
  title: string | null;
  text: string;
  createdAt: string; // ISO date string (LocalDateTime from backend)
  userName: string;
  userId: number;
}

export type ReviewResponse = Review;

// ============== PRODUCT TYPES ==============
/**
 * Basic product info (used in /products list endpoints)
 * Maps to ProductResponse in backend
 */
export interface Product {
  id: number;
  name: string;
  brand: string | null;
  price: number;
  imageUrl: string | null;
  quantity: number;
  subCategory: SubCategory;
  category: CategoryName;
}

/**
 * Extended product with details (used in /products/{id} endpoint)
 * Maps to ProductDetailsResponse in backend
 */
export interface ProductDetails extends Product {
  modelNumber: string | null;
  description: string[]; // Array of strings (parsed from JSON in backend)
  weight: number;
  reviews: Review[];
  category: Category; // Full category with subcategories
}

/**
 * Admin product with full details (used in admin endpoints)
 * Maps to ProductAdminResponse in backend
 */
export interface ProductAdmin {
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
  createdAt: string; // ISO date string
  updatedAt: string | null;
  subCategory: SubCategory;
  category: Category;
}

// Brand info
export interface Brand {
  brand: string;
}

export type BrandResponse = Brand;
export type PublicBrandDTO = Brand;

// ============== USER TYPES ==============
/**
 * User info (used in most user endpoints)
 * Maps to UserResponse in backend
 */
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string; // ISO date string
}

/**
 * Current authenticated user (used in /user/me endpoint)
 * Maps to CurrentUserResponse in backend
 * Contains firstName/lastName instead of fullName
 */
export interface CurrentUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: string; // ISO date string
}

// Legacy type aliases for backward compatibility
export type UserResponse = User;
export type CurrentUserResponse = CurrentUser;

// ============== ORDER TYPES ==============
export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: OrderStatus;
  orderDate: string; // ISO date string
  itemsCount: number;
}

export type OrderResponse = Order;

// ============== LEGACY PUBLIC DTOS (for backward compatibility) ==============
/**
 * Legacy PublicProductDTO - use Product or ProductDetails instead
 * Kept for backward compatibility
 */
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
