// components/wishlist/WishlistItem.tsx
// Individual wishlist item row component

import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "src/api/types";
import { useWishlist } from "../../contexts/WishListContext";
import { useCart } from "../../contexts/CartContext";
import { toast } from "react-toastify";

interface WishlistItemProps {
    product: Product;
}

const WishlistItem: React.FC<WishlistItemProps> = ({ product }: WishlistItemProps) => {
    const { removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const [removing, setRemoving] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);

    const handleRemove = async (e: React.MouseEvent) => {
        e.preventDefault();
        setRemoving(true);
        try {
            await removeFromWishlist(product.id);
        } catch (error) {
            console.error("Failed to remove from wishlist:", error);
        } finally {
            setRemoving(false);
        }
    };

    const handleAddToCart = () => {
        setAddingToCart(true);
        try {
            addToCart(product, 1);
            // Optionally remove from wishlist after adding to cart
            // removeFromWishlist(product.id);
        } catch (error) {
            console.error("Failed to add to cart:", error);
        } finally {
            setAddingToCart(false);
        }
    };

    const inStock = product.quantity > 0;

    return (
        <tr className={removing ? "opacity-50" : ""}>
            <td className="text-center">
                <button
                    type="button"
                    onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        try {
                            setRemoving(true);
                            await handleRemove(e); // your context remove method
                            toast.info("Removed from wishlist ❤️‍🩹");
                        } catch (err) {
                            toast.error("Failed to remove product.");
                        } finally {
                            setRemoving(false);
                        }
                    }}
                    className="text-gray-32 font-size-26 bg-transparent border-0 p-0"
                    title="Remove from wishlist"
                    aria-label="Remove from wishlist">
                    {removing ? "..." : "X"}
                </button>
            </td>
            <td className="d-none d-md-table-cell">
                <Link to={`/product/${product.id}`}>
                    <img
                        className="img-fluid max-width-100 p-1 border border-color-1"
                        src={product.imageUrl || "/assets/img/300X300/placeholder.jpg"}
                        alt={product.name}
                    />
                </Link>
            </td>

            <td data-title="Product">
                <Link to={`/product/${product.id}`} className="text-gray-90">
                    {product.name}
                </Link>
                {product.brand && <div className="text-gray-50 font-size-12 mt-1">Brand: {product.brand}</div>}
            </td>

            <td data-title="Unit Price">
                <span className="font-weight-bold">${product.price.toFixed(2)}</span>
            </td>

            <td data-title="Stock Status">
                {inStock ? (
                    <span className="text-success">In stock</span>
                ) : (
                    <span className="text-danger">Out of stock</span>
                )}
            </td>

            <td>
                <button
                    type="button"
                    onClick={handleAddToCart}
                    className="btn btn-soft-secondary mb-3 mb-md-0 font-weight-normal px-5 px-md-4 px-lg-5 w-100 w-md-auto"
                    disabled={!inStock || addingToCart}>
                    {addingToCart ? "Adding..." : "Add to Cart"}
                </button>
            </td>
        </tr>
    );
};

export default WishlistItem;
