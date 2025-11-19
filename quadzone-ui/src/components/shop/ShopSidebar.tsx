import { useState, useEffect } from "react";
import type { Category, Brand } from "../../types/Product";
import { getCategories, getBrands } from "../../api/products";
import PriceRangeSlider from "../../components/shop/PriceRangeSlider";

interface ShopSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onPriceFilter?: (range: { min: number; max: number }) => void;
    onBrandFilter?: (brand: string) => void;
    onCategoryFilter?: (categoryId: number, subcategoryId?: number) => void;
}

interface SidebarContentProps {
    categories: Category[];
    expandedCategories: { [key: number]: boolean };
    toggleCategory: (index: number) => void;
    brands: Brand[];
    showMoreBrands: boolean;
    setShowMoreBrands: (v: boolean) => void;
    showMoreCategories: boolean;
    setShowMoreCategories: (v: boolean) => void;
    handleFilter: (range: { min: number; max: number }) => void;
    onBrandFilter?: (brand: string) => void;
    onCategoryFilter?: (categoryId: number, subcategoryId?: number) => void;
}

const ShopSidebar = ({ isOpen, onClose, onPriceFilter, onBrandFilter, onCategoryFilter }: ShopSidebarProps) => {
    const [expandedCategories, setExpandedCategories] = useState<{ [k: number]: boolean }>({});
    const [showMoreBrands, setShowMoreBrands] = useState(false);
    const [showMoreCategories, setShowMoreCategories] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            try {
                const [cats, brs] = await Promise.all([getCategories(), getBrands()]);
                if (!mounted) return;

                setCategories(cats);
                setBrands(brs);
            } catch (err) {
                console.error("Error loading sidebar data", err);
            }
        };

        fetchData();
        return () => {
            mounted = false;
        };
    }, []);

    const toggleCategory = (index: number) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const handleFilter = (range: { min: number; max: number }) => {
        if (onPriceFilter) {
            onPriceFilter(range);
        }
    };

    return (
        <>
            {/* Desktop */}
            <div className="d-none d-xl-block col-xl-3 col-wd-2gdot5">
                <SidebarContent
                    categories={categories}
                    expandedCategories={expandedCategories}
                    toggleCategory={toggleCategory}
                    brands={brands}
                    showMoreBrands={showMoreBrands}
                    setShowMoreBrands={setShowMoreBrands}
                    showMoreCategories={showMoreCategories}
                    setShowMoreCategories={setShowMoreCategories}
                    handleFilter={handleFilter}
                    onBrandFilter={onBrandFilter}
                    onCategoryFilter={onCategoryFilter}
                />
            </div>

            {/* Mobile */}
            {isOpen && (
                <div className="d-xl-none">
                    <div
                        onClick={onClose}
                        className="position-fixed top-0 left-0 right-0 bottom-0 bg-dark"
                        style={{ opacity: 0.5, zIndex: 999 }}
                    />

                    <div
                        className="position-fixed top-0 left-0 bottom-0 bg-white p-4"
                        style={{ width: "300px", zIndex: 1000, overflowY: "auto" }}>
                        <button className="btn btn-sm btn-icon btn-soft-secondary mb-3" onClick={onClose}>
                            <i className="fas fa-times"></i>
                        </button>

                        <SidebarContent
                            categories={categories}
                            expandedCategories={expandedCategories}
                            toggleCategory={toggleCategory}
                            brands={brands}
                            showMoreBrands={showMoreBrands}
                            setShowMoreBrands={setShowMoreBrands}
                            showMoreCategories={showMoreCategories}
                            setShowMoreCategories={setShowMoreCategories}
                            handleFilter={handleFilter}
                            onBrandFilter={onBrandFilter}
                            onCategoryFilter={onCategoryFilter}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ShopSidebar;

/* -------------------- SidebarContent Component -------------------- */
const SidebarContent = ({
    categories,
    expandedCategories,
    toggleCategory,
    brands,
    showMoreBrands,
    setShowMoreBrands,
    showMoreCategories,
    setShowMoreCategories,
    handleFilter,
    onBrandFilter,
    onCategoryFilter
}: SidebarContentProps) => {
    return (
        <>
            {/* Categories */}
            <div className="mb-6 border border-width-2 border-color-3 borders-radius-6">
                <ul id="sidebarNav" className="list-unstyled mb-0 sidebar-navbar view-all">
                    <li>
                        <div className="dropdown-title">Browse Categories</div>
                    </li>

                    {categories.length === 0 && <li className="text-muted small px-2">No categories found</li>}

                    {(showMoreCategories ? categories : categories.slice(0, 5)).map((category, index) => (
                        <li key={category.id}>
                            <button
                                type="button"
                                className="dropdown-toggle dropdown-toggle-collapse btn-reset"
                                onClick={() => toggleCategory(index)}>
                                {category.name}
                            </button>

                            {expandedCategories[index] && category.subCategories?.length > 0 && (
                                <div className="collapse show">
                                    <ul className="list-unstyled dropdown-list">
                                        {category.subCategories.map((sub) => (
                                            <li key={sub.id}>
                                                <button
                                                    type="button"
                                                    className="dropdown-item btn-reset"
                                                    onClick={() => onCategoryFilter?.(category.id, sub.id)}>
                                                    {sub.name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}

                    {categories.length > 5 && (
                        <li>
                            <button
                                type="button"
                                className="link small btn-reset mt-2"
                                onClick={() => setShowMoreCategories(!showMoreCategories)}>
                                {showMoreCategories ? "Show less" : "Show more"}
                            </button>
                        </li>
                    )}
                </ul>
            </div>

            {/* Filters */}
            <div className="mb-6">
                <div className="border-bottom mb-5">
                    <h3 className="section-title section-title__sm mb-0 pb-2 font-size-18">Filters</h3>
                </div>

                {/* Brands */}
                <div className="border-bottom pb-4 mb-4">
                    <h4 className="font-size-14 mb-3 font-weight-bold">Brands</h4>

                    {/* Checkboxes */}
                    {brands.slice(0, 5).map((brand) => (
                        <div
                            key={brand.brand}
                            className="form-group d-flex align-items-center justify-content-between mb-2 pb-1">
                            <div className="custom-control custom-checkbox">
                                <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id={`brand${brand.brand.replaceAll(/\s+/g, "")}`}
                                    onChange={() => onBrandFilter?.(brand.brand)}
                                />
                                <label
                                    className="custom-control-label"
                                    htmlFor={`brand${brand.brand.replaceAll(/\s+/g, "")}`}>
                                    {brand.brand}
                                </label>
                            </div>
                        </div>
                    ))}

                    {/* View More - Collapse */}
                    {brands.length > 5 && (
                        <div className={`collapse ${showMoreBrands ? "show" : ""}`} id="collapseBrand">
                            {brands.slice(5).map((brand) => (
                                <div
                                    key={brand.brand}
                                    className="form-group d-flex align-items-center justify-content-between mb-2 pb-1">
                                    <div className="custom-control custom-checkbox">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id={`brand${brand.brand.replaceAll(/\s+/g, "")}`}
                                            onChange={() => onBrandFilter?.(brand.brand)}
                                        />
                                        <label
                                            className="custom-control-label"
                                            htmlFor={`brand${brand.brand.replaceAll(/\s+/g, "")}`}>
                                            {brand.brand}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Link */}
                    {brands.length > 5 && (
                        <a
                            className="link link-collapse small font-size-13 text-gray-27 d-inline-flex mt-2"
                            href="#collapseBrand"
                            role="button"
                            aria-expanded={showMoreBrands}
                            aria-controls="collapseBrand"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowMoreBrands(!showMoreBrands);
                            }}>
                            <span className="link__icon text-gray-27 bg-white">
                                <span className="link__icon-inner">+</span>
                            </span>
                            <span className="link-collapse__default">Show more</span>
                            <span className="link-collapse__active">Show less</span>
                        </a>
                    )}
                </div>

                {/* Price Range Slider */}
                <PriceRangeSlider min={0} max={3456} onFilter={handleFilter} />
            </div>
        </>
    );
};