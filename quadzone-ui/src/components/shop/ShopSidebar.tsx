import { useState } from "react";
import { Link } from "react-router-dom";
import type { Category, Brand, Color, PriceRange, Product } from "../../types/shop";

interface ShopSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SidebarContentProps {
    categories: Category[];
    expandedCategories: { [key: number]: boolean };
    toggleCategory: (index: number) => void;
    brands: Brand[];
    showMoreBrands: boolean;
    setShowMoreBrands: (show: boolean) => void;
    colors: Color[];
    showMoreColors: boolean;
    setShowMoreColors: (show: boolean) => void;
    priceRange: PriceRange;
}

const categories: Category[] = [
    {
        name: "Accessories",
        count: 56,
        subcategories: [
            { name: "Accessories", count: 56 },
            { name: "Cameras & Photography", count: 11 },
            { name: "Computer Components", count: 22 },
            { name: "Gadgets", count: 5 },
            { name: "Home Entertainment", count: 7 },
            { name: "Laptops & Computers", count: 42 },
            { name: "Printers & Ink", count: 63 },
            { name: "Smart Phones & Tablets", count: 11 },
            { name: "TV & Audio", count: 66 },
            { name: "Video Games & Consoles", count: 31 }
        ]
    },
    { name: "Cameras & Photography", count: 56, subcategories: [{ name: "Cameras", count: 56 }] },
    { name: "Computer Components", count: 56, subcategories: [{ name: "Computer Cases", count: 56 }] },
    {
        name: "Gadgets",
        count: 56,
        subcategories: [
            { name: "Smartwatches", count: 56 },
            { name: "Wearables", count: 56 }
        ]
    },
    { name: "Home Entertainment", count: 56, subcategories: [{ name: "Tvs", count: 56 }] },
    { name: "Laptops & Computers", count: 56, subcategories: [] },
    { name: "Printers & Ink", count: 56, subcategories: [{ name: "Printers", count: 56 }] },
    {
        name: "Smart Phones & Tablets",
        count: 56,
        subcategories: [
            { name: "Smartphones", count: 56 },
            { name: "Tablets", count: 56 }
        ]
    },
    { name: "TV & Audio", count: 56, subcategories: [{ name: "Audio Speakers", count: 56 }] },
    { name: "Video Games & Consoles", count: 56, subcategories: [{ name: "Game Consoles", count: 56 }] }
];

const brands: Brand[] = [
    { id: "brandAdidas", name: "Adidas", count: 56 },
    { id: "brandNewBalance", name: "New Balance", count: 56 },
    { id: "brandNike", name: "Nike", count: 56 },
    { id: "brandFredPerry", name: "Fred Perry", count: 56 },
    { id: "brandTnf", name: "The North Face", count: 56 },
    { id: "brandGucci", name: "Gucci", count: 56, hidden: true },
    { id: "brandMango", name: "Mango", count: 56, hidden: true }
];

const colors: Color[] = [
    { id: "colorBlack", name: "Black", count: 56 },
    { id: "colorBlackLeather", name: "Black Leather", count: 56 },
    { id: "colorBlackRed", name: "Black with Red", count: 56 },
    { id: "colorGold", name: "Gold", count: 56 },
    { id: "colorSpacegrey", name: "Spacegrey", count: 56 },
    { id: "colorTurquoise", name: "Turquoise", count: 56, hidden: true },
    { id: "colorWhite", name: "White", count: 56, hidden: true },
    { id: "colorWhiteGold", name: "White with Gold", count: 56, hidden: true }
];

const ShopSidebar = ({ isOpen, onClose }: ShopSidebarProps) => {
    const [expandedCategories, setExpandedCategories] = useState<{ [key: number]: boolean }>({});
    const [showMoreBrands, setShowMoreBrands] = useState<boolean>(false);
    const [showMoreColors, setShowMoreColors] = useState<boolean>(false);
    const [priceRange] = useState<PriceRange>({ min: 0, max: 3456 });

    const toggleCategory = (index: number) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <>
            <div className={`d-none d-xl-block col-xl-3 col-wd-2gdot5`}>
                <SidebarContent
                    categories={categories}
                    expandedCategories={expandedCategories}
                    toggleCategory={toggleCategory}
                    brands={brands}
                    showMoreBrands={showMoreBrands}
                    setShowMoreBrands={setShowMoreBrands}
                    colors={colors}
                    showMoreColors={showMoreColors}
                    setShowMoreColors={setShowMoreColors}
                    priceRange={priceRange}
                />
            </div>

            {/* Mobile Sidebar */}
            {isOpen && (
                <div className="d-xl-none">
                    <div
                        className="position-fixed top-0 left-0 right-0 bottom-0 bg-dark"
                        style={{ opacity: 0.5, zIndex: 999 }}
                        onClick={onClose}
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
                            colors={colors}
                            showMoreColors={showMoreColors}
                            setShowMoreColors={setShowMoreColors}
                            priceRange={priceRange}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

const SidebarContent = ({
    categories,
    expandedCategories,
    toggleCategory,
    brands,
    showMoreBrands,
    setShowMoreBrands,
    colors,
    showMoreColors,
    setShowMoreColors,
    priceRange,
    
}: SidebarContentProps) => {
    return (
        <>
            {/* Categories */}
            <div className="mb-6 border border-width-2 border-color-3 borders-radius-6">
                <ul id="sidebarNav" className="list-unstyled mb-0 sidebar-navbar view-all">
                    <li>
                        <div className="dropdown-title">Browse Categories</div>
                    </li>
                    {categories.map((category, index) => (
                        <li key={index}>
                            <a
                                className="dropdown-toggle dropdown-toggle-collapse"
                                href="javascript:;"
                                role="button"
                                onClick={() => toggleCategory(index)}>
                                {category.name}
                                <span className="text-gray-25 font-size-12 font-weight-normal">
                                    {" "}
                                    ({category.count})
                                </span>
                            </a>
                            {expandedCategories[index] && category.subcategories.length > 0 && (
                                <div className="collapse show">
                                    <ul className="list-unstyled dropdown-list">
                                        {category.subcategories.map((sub, subIndex) => (
                                            <li key={subIndex}>
                                                <Link className="dropdown-item" to="#">
                                                    {sub.name}
                                                    <span className="text-gray-25 font-size-12 font-weight-normal">
                                                        {" "}
                                                        ({sub.count})
                                                    </span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Filters */}
            <div className="mb-6">
                <div className="border-bottom border-color-1 mb-5">
                    <h3 className="section-title section-title__sm mb-0 pb-2 font-size-18">Filters</h3>
                </div>

                {/* Brands */}
                <div className="border-bottom pb-4 mb-4">
                    <h4 className="font-size-14 mb-3 font-weight-bold">Brands</h4>
                    {brands
                        .filter((b) => !b.hidden || showMoreBrands)
                        .map((brand) => (
                            <div
                                key={brand.id}
                                className="form-group d-flex align-items-center justify-content-between mb-2 pb-1">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id={brand.id} />
                                    <label className="custom-control-label" htmlFor={brand.id}>
                                        {brand.name}
                                        <span className="text-gray-25 font-size-12 font-weight-normal">
                                            {" "}
                                            ({brand.count})
                                        </span>
                                    </label>
                                </div>
                            </div>
                        ))}
                    <a
                        className="link link-collapse small font-size-13 text-gray-27 d-inline-flex mt-2"
                        href="javascript:;"
                        onClick={() => setShowMoreBrands(!showMoreBrands)}>
                        <span className="link__icon text-gray-27 bg-white">
                            <span className="link__icon-inner">+</span>
                        </span>
                        <span>{showMoreBrands ? "Show less" : "Show more"}</span>
                    </a>
                </div>

                {/* Colors */}
                <div className="border-bottom pb-4 mb-4">
                    <h4 className="font-size-14 mb-3 font-weight-bold">Color</h4>
                    {colors
                        .filter((c) => !c.hidden || showMoreColors)
                        .map((color) => (
                            <div
                                key={color.id}
                                className="form-group d-flex align-items-center justify-content-between mb-2 pb-1">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id={color.id} />
                                    <label className="custom-control-label" htmlFor={color.id}>
                                        {color.name}
                                        <span className="text-gray-25 font-size-12 font-weight-normal">
                                            {" "}
                                            ({color.count})
                                        </span>
                                    </label>
                                </div>
                            </div>
                        ))}
                    <a
                        className="link link-collapse small font-size-13 text-gray-27 d-inline-flex mt-2"
                        href="javascript:;"
                        onClick={() => setShowMoreColors(!showMoreColors)}>
                        <span className="link__icon text-gray-27 bg-white">
                            <span className="link__icon-inner">+</span>
                        </span>
                        <span>{showMoreColors ? "Show less" : "Show more"}</span>
                    </a>
                </div>

                {/* Price Range */}
                <div className="range-slider">
                    <h4 className="font-size-14 mb-3 font-weight-bold">Price</h4>
                    <div className="mt-1 text-gray-111 d-flex mb-4">
                        <span className="mr-0dot5">Price: </span>
                        <span>$</span>
                        <span>{priceRange.min}</span>
                        <span className="mx-0dot5"> — </span>
                        <span>$</span>
                        <span>{priceRange.max}</span>
                    </div>
                    <button type="submit" className="btn px-4 btn-primary-dark-w py-2 rounded-lg">
                        Filter
                    </button>
                </div>
            </div>
        </>
    );
};

export default ShopSidebar;
