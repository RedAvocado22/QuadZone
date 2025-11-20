// src/components/shop/ShopSidebar.tsx
import { useState, useEffect } from "react";
import type { Category, Brand } from "../../types/Product";
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
}

const ShopSidebar: React.FC<ShopSidebarProps> = ({ isOpen, onClose, onApplyFilters }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});

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

  const toggleCategory = (index: number) => {
    setExpandedCategories(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
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
  };

  const handlePriceFilter = (range: { min: number; max: number }) => {
    setPriceRange(range);
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
          onCategorySelect={(catId, subId) => {
            setSelectedCategoryId(catId);
            setSelectedSubcategoryId(subId);
          }}
          onApply={handleApply}
          onClear={handleClear}
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
              onCategorySelect={(catId, subId) => {
                setSelectedCategoryId(catId);
                setSelectedSubcategoryId(subId);
              }}
              onApply={() => {
                handleApply();
                onClose();
              }}
              onClear={handleClear}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ShopSidebar;

/* ===================== SidebarContent (your original style 100% preserved) ===================== */
interface SidebarContentProps {
  categories: Category[];
  brands: Brand[];
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
  onApply: () => void;
  onClear: () => void;
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
  onApply,
  onClear
}) => {
  return (
    <>
      {/* Categories - exactly your original code */}
      <div className="mb-6 border border-width-2 border-color-3 borders-radius-6">
        <ul id="sidebarNav" className="list-unstyled mb-0 sidebar-navbar view-all">
          <li>
            <div className="dropdown-title">Browse Categories</div>
          </li>

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
                          onClick={() => onCategorySelect(category.id, sub.id)}>
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

      {/* Filters Section */}
      <div className="mb-6">
        <div className="border-bottom mb-5 pb-3">
          <h3 className="section-title section-title__sm mb-0 pb-2 font-size-18">Filters</h3>
        </div>

        {/* Brands - now multi-select */}
        <div className="border-bottom pb-4 mb-4">
          <h4 className="font-size-14 mb-3 font-weight-bold">Brands</h4>

          {(showMoreBrands ? brands : brands.slice(0, 5)).map((brand) => (
            <div
              key={brand.brand}
              className="form-group d-flex align-items-center justify-content-between mb-2 pb-1">
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id={`brand${brand.brand.replace(/\s+/g, "")}`}
                  checked={selectedBrands.includes(brand.brand)}
                  onChange={() => toggleBrand(brand.brand)}
                />
                <label
                  className="custom-control-label"
                  htmlFor={`brand${brand.brand.replace(/\s+/g, "")}`}>
                  {brand.brand}
                </label>
              </div>
            </div>
          ))}

          {brands.length > 5 && (
            <a
              href="#collapseBrand"
              className="link link-collapse small font-size-13 text-gray-27 d-inline-flex mt-2"
              onClick={(e) => {
                e.preventDefault();
                setShowMoreBrands(!showMoreBrands);
              }}>
              <span className="link__icon text-gray-27 bg-white">
                <span className="link__icon-inner">{showMoreBrands ? "-" : "+"}</span>
              </span>
              <span className="link-collapse__default">Show more</span>
              <span className="link-collapse__active">Show less</span>
            </a>
          )}
        </div>

        {/* Price Range */}
        <PriceRangeSlider min={0} max={5000} onFilter={onPriceFilter} />

        {/* Apply & Clear Buttons - your style */}
        <div className="mt-5 d-flex gap-3">
          <button
            onClick={onApply}
            className="btn btn-primary btn-block transition-3d-hover height-60px">
            Apply Filters
          </button>
          <button
            onClick={onClear}
            className="btn btn-soft-secondary btn-block transition-3d-hover height-60px">
            Clear All
          </button>
        </div>
      </div>
    </>
  );
};