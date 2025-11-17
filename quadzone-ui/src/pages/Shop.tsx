import { useState, useEffect } from "react";
import ShopBreadcrumb from "../components/shop/ShopBreadcrumb";
import ShopSidebar from "../components/shop/ShopSidebar";
import ShopControlBar from "../components/shop/ShopControlBar";
import ProductGrid from "../components/shop/ProductGrid";
import ShopPagination from "../components/shop/ShopPagination";
import { getProducts } from "../api/products";
import type { Product, ViewMode, SortOption } from "../types/shop";

const Shop: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [sortBy, setSortBy] = useState<SortOption>("default");
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                setError(null);
                // Fetch products with pagination
                const response = await getProducts({
                    page: currentPage - 1,
                    size: itemsPerPage
                });
                setProducts(response.content || []);
            } catch (err) {
                setError("Failed to load products. Please try again later.");
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [currentPage, itemsPerPage]);

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
                    <ShopSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                    {/* Main Content */}
                    <div className="col-xl-9 col-wd-9gdot5">
                        {/* Shop Control Bar Title */}
                        <div className="flex-center-between mb-3">
                            <h3 className="font-size-25 mb-0">Shop</h3>
                            <p className="font-size-14 text-gray-90 mb-0">
                                Showing 1–{products.length} of {products.length} results
                            </p>
                        </div>

                        {/* Shop Control Bar */}
                        <ShopControlBar
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                            itemsPerPage={itemsPerPage}
                            onItemsPerPageChange={setItemsPerPage}
                            currentPage={currentPage}
                            totalPages={products.length < itemsPerPage ? 1 : Math.ceil(products.length / itemsPerPage)}
                            onPageChange={setCurrentPage}
                            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                        />

                        {/* Product Grid */}
                        <ProductGrid products={products} viewMode={viewMode} />

                        {/* Pagination */}
                        <ShopPagination
                            currentPage={currentPage}
                            totalPages={products.length < itemsPerPage ? 1 : Math.ceil(products.length / itemsPerPage)}
                            totalItems={products.length}
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
