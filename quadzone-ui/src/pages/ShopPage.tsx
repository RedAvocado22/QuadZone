import { useState, useEffect } from "react";
import ShopBreadcrumb from "../components/shop/ShopBreadcrumb";
import ShopSidebar from "../components/shop/ShopSidebar";
import ShopControlBar from "../components/shop/ShopControlBar";
import ProductGrid from "../components/shop/ProductGrid";
import ShopPagination from "../components/shop/ShopPagination";
import { getProducts } from "../api/products";
import type { Product } from "../api/types";
import type { ViewMode, SortOption } from "../types/shop";

const Shop: React.FC = () => {
    // Loading & error
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // UI controls
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [sortBy, setSortBy] = useState<SortOption>("default");
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    // Filters
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    const [selectedBrand, setSelectedBrand] = useState<string | undefined>(undefined);
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
    const [selectedSubcategory, setSelectedSubcategory] = useState<number | undefined>(undefined);

    // Data states
    const [allProducts, setAllProducts] = useState<Product[]>([]); // Full filtered list from server
    const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]); // Sorted + paginated

    // Total count for UI
    const totalElements = allProducts.length;
    const totalPages = Math.ceil(totalElements / itemsPerPage);

    // ──────────────────────────────
    // 1. Fetch filtered products (only when filters change)
    // ──────────────────────────────
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                setError(null);

                const response = await getProducts({
                    page: 0,
                    size: 9999, // Get as many as reasonable (adjust if needed)
                    brand: selectedBrand,
                    categoryId: selectedCategory,
                    subcategoryId: selectedSubcategory,
                    minPrice,
                    maxPrice
                    // No sortBy → we sort locally
                });

                const products = response.content || [];
                console.log("Products fetched");
                setAllProducts(products);
                setCurrentPage(1); // Reset page on filter change
            } catch (err) {
                setError("Failed to load products. Please try again later.");
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedBrand, selectedCategory, selectedSubcategory, minPrice, maxPrice]);

    // ──────────────────────────────
    // 2. Sort + paginate locally (instant!)
    // ──────────────────────────────
    useEffect(() => {
        let sorted = [...allProducts];

        switch (sortBy) {
            case "popularity":
                // If you have popularity field, use it; otherwise fallback
                sorted.sort((a, b) => b.id - a.id); // or add popularity field later
                break;
            case "latest":
                sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case "price-low":
                sorted.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                sorted.sort((a, b) => b.price - a.price);
                break;
            case "default":
            default:
                // Keep original server order
                break;
        }

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        setDisplayedProducts(sorted.slice(start, end));
    }, [allProducts, sortBy, currentPage, itemsPerPage]);

    // ──────────────────────────────
    // Handlers
    // ──────────────────────────────
    const handleSortChange = (newSort: SortOption) => {
        setSortBy(newSort);
        setCurrentPage(1);
    };

    // ──────────────────────────────
    // Render
    // ──────────────────────────────
    if (loading) {
        return (
            <div className="text-center py-5">
                <output aria-live="polite" aria-busy="true">
                    <div className="spinner-border">
                        <span className="sr-only">Loading products...</span>
                    </div>
                </output>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger text-center">{error}</div>;
    }

    return (
        <>
            <ShopBreadcrumb />

            <div className="container">
                <div className="row mb-8">
                    <ShopSidebar
                        isOpen={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                        onApplyFilters={({ brands, priceRange, categoryId, subcategoryId }) => {
                            setSelectedBrand(brands.length > 0 ? brands.join(",") : undefined);
                            setMinPrice(priceRange?.min);
                            setMaxPrice(priceRange?.max);
                            setSelectedCategory(categoryId);
                            setSelectedSubcategory(subcategoryId);
                            setCurrentPage(1);
                        }}
                    />

                    <div className="col-xl-9 col-wd-9gdot5">
                        <div className="flex-center-between mb-3">
                            <h3 className="font-size-25 mb-0">Shop</h3>
                            <p className="font-size-14 text-gray-90 mb-0">
                                Showing {totalElements === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–
                                {Math.min(currentPage * itemsPerPage, totalElements)} of {totalElements} results
                            </p>
                        </div>

                        <ShopControlBar
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                            sortBy={sortBy}
                            onSortChange={handleSortChange}
                            itemsPerPage={itemsPerPage}
                            onItemsPerPageChange={setItemsPerPage}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                        />

                        <ProductGrid products={displayedProducts} viewMode={viewMode} />

                        {totalPages > 1 && (
                            <ShopPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalElements}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Shop;
