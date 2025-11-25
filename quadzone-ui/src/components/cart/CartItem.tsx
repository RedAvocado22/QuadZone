import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../../contexts/CartContext";
import { defaultImages } from "../../constants/images";
import { getProductDetails } from "../../api/products";
import type { Product } from "../../types/Product";

interface CartItemProps {
    item: Product & { quantity: number };
}

const CartItem = ({ item }: CartItemProps) => {
    const { removeFromCart, updateQuantity } = useCart();
    const [product, setProduct] = useState<Product & { quantity: number }>(item);

    // Fetch latest product data from database
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const updatedProduct = await getProductDetails(item.id);
                setProduct({ ...updatedProduct, quantity: item.quantity });
            } catch (err) {
                console.error("Failed to fetch product details:", err);
                // Fallback to item data if fetch fails
                setProduct(item);
            }
        };

        fetchProductDetails();
    }, [item.id, item]);

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity > 0 && product.id) {
            updateQuantity(product.id, newQuantity).catch((err) => {
                console.error("Failed to update quantity:", err);
            });
        }
    };

    return (
        <tr>
            <td className="text-center">
                <a
                    href="#"
                    className="text-gray-32 font-size-26"
                    onClick={(e) => {
                        e.preventDefault();
                        if (product.id) {
                            removeFromCart(product.id).catch((err) => {
                                console.error("Failed to remove from cart:", err);
                            });
                        }
                    }}>
                    ×
                </a>
            </td>
            <td className="d-none d-md-table-cell">
                <Link to={`/product/${product.id}`}>
                    <img
                        className="img-fluid max-width-100 p-1 border border-color-1"
                        src={product.imageUrl || defaultImages.cart}
                        alt={product.name}
                    />
                </Link>
            </td>
            <td data-title="Product">
                <Link to={`/product/${product.id}`} className="text-gray-90">
                    {product.name}
                </Link>
            </td>
            <td data-title="Price">
                <span>${product.price.toFixed(2)}</span>
            </td>
            <td data-title="Quantity">
                <span className="sr-only">Quantity</span>
                <div className="border rounded-pill py-1 width-122 w-xl-80 px-3 border-color-1">
                    <div className="js-quantity row align-items-center">
                        <div className="col">
                            <input
                                className="js-result form-control h-auto border-0 rounded p-0 shadow-none"
                                type="text"
                                value={product.quantity}
                                readOnly
                            />
                        </div>
                        <div className="col-auto pr-1">
                            <a
                                className="js-minus btn btn-icon btn-xs btn-outline-secondary rounded-circle border-0"
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleQuantityChange(product.quantity - 1);
                                }}>
                                <small className="fas fa-minus btn-icon__inner"></small>
                            </a>
                            <a
                                className="js-plus btn btn-icon btn-xs btn-outline-secondary rounded-circle border-0"
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleQuantityChange(product.quantity + 1);
                                }}>
                                <small className="fas fa-plus btn-icon__inner"></small>
                            </a>
                        </div>
                    </div>
                </div>
            </td>
            <td data-title="Total">
                <span>${(product.price * product.quantity).toFixed(2)}</span>
            </td>
        </tr>
    );
};

export default CartItem;
