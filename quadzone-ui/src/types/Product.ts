export interface Product {
    id?: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    rating?: number;
    category: Category;
}

export interface Category {
    id: number;
    name: string;
}
