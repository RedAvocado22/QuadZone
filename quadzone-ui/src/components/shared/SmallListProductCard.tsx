import type { Product } from "../../api/types";
import { Link } from "react-router-dom";

interface ListSmallProductCardProps {
    product: Product;
    addToCart: (product: Product) => void;
}

const ListSmallProductCard: React.FC<ListSmallProductCardProps> = ({ product, addToCart }) => {
    return (
        <li className="product-item remove-divider">
            <div className="product-item__outer w-100">
                <div className="product-item__inner remove-prodcut-hover py-4 row">

                    {/* Image */}
                    <div className="product-item__header col-6 col-md-2">
                        <div className="mb-2">
                            <Link to={`/product/${product.id}`} className="d-block text-center">
                                <img className="img-fluid" src={product.imageUrl || ""} alt={product.name} />
                            </Link>
                        </div>
                    </div>

                    {/* Middle content */}
                    <div className="product-item__body col-6 col-md-7">
                        <div className="pr-lg-10">
                            <div className="mb-2">
                                <Link to={`/subCategory/${product.subCategory.id}`} className="font-size-12 text-gray-5">
                                    {product.subCategory.name}
                                </Link>
                            </div>
                            <h5 className="mb-2 product-item__title">
                                <Link to={`/product/${product.id}`} className="text-blue font-weight-bold">
                                    {product.name}
                                </Link>
                            </h5>

                            {/* Price for small screens */}
                            <div className="prodcut-price d-md-none">
                                <div className="text-gray-100">${product.price.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Footer with add to cart */}
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
    );
};

export default ListSmallProductCard;
