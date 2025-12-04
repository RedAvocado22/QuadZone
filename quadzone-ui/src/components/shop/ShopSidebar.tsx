// src/components/shop/ShopSidebar.tsx
import { useState, useEffect } from "react";
import type { PublicCategoryDTO, PublicBrandDTO } from "../../api/types";
import { getCategories, getBrands } from "../../api/products";
import PriceRangeSlider from "../../components/shop/PriceRangeSlider";

interface ShopSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyFilters: (filters: {
        brands: string[];
        priceRange: { min: number; max: number } | null;
        categoryId?: number;
        subcategoryId?: number;
    }) => void;
    onClearAll?: () => void;
    clearTrigger?: number; // Trigger from parent to clear sidebar state
}

const ShopSidebar: React.FC<ShopSidebarProps> = ({ isOpen, onClose, onApplyFilters, onClearAll, clearTrigger }) => {
    const [categories, setCategories] = useState<PublicCategoryDTO[]>([]);
    const [brands, setBrands] = useState<PublicBrandDTO[]>([]);
    const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});
    const [resetTrigger, setResetTrigger] = useState<number>(0);

    // Local pending filters
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | undefined>();

    const [showMoreBrands, setShowMoreBrands] = useState(false);
    const [showMoreCategories, setShowMoreCategories] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cats, brs] = await Promise.all([getCategories(), getBrands()]);
                setCategories(cats);
                setBrands(brs);
            } catch (err) {
                console.error("Error loading sidebar data", err);
            }
        };
        fetchData();
    }, []);

    // Watch for clear trigger from parent (e.g., "Clear All Filters" button clicked)
    useEffect(() => {
        if (clearTrigger !== undefined && clearTrigger > 0) {
            setSelectedBrands([]);
            setPriceRange(null);
            setSelectedCategoryId(undefined);
            setSelectedSubcategoryId(undefined);
            setResetTrigger((prev) => prev + 1);
        }
    }, [clearTrigger]);

    const toggleCategory = (index: number) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const toggleBrand = (brand: string) => {
        setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]));
    };

    const handleCategorySelect = (categoryId: number, subcategoryId?: number) => {
        setSelectedCategoryId(categoryId);
        setSelectedSubcategoryId(subcategoryId);
    };

    const handleApply = () => {
        onApplyFilters({
            brands: selectedBrands,
            priceRange,
            categoryId: selectedCategoryId,
            subcategoryId: selectedSubcategoryId
        });
    };

    const handleClear = () => {
        setSelectedBrands([]);
        setPriceRange(null);
        setSelectedCategoryId(undefined);
        setSelectedSubcategoryId(undefined);
        setResetTrigger((prev) => prev + 1);

        // Also notify parent to clear filters
        onApplyFilters({
            brands: [],
            priceRange: null,
            categoryId: undefined,
            subcategoryId: undefined
        });

        // Call onClearAll if provided to also clear search parameter
        onClearAll?.();
    };

    const handlePriceFilter = (range: { min: number; max: number }) => {
        setPriceRange(range);
        // Immediately apply price filter to parent without waiting for Apply button
        onApplyFilters({
            brands: selectedBrands,
            priceRange: range,
            categoryId: selectedCategoryId,
            subcategoryId: selectedSubcategoryId
        });
    };

    return (
        <>
            {/* Desktop */}
            <div className="d-none d-xl-block col-xl-3 col-wd-2gdot5">
                <SidebarContent
                    categories={categories}
                    brands={brands}
                    expandedCategories={expandedCategories}
                    toggleCategory={toggleCategory}
                    selectedBrands={selectedBrands}
                    toggleBrand={toggleBrand}
                    showMoreBrands={showMoreBrands}
                    setShowMoreBrands={setShowMoreBrands}
                    showMoreCategories={showMoreCategories}
                    setShowMoreCategories={setShowMoreCategories}
                    onPriceFilter={handlePriceFilter}
                    onCategorySelect={handleCategorySelect}
                    selectedCategoryId={selectedCategoryId}
                    selectedSubcategoryId={selectedSubcategoryId}
                    onApply={handleApply}
                    onClear={handleClear}
                    resetTrigger={resetTrigger}
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
                            brands={brands}
                            expandedCategories={expandedCategories}
                            toggleCategory={toggleCategory}
                            selectedBrands={selectedBrands}
                            toggleBrand={toggleBrand}
                            showMoreBrands={showMoreBrands}
                            setShowMoreBrands={setShowMoreBrands}
                            showMoreCategories={showMoreCategories}
                            setShowMoreCategories={setShowMoreCategories}
                            onPriceFilter={handlePriceFilter}
                            onCategorySelect={handleCategorySelect}
                            selectedCategoryId={selectedCategoryId}
                            selectedSubcategoryId={selectedSubcategoryId}
                            onApply={() => {
                                handleApply();
                                onClose();
                            }}
                            onClear={handleClear}
                            resetTrigger={resetTrigger}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ShopSidebar;

/* ===================== SidebarContent ===================== */
interface SidebarContentProps {
    categories: PublicCategoryDTO[];
    brands: PublicBrandDTO[];
    expandedCategories: Record<number, boolean>;
    toggleCategory: (index: number) => void;
    selectedBrands: string[];
    toggleBrand: (brand: string) => void;
    showMoreBrands: boolean;
    setShowMoreBrands: (v: boolean) => void;
    showMoreCategories: boolean;
    setShowMoreCategories: (v: boolean) => void;
    onPriceFilter: (range: { min: number; max: number }) => void;
    onCategorySelect: (categoryId: number, subcategoryId?: number) => void;
    selectedCategoryId?: number;
    selectedSubcategoryId?: number;
    onApply: () => void;
    onClear: () => void;
    resetTrigger: number;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
    categories,
    brands,
    expandedCategories,
    toggleCategory,
    selectedBrands,
    toggleBrand,
    showMoreBrands,
    setShowMoreBrands,
    showMoreCategories,
    setShowMoreCategories,
    onPriceFilter,
    onCategorySelect,
    selectedCategoryId,
    selectedSubcategoryId,
    onApply,
    onClear,
    resetTrigger
}) => {
    return (
        <>
            {/* Categories */}
            <div className="mb-6 ">
                <ul id="sidebarNav" className="list-unstyled mb-0 sidebar-navbar view-all">
                    <li>
                        <div className="dropdown-title">Browse Categories</div>
                    </li>

                    {(showMoreCategories ? categories : categories.slice(0, 5)).map((category, index) => (
                        <li key={category.id}>
                            <button
                                type="button"
                                className={`dropdown-toggle dropdown-toggle-collapse btn-reset border-0 bg-transparent ${
                                    selectedCategoryId === category.id && !selectedSubcategoryId
                                        ? "text-primary font-weight-bold"
                                        : ""
                                }`}
                                onClick={() => {
                                    toggleCategory(index);
                                    // Also select the category when clicking the header
                                    onCategorySelect(category.id, undefined);
                                }}>
                                {category.name}
                                {selectedCategoryId === category.id && !selectedSubcategoryId && (
                                    <span className="ml-2">✓</span>
                                )}
                            </button>

                            {expandedCategories[index] && category.subCategories?.length > 0 && (
                                <div className="collapse show">
                                    <ul className="list-unstyled dropdown-list">
                                        {category.subCategories.map((sub) => (
                                            <li key={sub.id}>
                                                <button
                                                    type="button"
                                                    className={`dropdown-item btn-reset ${
                                                        selectedSubcategoryId === sub.id
                                                            ? "text-primary font-weight-bold"
                                                            : ""
                                                    }`}
                                                    onClick={() => onCategorySelect(category.id, sub.id)}>
                                                    {sub.name}
                                                    {selectedSubcategoryId === sub.id && (
                                                        <span className="ml-2">✓</span>
                                                    )}
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

            {/* Filters Section */}
            <div className="mb-6">
                <div className="border-bottom mb-5 pb-3">
                    <h3 className="section-title section-title__sm mb-0 pb-2 font-size-18">Filters</h3>
                </div>

                {/* Brands */}
                <div className="border-bottom pb-4 mb-4">
                    <h4 className="font-size-14 mb-3 font-weight-bold">Brands</h4>

                    {(showMoreBrands ? brands : brands.slice(0, 5)).map((brand, index) => {
                        const brandName = brand.brand?.trim() || `Brand ${index + 1}`;
                        const safeId = `brand-${brandName.replaceAll(/\s+/g, "-").toLowerCase()}-${index}`;

                        return (
                            <div
                                key={safeId}
                                className="form-group d-flex align-items-center justify-content-between mb-2 pb-1">
                                <div className="custom-control custom-checkbox">
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id={safeId}
                                        checked={selectedBrands.includes(brandName)}
                                        onChange={() => toggleBrand(brandName)}
                                    />
                                    <label className="custom-control-label" htmlFor={safeId}>
                                        {brandName}
                                    </label>
                                </div>
                            </div>
                        );
                    })}

                    {brands.length > 5 && (
                        <a
                            href="#"
                            className="link link-collapse small font-size-13 text-gray-27 d-inline-flex mt-2"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowMoreBrands(!showMoreBrands);
                            }}>
                            <span className="link__icon text-gray-27 bg-white">
                                <span className="link__icon-inner">{showMoreBrands ? "-" : "+"}</span>
                            </span>

                            <span className="ml-1">{showMoreBrands ? "Show less" : "Show more"}</span>
                        </a>
                    )}
                </div>

                {/* Price Range */}
                <PriceRangeSlider min={0} max={5000} onFilter={onPriceFilter} resetTrigger={resetTrigger} />

                {/* Apply & Clear Buttons */}
                <div className="mt-5 d-flex gap-3">
                    <button onClick={onApply} className="btn btn-primary transition-3d-hover height-60px flex-grow-1">
                        Apply
                    </button>

                    <button
                        onClick={onClear}
                        className="btn btn-soft-secondary transition-3d-hover height-60px flex-grow-1">
                        Clear All
                    </button>
                </div>
            </div>
        </>
    );
};
