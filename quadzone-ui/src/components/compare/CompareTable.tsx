import React from "react";
import { useCompare } from "../../contexts/CompareContext";
import { useCart } from "../../contexts/CartContext";
import type { ProductDetails } from "../../api/types";
import CompareProductCard from "./CompareCard";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const CompareTable: React.FC = () => {
    const { compareProducts, removeFromCompare } = useCompare();
    const { addToCart } = useCart();

    if (compareProducts.length === 0) {
        return (
            <div className="text-center py-10">
                <div className="mb-4">
                    <i className="ec ec-compare font-size-60 text-gray-50"></i>
                </div>
                <h3 className="mb-3">No products to compare</h3>
                <p className="text-gray-90">Add products to compare to see them here.</p>
                <Link to="/" className="btn btn-primary mt-3">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    const getAvailability = (product: ProductDetails): string => {
        if (product.quantity > 100) return `${product.quantity} in stock`;
        if (product.quantity > 0) return `${product.quantity} in stock`;
        return "Out of stock";
    };

    const handleAddToCart = (product: ProductDetails) => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            brand: product.brand,
            subCategory: product.subCategory,
            category: product.category,
            createdAt: product.createdAt,
            quantity: 1
        });
    };

    const handleRemove = (productId: number) => {
        removeFromCompare(productId);
    };

    // Calculate average rating from reviews
    const getAverageRating = (product: ProductDetails): number => {
        if (!product.reviews || product.reviews.length === 0) return 0;
        const sum = product.reviews.reduce((acc, review) => acc + review.rating, 0);
        return Math.round(sum / product.reviews.length);
    };

    return (
        <div className="table-responsive table-bordered table-compare-list mb-10 border-0">
            <table className="table">
                <tbody>
                    {/* Product Row */}
                    <tr>
                        <th className="min-width-200">Product</th>
                        {compareProducts.map((product) => (
                            <td key={product.id}>
                                <CompareProductCard product={product} rating={getAverageRating(product)} />
                            </td>
                        ))}
                    </tr>

                    {/* Price Row */}
                    <tr>
                        <th>Price</th>
                        {compareProducts.map((product) => (
                            <td key={product.id}>
                                <div className="product-price">${product.price.toFixed(2)}</div>
                            </td>
                        ))}
                    </tr>

                    {/* Availability Row */}
                    <tr>
                        <th>Availability</th>
                        {compareProducts.map((product) => (
                            <td key={product.id}>
                                <span className={product.quantity > 0 ? "text-success" : "text-danger"}>
                                    {getAvailability(product)}
                                </span>
                            </td>
                        ))}
                    </tr>

                    {/* Description Row */}
                    <tr>
                        <th>Description</th>
                        {compareProducts.map((product) => (
                            <td key={product.id}>
                                <ul className="list-unstyled">
                                    {product.description && product.description.length > 0 ? (
                                        product.description.map((desc, idx) => (
                                            <li key={idx} className="mb-2">
                                                <span className="text-gray-90">{desc}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-50">No description available</li>
                                    )}
                                </ul>
                            </td>
                        ))}
                    </tr>

                    {/* Add to Cart Row */}
                    <tr>
                        <th>Add to cart</th>
                        {compareProducts.map((product) => (
                            <td key={product.id}>
                                <div>
                                    <button
                                        className="btn btn-soft-secondary mb-3 mb-md-0 font-weight-normal px-5 px-md-3 px-xl-5"
                                        onClick={() => handleAddToCart(product)}
                                        disabled={product.quantity === 0}>
                                        {product.quantity > 0 ? "Add to cart" : "Out of stock"}
                                    </button>
                                </div>
                            </td>
                        ))}
                    </tr>

                    {/* Model Number Row */}
                    <tr>
                        <th>Model Number</th>
                        {compareProducts.map((product) => (
                            <td key={product.id}>
                                <span className="text-gray-90">{product.modelNumber || "N/A"}</span>
                            </td>
                        ))}
                    </tr>

                    {/* Weight Row */}
                    <tr>
                        <th>Weight</th>
                        {compareProducts.map((product) => (
                            <td key={product.id}>
                                <span className="text-gray-90">{product.weight ? `${product.weight}g` : "N/A"}</span>
                            </td>
                        ))}
                    </tr>

                    {/* Brand Row */}
                    <tr>
                        <th>Brand</th>
                        {compareProducts.map((product) => (
                            <td key={product.id}>
                                <span className="text-gray-90">{product.brand || "N/A"}</span>
                            </td>
                        ))}
                    </tr>

                    {/* Category Row */}
                    <tr>
                        <th>Category</th>
                        {compareProducts.map((product) => (
                            <td key={product.id}>
                                <span className="text-gray-90">
                                    {product.category?.name || product.subCategory?.name || "N/A"}
                                </span>
                            </td>
                        ))}
                    </tr>

                    {/* Reviews Count Row */}
                    <tr>
                        <th>Reviews</th>
                        {compareProducts.map((product) => (
                            <td key={product.id}>
                                <span className="text-gray-90">
                                    {product.reviews && product.reviews.length > 0
                                        ? `${product.reviews.length} review${product.reviews.length > 1 ? "s" : ""}`
                                        : "No reviews yet"}
                                </span>
                            </td>
                        ))}
                    </tr>

                    {/* Price Row (Bottom) */}
                    <tr>
                        <th>Price</th>
                        {compareProducts.map((product) => (
                            <td key={product.id}>
                                <div className="product-price price font-weight-bold text-primary">
                                    ${product.price.toFixed(2)}
                                </div>
                            </td>
                        ))}
                    </tr>

                    <tr>
                        <th>Remove</th>
                        {compareProducts.map((product) => (
                            <td key={product.id} className="text-center">
                                <button
                                    className="btn btn-link text-gray-90 p-0"
                                    onClick={() => {
                                        handleRemove(product.id);
                                        toast.info(`Removed "${product.name}" from compare`);
                                    }}
                                    aria-label="Remove from compare"
                                    title="Remove from compare">
                                    <i className="fa fa-times font-size-20"></i>
                                </button>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CompareTable;
