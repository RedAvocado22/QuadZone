import { useState, useEffect } from "react";
import { getProducts } from "../api/products";
import type { Product } from "../types/Product";
import type { ProductDTO } from "../api/products";

export const useProducts = (page = 0, size = 20, query?: string) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await getProducts(page, size, query);
                const mappedProducts: Product[] = response.content.map((product: ProductDTO) => ({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: product.quantity,
                    image: product.imageUrl,
                    category: {
                        id: product.subCategoryId || 0,
                        name: product.subCategoryName || "Unknown"
                    },
                    brand: product.brand,
                    modelNumber: product.modelNumber,
                    isActive: product.isActive,
                    subCategoryId: product.subCategoryId,
                    subCategoryName: product.subCategoryName,
                    createdAt: product.createdAt
                }));
                setProducts(mappedProducts);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch products");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page, size, query]);

    return { products, loading, error, totalPages, totalElements };
};
