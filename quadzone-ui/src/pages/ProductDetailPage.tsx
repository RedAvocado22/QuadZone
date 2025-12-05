import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import type { ProductDetailsResponse } from "../api/types";
import { getProductDetails } from "../api/products";
import { getProductReviews } from "../api/reviews";
import { toast } from "react-toastify";
import { useCurrency } from "../contexts/CurrencyContext";
import { fCurrency } from "../utils/formatters";

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<ProductDetailsResponse | null>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const { addToCart } = useCart();
    const { currency, convertPrice } = useCurrency();

    useEffect(() => {
        if (!id) return;
        const loadProduct = async () => {
            try {
                const data = await getProductDetails(Number(id));
                setProduct(data);
                setLoadingProduct(false);
            } catch {
                toast.error("Failed to load product details. Please try again later.");
                setLoadingProduct(false);
            }
        };
        loadProduct();
    }, [id]);

    useEffect(() => {
        if (!id) return;
        const loadReviews = async () => {
            setLoadingReviews(true);
            try {
                const response = await getProductReviews(Number(id), { page: 0, size: 10 });
                setReviews(response.content || []);
            } catch (error) {
                console.error("Failed to load reviews:", error);
                setReviews([]);
            } finally {
                setLoadingReviews(false);
            }
        };
        loadReviews();
    }, [id]);

    if (loadingProduct) return <div className="text-center py-5">Loading product details...</div>;

    if (!product) return <div className="text-center py-5">Product not found</div>;

    return (
        <div className="container my-5">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb bg-transparent p-0 m-0">
                    <li className="breadcrumb-item">
                        <Link to="/" className="text-muted text-decoration-none">
                            Home
                        </Link>
                    </li>
                    {product.subCategory.id && (
                        <li className="breadcrumb-item">
                            <Link
                                to={`/subCategory/${product.subCategory.id}`}
                                className="text-muted text-decoration-none">
                                {product.subCategory.name || "Category"}
                            </Link>
                        </li>
                    )}
                    <li className="breadcrumb-item active" aria-current="page">
                        {product.name}
                    </li>
                </ol>
            </nav>

            {/* Product Main Section */}
            <div className="row g-5">
                <div className="col-md-6 text-center">
                    <img
                        src={product.imageUrl ? product.imageUrl : "/assets/img/default-product.png"}
                        alt={product.name}
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: "1000px", objectFit: "contain" }}
                    />
                </div>

                <div className="col-md-6">
                    <h2 className="fw-bold mb-3">{product.name}</h2>
                    {product.brand && <p className="text-secondary  mb-1">Brand: {product.brand}</p>}
                    {product.modelNumber && <p className="text-secondary  mb-1">Model: {product.modelNumber}</p>}
                    {product.weight && <p className="text-secondary  mb-1">Weight: {product.weight} kg</p>}
                    {/* Add to Cart Box */}
                    <div className="border rounded-3 p-4 bg-light shadow-sm mt-3">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <h3 className="text-danger fw-bold mb-0">
                                {fCurrency(convertPrice(product.price), { currency })}
                            </h3>
                            <span className="text-muted small">
                                {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                            </span>
                        </div>
                        <div className="d-flex gap-3">
                            <button
                                className="btn flex-fill text-white"
                                style={{ backgroundColor: "#667eea", borderColor: "#667eea" }}
                                onClick={() => {
                                    addToCart(product, 1);
                                }}
                                disabled={product.quantity === 0}
                                onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = "#5568d3")}
                                onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = "#667eea")}
                            >
                                <i className="fa fa-shopping-cart me-2"></i>Add to Cart
                            </button>
                            <button
                                className="btn btn-danger flex-fill"
                                onClick={() => alert("Proceed to order")}
                                disabled={product.quantity === 0}>
                                <i className="fa fa-bolt me-2"></i>Order Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🧾 Tabs Section */}
            <div className="mt-5">
                <ul className="nav nav-tabs" id="productTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className="nav-link active"
                            id="description-tab"
                            data-toggle="tab"
                            data-target="#description"
                            type="button"
                            role="tab">
                            Description
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className="nav-link"
                            id="review-tab"
                            data-toggle="tab"
                            data-target="#review"
                            type="button"
                            role="tab">
                            Reviews
                        </button>
                    </li>
                </ul>

                <div className="tab-content p-4 border border-top-0 rounded-bottom shadow-sm">
                    {/* 📄 Description */}
                    <div className="tab-pane fade show active" id="description" role="tabpanel">
                        <div className="mb-3">
                            <strong>Description:</strong>
                            {/* If description is a list (JSON) */}
                            {Array.isArray(product.description) ? (
                                <ul className="mt-2">
                                    {product.description.map((desc: string, index: number) => (
                                        <li key={index}>{desc}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-2">No description</p>
                            )}
                        </div>

                        <p>
                            <strong>Model Number:</strong> {product.modelNumber || "N/A"}
                        </p>

                        <p>
                            <strong>Brand:</strong> {product.brand || "N/A"}
                        </p>
                    </div>

                    {/* 💬 Reviews */}
                    <div className="tab-pane fade" id="review" role="tabpanel">
                        <div className="mb-3">
                            <h5 className="fw-bold">Customer Reviews</h5>
                            
                            {loadingReviews ? (
                                <p className="text-muted small">Loading reviews...</p>
                            ) : reviews.length > 0 ? (
                                <div className="mt-3">
                                    {reviews.map((review) => (
                                        <div
                                            key={review.id}
                                            className="border-bottom pb-3 mb-3"
                                            style={{ borderColor: "#e9ecef" }}>
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h6 className="fw-bold mb-1">
                                                        {review.title || "Untitled Review"}
                                                    </h6>
                                                    <p className="text-secondary small mb-2">
                                                        By {review.userName || "Anonymous"} •{" "}
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="text-warning">
                                                    {"⭐".repeat(review.rating)}
                                                </div>
                                            </div>
                                            <p className="mb-0">{review.text}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted small">
                                    No reviews yet. Be the first to review this product!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
