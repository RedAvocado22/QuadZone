export interface Product {
    id?: number;
    name: string;
    price: number;
    quantity: number;
    description?: string;
    imageUrl?: string;
    rating?: number;
    category: Category;
    brand?: string;
    subCategory: SubCategory;
    modelNumber?: string;
    isActive?: boolean;
    createdAt?: string;
    reviews?: Review[];
}
export interface Category {
    id: number;
    name: string;
}
export interface SubCategory {
    id: number;
    name: string;
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