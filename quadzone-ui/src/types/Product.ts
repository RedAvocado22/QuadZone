// Basic product in list/search (ProductResponse from backend)
export interface Product {
    id: number;
    name: string;
    brand: string;
    price: number;
    imageUrl: string;
    quantity: number;
    subCategory: SubCategory;
    category: Category;
}

// Detailed product (ProductDetailsResponse from backend)
export interface ProductDetails extends Product {
    modelNumber: string;
    description: string[];
    weight: number;
    reviews: Review[];
}

// Category from backend (CategoryResponse)
export interface Category {
    id: number;
    name: string;
    subCategories: SubCategory[];
}

// SubCategory from backend (SubCategoryResponse)
export interface SubCategory {
    id: number;
    name: string;
}

// Brand from backend (BrandResponse)
export interface Brand {
    brand: string;
}

export interface Review {
    id: number;
    rating: number;
    text: string;
    title?: string;
    userId: number;
    userName?: string;
    createdAt?: string;
}

export interface PriceRange {
    min: number;
    max: number;
}
