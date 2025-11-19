import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import { fCurrency } from "../../utils/format-number";
import { defaultImages } from "../../constants/images";
import type { Product } from "../../types/Product";

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart } = useCart();
    const { currency, convertPrice } = useCurrency();

    const handleAddToCart = (e: any) => {
        e.preventDefault();
        addToCart(product);
    };

    return (
        <div className="product-item">
            <div className="product-item__outer h-100">
                <div className="product-item__inner px-wd-4 p-2 p-md-3">
                    <div className="product-item__body pb-xl-2">
                        <div className="mb-2">
                            <Link to={`/subCategory/${product.subCategoryId}`} className="font-size-12 text-gray-5">
                                {product.subCategoryName || "Products"}
                            </Link>
                        </div>

                        <h5 className="mb-1 product-item__title">
                            <Link to={`/product/${product.id}`} className="text-blue font-weight-bold">
                                {product.name}
                            </Link>
                        </h5>

                        <div className="mb-2">
                            <Link to={`/product/${product.id}`} className="d-block text-center">
                                <img
                                    className="img-fluid"
                                    style={{ width: "160px", height: "150px", objectFit: "cover" }}
                                    src={
                                        product.image
                                            ? `http://localhost:8080/api/v1/public/images/${product.image}`
                                            : defaultImages.product
                                    }
                                    alt={product.name}
                                />
                            </Link>
                        </div>

                        <div className="flex-center-between mb-1">
                            <div className="prodcut-price">
                                {/* {product.oldPrice && <del className="text-gray-9 mr-2">{fCurrency(convertPrice(product.oldPrice), { currency })}</del>} */}
                                <div className="text-gray-100">{fCurrency(convertPrice(product.price), { currency })}</div>
                            </div>

                            <div className="d-none d-xl-block prodcut-add-cart">
                                <a
                                    href="#"
                                    className="btn-add-cart btn-primary transition-3d-hover"
                                    onClick={handleAddToCart}>
                                    <i className="ec ec-add-to-cart"></i>
                                </a>
                            </div>
                        </div>

                        {product.rating && (
                            <div className="text-warning mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <small
                                        key={i}
                                        className={
                                            i < Math.floor(product.rating ?? 0)
                                                ? "fas fa-star"
                                                : "far fa-star text-muted"
                                        }></small>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="product-item__footer">
                        <div className="border-top pt-2 flex-center-between flex-wrap">
                            <Link to="/compare" className="text-gray-6 font-size-13">
                                <i className="ec ec-compare mr-1 font-size-15"></i> Compare
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
