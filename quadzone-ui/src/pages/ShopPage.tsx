// src/pages/Shop.tsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ShopBreadcrumb from "../components/shop/ShopBreadcrumb";
import ShopSidebar from "../components/shop/ShopSidebar";
import ShopControlBar from "../components/shop/ShopControlBar";
import ProductGrid from "../components/shop/ProductGrid";
import ShopPagination from "../components/shop/ShopPagination";
import { getProducts } from "../api/products";
import type { Product } from "../api/types";
import type { ViewMode, SortOption } from "../types/shop";

const Shop: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Get search query from URL params
    const searchQuery = searchParams.get("search") || "";

    // Loading & error
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // UI controls
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [sortBy, setSortBy] = useState<SortOption>("default");
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    // Filters - Updated to support multiple brands
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]); // Changed to array
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
    const [selectedSubcategory, setSelectedSubcategory] = useState<number | undefined>(undefined);
    const [clearFilterTrigger, setClearFilterTrigger] = useState<number>(0); // Trigger to clear sidebar

    // Data states
    const [allProducts, setAllProducts] = useState<Product[]>([]); // Current page products from server
    const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]); // Products to display
    const [totalElements, setTotalElements] = useState<number>(0); // Total count for pagination
    const [totalPages, setTotalPages] = useState<number>(0); // Total pages from server

    // ──────────────────────────────
    // 1. Fetch filtered & sorted products
    // ──────────────────────────────
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                setError(null);

                // Map local sortBy to backend sortBy parameter
                let backendSortBy: string | undefined = undefined;
                switch (sortBy) {
                    case "price-low":
                        backendSortBy = "price:asc";
                        break;
                    case "price-high":
                        backendSortBy = "price:desc";
                        break;
                    case "latest":
                        backendSortBy = "createdAt:desc";
                        break;
    
                    case "default":
                    default:
                        backendSortBy = undefined;
                }

                const response = await getProducts({
                    page: currentPage - 1, // Convert to 0-based
                    size: itemsPerPage,
                    search: searchQuery || undefined,
                    brand: selectedBrands.length > 0 ? selectedBrands.join(",") : undefined,
                    categoryId: selectedCategory,
                    subcategoryId: selectedSubcategory,
                    minPrice,
                    maxPrice,
                    sortBy: backendSortBy
                });

                const products = response.content || [];
                console.log(`Products fetched: ${products.length} items`);
                setAllProducts(products);
                setDisplayedProducts(products);
                setTotalElements(response.page?.totalElements || 0);
                setTotalPages(response.page?.totalPages || 0);
            } catch (err) {
                setError("Failed to load products. Please try again later.");
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchQuery, selectedBrands, selectedCategory, selectedSubcategory, minPrice, maxPrice, sortBy, currentPage, itemsPerPage]);

    // ──────────────────────────────
    // Handlers
    // ──────────────────────────────
    const handleSortChange = (newSort: SortOption) => {
        setSortBy(newSort);
        // Don't reset page - let backend handle sorting on current page
    };

    const handleApplyFilters = ({ brands, priceRange, categoryId, subcategoryId }: {
        brands: string[];
        priceRange: { min: number; max: number } | null;
        categoryId?: number;
        subcategoryId?: number;
    }) => {
        setSelectedBrands(brands);
        setMinPrice(priceRange?.min);
        setMaxPrice(priceRange?.max);
        setSelectedCategory(categoryId);
        setSelectedSubcategory(subcategoryId);
        setCurrentPage(1); // Reset to page 1 when filters change
    };

    const handleRemoveBrand = (brand: string) => {
        const newBrands = selectedBrands.filter(b => b !== brand);
        setSelectedBrands(newBrands);
    };

    const handleClearAllFilters = () => {
        setSelectedBrands([]);
        setMinPrice(undefined);
        setMaxPrice(undefined);
        setSelectedCategory(undefined);
        setSelectedSubcategory(undefined);
        setCurrentPage(1);
        setClearFilterTrigger((prev) => prev + 1); // Trigger sidebar to clear its state
        // Clear the search parameter from URL
        navigate("/shop");
    };

    // ──────────────────────────────
    // Render
    // ──────────────────────────────
    if (loading && allProducts.length === 0) {
        return (
            <div className="text-center py-5">
                <output aria-live="polite" aria-busy="true">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading products...</span>
                    </div>
                </output>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger text-center">{error}</div>
            </div>
        );
    }

    return (
        <>
            <ShopBreadcrumb />

            <div className="container">
                <div className="row mb-8">
                    <ShopSidebar
                        isOpen={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                        onApplyFilters={handleApplyFilters}
                        onClearAll={handleClearAllFilters}
                        clearTrigger={clearFilterTrigger}
                    />

                    <div className="col-xl-9 col-wd-9gdot5">
                        {/* Header */}
                        <div className="flex-center-between mb-3">
                            <h3 className="font-size-25 mb-0">Shop</h3>
                            <p className="font-size-14 text-gray-90 mb-0">
                                Showing {totalElements === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–
                                {Math.min(currentPage * itemsPerPage, totalElements)} of {totalElements} results
                            </p>
                        </div>

                        {/* Active Filters Display */}
                        {(selectedBrands.length > 0 || selectedCategory || minPrice !== undefined || maxPrice !== undefined) && (
                            <div className="mb-4 p-3 bg-light rounded">
                                <div className="d-flex flex-wrap align-items-center gap-2">
                                    <span className="font-weight-bold mr-2">Active Filters:</span>
                                    
                                    {/* Brand Badges */}
                                    {selectedBrands.map(brand => (
                                        <span key={brand} className="badge badge-primary badge-pill px-3 py-2">
                                            Brand: {brand}
                                            <button
                                                type="button"
                                                className="close ml-2"
                                                style={{ fontSize: '0.875rem', color: 'white' }}
                                                onClick={() => handleRemoveBrand(brand)}
                                                aria-label={`Remove ${brand} filter`}>
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                    
                                    {/* Category Badge */}
                                    {selectedCategory && (
                                        <span className="badge badge-info badge-pill px-3 py-2">
                                            Category Filter Active
                                            <button
                                                type="button"
                                                className="close ml-2"
                                                style={{ fontSize: '0.875rem', color: 'white' }}
                                                onClick={() => {
                                                    setSelectedCategory(undefined);
                                                    setSelectedSubcategory(undefined);
                                                }}
                                                aria-label="Remove category filter">
                                                ×
                                            </button>
                                        </span>
                                    )}
                                    
                                    {/* Price Range Badge */}
                                    {(minPrice !== undefined || maxPrice !== undefined) && (
                                        <span className="badge badge-success badge-pill px-3 py-2">
                                            Price: ${minPrice ?? 0} - ${maxPrice ?? '∞'}
                                            <button
                                                type="button"
                                                className="close ml-2"
                                                style={{ fontSize: '0.875rem', color: 'white' }}
                                                onClick={() => {
                                                    setMinPrice(undefined);
                                                    setMaxPrice(undefined);
                                                }}
                                                aria-label="Remove price filter">
                                                ×
                                            </button>
                                        </span>
                                    )}
                                    
                                    {/* Clear All Button */}
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-soft-secondary ml-2"
                                        onClick={handleClearAllFilters}>
                                        Clear All Filters
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Control Bar */}
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

                        {/* Loading State (when refetching) */}
                        {loading && (
                            <div className="text-center py-4">
                                <div className="spinner-border spinner-border-sm text-primary" role="status">
                                    <span className="sr-only">Updating products...</span>
                                </div>
                            </div>
                        )}

                        {/* Product Grid */}
                        {!loading && displayedProducts.length > 0 && (
                            <ProductGrid products={displayedProducts} viewMode={viewMode} />
                        )}

                        {/* Empty State */}
                        {!loading && displayedProducts.length === 0 && totalElements === 0 && (
                            <div className="text-center py-5">
                                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                                <h4 className="mb-3">No products found</h4>
                                <p className="text-muted mb-4">
                                    Try adjusting your filters or search terms
                                </p>
                                {(selectedBrands.length > 0 || selectedCategory || minPrice || maxPrice) && (
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleClearAllFilters}>
                                        Clear All Filters
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && totalPages > 1 && (
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