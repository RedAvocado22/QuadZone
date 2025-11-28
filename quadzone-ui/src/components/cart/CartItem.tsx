import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../../contexts/CartContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import { fCurrency } from "../../utils/formatters";
import { defaultImages } from "../../constants/images";
import type { CartItem } from "../../api/types";
import { getProductDetails } from "../../api/products";

interface CartItemProps {
    item: CartItem;
}

const CartItemComponent = ({ item }: CartItemProps) => {
    const { removeFromCart, updateQuantity } = useCart();
    const [product, setProduct] = useState<CartItem>(item);

    // Fetch latest product data from database
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const updatedProduct = await getProductDetails(item.id);
                setProduct({ ...updatedProduct, quantity: item.quantity, addedAt: item.addedAt });
            } catch (err) {
                console.error("Failed to fetch product details:", err);
                // Fallback to item data if fetch fails
                setProduct(item);
            }
        };

        fetchProductDetails();
    }, [item.id, item]);
    const { currency, convertPrice } = useCurrency();

    const handleQuantityChange = async (newQuantity: number) => {
        if (newQuantity > 0 && product.id) {
            try {
                updateQuantity(product.id, newQuantity);
            } catch (err) {
                console.error("Failed to update quantity:", err);
            }
        }
    };

    return (
        <tr>
            <td className="text-center">
                <button
                    type="button"
                    aria-label="Remove from cart"
                    className="text-gray-32 font-size-26"
                    onClick={async (e) => {
                        e.preventDefault();
                        if (product.id) {
                            try {
                                removeFromCart(product.id);
                            } catch (err) {
                                console.error("Failed to remove from cart:", err);
                                // Optional: show toast/notification
                            }
                        }
                    }}>
                        
                    </button>
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
                <span>{fCurrency(convertPrice(product.price), { currency })}</span>
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
                            <button
                                type="button"
                                className="js-minus btn btn-icon btn-xs btn-outline-secondary rounded-circle border-0"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleQuantityChange(product.quantity - 1);
                                }}>
                                <small className="fas fa-minus btn-icon__inner"></small>
                            </button>
                            <button
                                type="button"
                                className="js-plus btn btn-icon btn-xs btn-outline-secondary rounded-circle border-0"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleQuantityChange(product.quantity + 1);
                                }}>
                                <small className="fas fa-plus btn-icon__inner"></small>
                            </button>
                        </div>
                    </div>
                </div>
            </td>
            <td data-title="Total">
                <span>{fCurrency(convertPrice(product.price * product.quantity), { currency })}</span>
            </td>
        </tr>
    );
};

export default CartItemComponent;
