import { Link } from "react-router-dom";
import type { Product, ViewMode } from "../../types/shop";
import { useCart } from "../../contexts/CartContext";

interface ProductGridProps {
    products: Product[];
    viewMode: ViewMode;
}

const ProductGrid = ({ products, viewMode }: ProductGridProps) => {
  const { addToCart } = useCart();
    if (viewMode === "grid") {
        return <GridView products={products} addToCart={addToCart} />;
    } else if (viewMode === "grid-details") {
        return <GridDetailsView products={products} addToCart={addToCart} />;
    } else if (viewMode === "list") {
        return <ListView products={products} addToCart={addToCart} />;
    } else if (viewMode === "list-small") {
        return <ListSmallView products={products} addToCart={addToCart} />;
    }

    return <GridView products={products} addToCart={addToCart} />;
};

// Grid View (Default)
interface GridViewProps {
    products: Product[];
    addToCart: (product: any, quantity?: number) => void;
}

const GridView = ({ products, addToCart }: GridViewProps) => {
    return (
        <div className="tab-content pt-2">
            <ul className="row list-unstyled products-group no-gutters">
                {products.map((product, index) => (
                    <li
                        key={product.id}
                        className={`col-6 col-md-3 col-wd-2gdot4 product-item ${
                            (index + 1) % 4 === 0 ? "remove-divider-md-lg remove-divider-xl" : ""
                        } ${(index + 1) % 5 === 0 ? "remove-divider-wd" : ""}`}>
                        <div className="product-item__outer h-100">
                            <div className="product-item__inner px-xl-4 p-3">
                                <div className="product-item__body pb-xl-2">
                                    <div className="mb-2">
                                        <Link
                                            to={`/subCategory/${product.subCategory.id}`}
                                            className="font-size-12 text-gray-5">
                                            {product.category}
                                        </Link>
                                    </div>
                                    <h5 className="mb-1 product-item__title">
                                        <Link to={`/product/${product.id}`} className="text-blue font-weight-bold">
                                            {product.name}
                                        </Link>
                                    </h5>
                                    <div className="mb-2">
                                        <Link to={`/product/${product.id}`} className="d-block text-center">
                                            <img className="img-fluid" src={product.image} alt={product.name} />
                                        </Link>
                                    </div>
                                    <div className="flex-center-between mb-1">
                                        <div className="prodcut-price">
                                            {product.oldPrice ? (
                                                <div className="d-flex align-items-center position-relative">
                                                    <ins className="font-size-20 text-red text-decoration-none">
                                                        ${product.price.toFixed(2)}
                                                    </ins>
                                                    <del className="font-size-12 tex-gray-6 position-absolute bottom-100">
                                                        ${product.oldPrice.toFixed(2)}
                                                    </del>
                                                </div>
                                            ) : (
                                                <div className="text-gray-100">${product.price.toFixed(2)}</div>
                                            )}
                                        </div>
                                        <div className="d-none d-xl-block prodcut-add-cart">
                                            <button
                                                type="button"
                                                className="btn-add-cart btn-primary transition-3d-hover"
                                                onClick={() => addToCart(product)}
                                            >
                                                <i className="ec ec-add-to-cart"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Grid Details View
const GridDetailsView = ({ products, addToCart }: GridViewProps) => {
    return (
        <div className="tab-content pt-2">
            <ul className="row list-unstyled products-group no-gutters">
                {products.map((product) => (
                    <li key={product.id} className="col-6 col-md-3 col-wd-2gdot4 product-item">
                        <div className="product-item__outer h-100">
                            <div className="product-item__inner px-xl-4 p-3">
                                <div className="product-item__body pb-xl-2">
                                    <div className="mb-2">
                                        <Link to="#" className="font-size-12 text-gray-5">
                                            {product.category}
                                        </Link>
                                    </div>
                                    <h5 className="mb-1 product-item__title">
                                        <Link to={`/product/${product.id}`} className="text-blue font-weight-bold">
                                            {product.name}
                                        </Link>
                                    </h5>
                                    <div className="mb-2">
                                        <Link to={`/product/${product.id}`} className="d-block text-center">
                                            <img className="img-fluid" src={product.image} alt={product.name} />
                                        </Link>
                                    </div>
                                    <div className="mb-3">
                                        <a className="d-inline-flex align-items-center small font-size-14" href="#">
                                            <div className="text-warning mr-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <small
                                                        key={i}
                                                        className={
                                                            i < product.rating
                                                                ? "fas fa-star"
                                                                : "far fa-star text-muted"
                                                        }></small>
                                                ))}
                                            </div>
                                            <span className="text-secondary">({product.reviews})</span>
                                        </a>
                                    </div>
                                    <ul className="font-size-12 p-0 text-gray-110 mb-4">
                                        {product.features?.map((feature, i) => (
                                            <li key={i} className="line-clamp-1 mb-1 list-bullet">
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="text-gray-20 mb-2 font-size-12">SKU: {product.sku}</div>
                                    <div className="flex-center-between mb-1">
                                        <div className="prodcut-price">
                                            <div className="text-gray-100">${product.price.toFixed(2)}</div>
                                        </div>
                                        <div className="d-none d-xl-block prodcut-add-cart">
                                            <button
                                                type="button"
                                                className="btn-add-cart btn-primary transition-3d-hover"
                                                onClick={() => addToCart(product)}
                                            >
                                                <i className="ec ec-add-to-cart"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// List View
const ListView = ({ products, addToCart }: GridViewProps) => {
    return (
        <div className="tab-content pt-2">
            <ul className="d-block list-unstyled products-group prodcut-list-view">
                {products.map((product) => (
                    <li key={product.id} className="product-item remove-divider">
                        <div className="product-item__outer w-100">
                            <div className="product-item__inner remove-prodcut-hover py-4 row">
                                <div className="product-item__header col-6 col-md-4">
                                    <div className="mb-2">
                                        <Link to="#" className="d-block text-center">
                                            <img className="img-fluid" src={product.image} alt={product.name} />
                                        </Link>
                                    </div>
                                </div>
                                <div className="product-item__body col-6 col-md-5">
                                    <div className="pr-lg-10">
                                        <div className="mb-2">
                                            <Link to="#" className="font-size-12 text-gray-5">
                                                {product.category}
                                            </Link>
                                        </div>
                                        <h5 className="mb-2 product-item__title">
                                            <Link to={`/product/${product.id}`} className="text-blue font-weight-bold">
                                                {product.name}
                                            </Link>
                                        </h5>
                                        <div className="prodcut-price mb-2 d-md-none">
                                            <div className="text-gray-100">${product.price.toFixed(2)}</div>
                                        </div>
                                        <div className="mb-3 d-none d-md-block">
                                            <a className="d-inline-flex align-items-center small font-size-14" href="#">
                                                <div className="text-warning mr-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <small
                                                            key={i}
                                                            className={
                                                                i < product.rating
                                                                    ? "fas fa-star"
                                                                    : "far fa-star text-muted"
                                                            }></small>
                                                    ))}
                                                </div>
                                                <span className="text-secondary">({product.reviews})</span>
                                            </a>
                                        </div>
                                        <ul className="font-size-12 p-0 text-gray-110 mb-4 d-none d-md-block">
                                            {product.features?.map((feature, i) => (
                                                <li key={i} className="line-clamp-1 mb-1 list-bullet">
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="product-item__footer col-md-3 d-md-block">
                                    <div className="mb-3">
                                        <div className="prodcut-price mb-2">
                                            <div className="text-gray-100">${product.price.toFixed(2)}</div>
                                        </div>
                                        <div className="prodcut-add-cart">
                                            <button
                                                type="button"
                                                className="btn-add-cart btn-primary transition-3d-hover"
                                                onClick={() => addToCart(product)}
                                            >
                                                <i className="ec ec-add-to-cart"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// List Small View
const ListSmallView = ({ products, addToCart }: GridViewProps) => {
    return (
        <div className="tab-content pt-2">
            <ul className="d-block list-unstyled products-group prodcut-list-view-small">
                {products.map((product) => (
                    <li key={product.id} className="product-item remove-divider">
                        <div className="product-item__outer w-100">
                            <div className="product-item__inner remove-prodcut-hover py-4 row">
                                <div className="product-item__header col-6 col-md-2">
                                    <div className="mb-2">
                                        <Link to="#" className="d-block text-center">
                                            <img className="img-fluid" src={product.image} alt={product.name} />
                                        </Link>
                                    </div>
                                </div>
                                <div className="product-item__body col-6 col-md-7">
                                    <div className="pr-lg-10">
                                        <div className="mb-2">
                                            <Link to="#" className="font-size-12 text-gray-5">
                                                {product.category}
                                            </Link>
                                        </div>
                                        <h5 className="mb-2 product-item__title">
                                            <Link to="#" className="text-blue font-weight-bold">
                                                {product.name}
                                            </Link>
                                        </h5>
                                        <div className="prodcut-price d-md-none">
                                            <div className="text-gray-100">${product.price.toFixed(2)}</div>
                                        </div>
                                        <ul className="font-size-12 p-0 text-gray-110 mb-4 d-none d-md-block">
                                            {product.features?.map((feature, i) => (
                                                <li key={i} className="line-clamp-1 mb-1 list-bullet">
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="mb-3 d-none d-md-block">
                                            <a className="d-inline-flex align-items-center small font-size-14" href="#">
                                                <div className="text-warning mr-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <small
                                                            key={i}
                                                            className={
                                                                i < product.rating
                                                                    ? "fas fa-star"
                                                                    : "far fa-star text-muted"
                                                            }></small>
                                                    ))}
                                                </div>
                                                <span className="text-secondary">({product.reviews})</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="product-item__footer col-md-3 d-md-block">
                                    <div className="mb-2 flex-center-between">
                                        <div className="prodcut-price">
                                            <div className="text-gray-100">${product.price.toFixed(2)}</div>
                                        </div>
                                        <div className="prodcut-add-cart">
                                            <button
                                                type="button"
                                                className="btn-add-cart btn-primary transition-3d-hover"
                                                onClick={() => addToCart(product)}
                                            >
                                                <i className="ec ec-add-to-cart"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductGrid;
