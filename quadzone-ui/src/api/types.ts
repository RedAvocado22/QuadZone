// Unified API Types - Accurately matching backend DTOs
// =====================================================

// ============== ENUMS ==============
export type UserRole = "ADMIN" | "STAFF" | "CUSTOMER" | "SHIPPER";
export type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "COMPLETED" | "CANCELLED";
export type userStatus = "UNACTIVE" | "ACTIVE" | "SUSPENDED";
// ============== PAGED RESPONSE ==============
export interface PagedResponse<T> {
    content: T[];
    page: {
        size: number;
        number: number;
        totalElements: number;
        totalPages: number;
    };
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
    createdAt: string; // ISO date string
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

export type ProductResponse = Product;
export type ProductDetailsResponse = ProductDetails;
export type ProductAdminResponse = ProductAdmin;

// Brand info
export interface Brand {
    brand: string;
}

export type PublicBrandDTO = Brand;

// ============== USER TYPES ==============
/**
 * User info (used in most user endpoints)
 * Maps to UserResponse in backend
 */
export interface User {
    id: number;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: UserRole;
    status: userStatus;
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

export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  dateOfBirth?: string;
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

// ============== NOTIFICATION TYPES ==============
export interface Notification {
    id: number;
    type: string;
    title: string;
    description: string;
    avatarUrl: string;
    postedAt: string; // ISO date string
    isUnRead: boolean;
}

export type NotificationResponse = Notification;

export interface NotificationRequest {
    type: string;
    title: string;
    description: string;
    avatarUrl: string;
}

// ============== CART TYPES ==============
// Backend CartItemResponse structure
export interface CartItemResponse {
    id: number;
    quantity: number;
    addedAt: string; // ISO date string
    productResponse: Product;
}

// Flattened CartItem for frontend use (extends Product with quantity and addedAt)
export interface CartItem extends Product {
    quantity: number;
    addedAt: string; // ISO date string
}

export interface Cart {
    id: number;
    customerId: number;
    updateAt: string; // ISO date string
    cart_item_list: CartItemResponse[];
}

export type CartResponse = Cart;

export interface AddToCartRequest {
    productId: number;
    quantity: number;
}

// ============== ADMIN CATEGORY ==============
/**
 * Admin category with detailed stats
 * Maps to CategoryAdminResponse in backend
 */
export interface CategoryAdmin {
    id: number;
    name: string;
    active: boolean;
    imageUrl: string;
    productCount: number;
    subcategoryCount: number;
    subcategories: SubCategory[];
}

export type CategoryAdminResponse = CategoryAdmin;

// ============== HOME PAGE ==============
export interface HomeResponse {
    categories: Category[];
    featured: PagedResponse<Product>;
    bestSellers: PagedResponse<Product>;
    newArrivals: PagedResponse<Product>;
}

// ============== EXCHANGE RATE ==============
export interface ExchangeRateResponse {
    result: string;
    base_code: string;
    conversion_rates: Record<string, number>;
}

// ============== AUTH TYPES ==============
export interface AuthenticationRequest {
    email: string;
    password: string;
}

export interface AuthenticationResponse {
    access_token: string;
    refresh_token: string;
}

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
