import API from "./base";
import type { Product } from "../types/shop";

export const getProducts = async ({ page = 0, size = 20, q = "", sort = "id" } = {}): Promise<any> => {
    try {
        const response = await API.get(`/public/products`, {
            params: { page, size, q, sort }
        });
        // Map the content array to Product objects
        return {
            ...response.data,
            content: response.data.content.map((item: any) => ({
                id: item.id,
                name: item.name,
                category: item.subCategory?.name || item.subCategoryName || 'Unknown',
                price: item.price ?? 0,
                oldPrice: item.oldPrice,
                image: item.imageUrl || item.image || '/assets/img/default-product.png',
                rating: item.rating || 0,
                reviews: item.reviews?.length || 0,
                sku: item.sku,
                features: item.features || [],
                quantity: item.stock ?? 0,
                weight: item.weight ?? 0,
                subCategory: item.subCategory
                    ? { id: item.subCategory.id, name: item.subCategory.name }
                    : item.subCategoryId
                    ? { id: item.subCategoryId, name: item.subCategoryName || 'Unknown' }
                    : { id: 0, name: item.subCategoryName || item.category || 'Unknown' }
            }))
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};
