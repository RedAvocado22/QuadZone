import type { Product } from "@/types/Product";
import { Link } from "react-router-dom";

interface ListProductCardProps {
    product: Product;
    addToCart: (product: Product) => void;
}

const ListProductCard: React.FC<ListProductCardProps> = ({ product, addToCart }) => {
    return (
        <li className="product-item remove-divider">
            <div className="product-item__outer w-100">
                <div className="product-item__inner remove-prodcut-hover py-4 row">

                    {/* Image */}
                    <div className="product-item__header col-6 col-md-4">
                        <div className="mb-2">
                            <Link to={`/product/${product.id}`} className="d-block text-center">
                                <img
                                    className="img-fluid"
                                    src={product.imageUrl}
                                    alt={product.name}
                                />
                            </Link>
                        </div>
                    </div>

                    {/* Middle Content */}
                    <div className="product-item__body col-6 col-md-5">
                        <div className="pr-lg-10">
                            <div className="mb-2">
                                <Link
                                    to={`/subCategory/${product.subCategory.id}`}
                                    className="font-size-12 text-gray-5"
                                >
                                    {product.subCategory.name}
                                </Link>
                            </div>

                            <h5 className="mb-2 product-item__title">
                                <Link
                                    to={`/product/${product.id}`}
                                    className="text-blue font-weight-bold"
                                >
                                    {product.name}
                                </Link>
                            </h5>

                            {/* Price for small screens */}
                            <div className="prodcut-price mb-2 d-md-none">
                                <div className="text-gray-100">${product.price.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
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
    );
};

export default ListProductCard;
