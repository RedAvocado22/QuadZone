import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import { fCurrency } from "../../utils/formatters";
import { defaultImages } from "../../constants/images";
import CompareButton from "../compare/CompareButton";
import type { Product } from "../../api/types";
import WishlistButton from "./WishListButton";

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
                <div className="product-item__inner remove-prodcut-hover px-wd-4 p-2 p-md-3">
                    <div className="product-item__body pb-xl-2">
                        <div className="mb-2">
                            <Link to={`/subCategory/${product.subCategory.id || 0}`} className="font-size-12 text-gray-5">
                                {product.subCategory.name || "Products"}
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
                                    src={product.imageUrl ? product.imageUrl : defaultImages.product}
                                    alt={product.name}
                                />
                            </Link>
                        </div>

                        <div className="flex-center-between mb-1">
                            <div className="prodcut-price">
                                <div className="text-gray-100">{fCurrency(convertPrice(product.price), { currency })}</div>
                            </div>

                            <div className="d-none d-xl-block prodcut-add-cart">
                                <button
                                    type="button"
                                    className="btn-add-cart transition-3d-hover text-white"
                                    style={{ backgroundColor: "#667eea", borderColor: "#667eea" }}
                                    onClick={handleAddToCart}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#5568d3"}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#667eea"}
                                    aria-label="Add to cart">
                                    <i className="ec ec-add-to-cart"></i>
                                </button>
                            </div>
                        </div>
                        <div className="product-item__footer">
                            <div className="border-top pt-2 flex-center-between flex-wrap">
                                <CompareButton productId={product.id} className="btn-sm" />
                                <WishlistButton productId={product.id} className="btn-sm" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
