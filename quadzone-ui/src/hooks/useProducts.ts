import { useState, useEffect } from "react";
import { getProducts } from "../api/products";
import type { Product } from "../api/types";

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

            const response = await getProducts({ page, size, query });

            setProducts(response.data ?? []);
            setTotalPages(Math.ceil(response.total / size));
            setTotalElements(response.total);
        } catch (err) {
            console.error("❌ Error loading products:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    fetchProducts();
}, [page, size, query]);

    return { products, loading, error, totalPages, totalElements };
};
