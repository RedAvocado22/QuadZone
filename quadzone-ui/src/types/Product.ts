export interface Product {
    id?: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    rating?: number;
    category: Category;
    brand?: string;
    modelNumber?: string;
    isActive?: boolean;
    subCategoryId?: number;
    subCategoryName?: string;
    createdAt?: string;
}

export interface Category {
    id: number;
    name: string;
}
