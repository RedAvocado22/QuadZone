import { useState, useEffect } from "react";
import ShopBreadcrumb from "../components/shop/ShopBreadcrumb";
import ShopSidebar from "../components/shop/ShopSidebar";
import ShopControlBar from "../components/shop/ShopControlBar";
import ProductGrid from "../components/shop/ProductGrid";
import ShopPagination from "../components/shop/ShopPagination";
import { getProducts } from "../api/products";
import type { Product } from "../types/Product";
import type { ViewMode, SortOption } from "../types/shop";

const Shop: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [sortBy, setSortBy] = useState<SortOption>("default");
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    
    // Filter state
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    const [selectedBrand, setSelectedBrand] = useState<string | undefined>(undefined);
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
    const [selectedSubcategory, setSelectedSubcategory] = useState<number | undefined>(undefined);

    // Convert SortOption to API sortBy format
    const getSortByParam = (sort: SortOption): string => {
        const sortMap: Record<SortOption, string> = {
            default: "",
            popularity: "popularity:desc",
            rating: "rating:desc",
            latest: "createdDate:desc",
            "price-low": "price:asc",
            "price-high": "price:desc"
        };
        return sortMap[sort];
    };

    // Handler functions
    const handlePriceFilter = (range: { min: number; max: number }) => {
        setMinPrice(range.min);
        setMaxPrice(range.max);
        setCurrentPage(1);
    };

    const handleBrandFilter = (brand: string) => {
        setSelectedBrand(brand === selectedBrand ? undefined : brand);
        setCurrentPage(1);
    };

    const handleCategoryFilter = (categoryId: number, subcategoryId?: number) => {
        setSelectedCategory(categoryId);
        setSelectedSubcategory(subcategoryId);
        setCurrentPage(1);
    };

    const handleSortChange = (newSort: SortOption) => {
        setSortBy(newSort);
        setCurrentPage(1);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                setError(null);
                // Fetch products with filters
                const response = await getProducts({
                    page: currentPage - 1,
                    size: itemsPerPage,
                    brand: selectedBrand,
                    categoryId: selectedCategory,
                    subcategoryId: selectedSubcategory,
                    minPrice: minPrice,
                    maxPrice: maxPrice,
                    sortBy: getSortByParam(sortBy)
                });
                setProducts(response.content || []);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            } catch (err) {
                setError("Failed to load products. Please try again later.");
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [currentPage, itemsPerPage, selectedBrand, selectedCategory, selectedSubcategory, minPrice, maxPrice, sortBy]);

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading products...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center" role="alert">
                {error}
            </div>
        );
    }

    return (
        <>
            {/* Breadcrumb */}
            <ShopBreadcrumb />

            <div className="container">
                <div className="row mb-8">
                    {/* Sidebar */}
                    <ShopSidebar
                        isOpen={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                        onPriceFilter={handlePriceFilter}
                        onBrandFilter={handleBrandFilter}
                        onCategoryFilter={handleCategoryFilter}
                    />

                    {/* Main Content */}
                    <div className="col-xl-9 col-wd-9gdot5">
                        {/* Shop Control Bar Title */}
                        <div className="flex-center-between mb-3">
                            <h3 className="font-size-25 mb-0">Shop</h3>
                            <p className="font-size-14 text-gray-90 mb-0">
                                Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(
                                    currentPage * itemsPerPage,
                                    totalElements
                                )}{" "}
                                of {totalElements} results
                            </p>
                        </div>

                        {/* Shop Control Bar */}
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

                        {/* Product Grid */}
                        <ProductGrid products={products} viewMode={viewMode} />

                        {/* Pagination */}
                        <ShopPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalElements}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Shop;
