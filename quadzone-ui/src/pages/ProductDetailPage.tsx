import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct } from "../api/products";
import Layout from "../components/layout/Layout";
import { useCart } from "../contexts/CartContext";
import type { ProductDTO } from "../api/products";
import type { Product } from "../types/Product";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      getProduct(Number(id))
        .then((res) => setProduct(res))
        .finally(() => setLoading(false));
    }
  }, [id]);

  // Map ProductDTO from API to the Product shape expected by the cart
  const mapDtoToProduct = (dto: ProductDTO): Product => ({
    id: dto.id,
    name: dto.name,
    price: dto.price,
    quantity: dto.quantity,
    image: dto.imageUrl,
    brand: dto.brand,
    modelNumber: dto.modelNumber,
    isActive: dto.isActive,
    subCategoryId: dto.subCategoryId,
    subCategoryName: dto.subCategoryName,
    createdAt: dto.createdAt,
    category: dto.subCategoryId
      ? { id: dto.subCategoryId, name: dto.subCategoryName ?? "Category" }
      : { id: 0, name: "Uncategorized" },
  });

  if (loading)
    return (
      <Layout>
        <div className="text-center py-5">Loading product details...</div>
      </Layout>
    );

  if (!product)
    return (
      <Layout>
        <div className="text-center py-5">Product not found</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="container my-5">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb bg-transparent p-0 m-0">
            <li className="breadcrumb-item">
              <Link to="/" className="text-muted text-decoration-none">
                Home
              </Link>
            </li>
            {product.subCategoryId && (
              <li className="breadcrumb-item">
                <Link
                  to={`/subCategory/${product.subCategoryId}`}
                  className="text-muted text-decoration-none"
                >
                  {product.subCategoryName}
                </Link>
              </li>
            )}
            <li className="breadcrumb-item active" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* ✅ Product Main Section */}
        <div className="row g-5">
          {/* Left: Product Image */}
          <div className="col-md-6 text-center">
            <img
              src={
                product.imageUrl
                  ? `http://localhost:8080/api/v1/public/images/${product.imageUrl}`
                  : "/assets/img/default-product.png"
              }
              alt={product.name}
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: "500px", objectFit: "contain" }}
            />
          </div>

          {/* Right: Product Info */}
          <div className="col-md-6">
            <h2 className="fw-bold mb-3">{product.name}</h2>
            {product.brand && (
              <p className="text-secondary small mb-1">Brand: {product.brand}</p>
            )}
            {product.modelNumber && (
              <p className="text-secondary small mb-3">
                Model: {product.modelNumber}
              </p>
            )}

            {/* ✅ Add to Cart Box */}
            <div className="border rounded-3 p-4 bg-light shadow-sm mt-3">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h3 className="text-danger fw-bold mb-0">
                  ${product.price.toFixed(2)}
                </h3>
                <span className="text-muted small">
                  {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              <div className="d-flex gap-3">
                <button
                  className="btn btn-primary flex-fill"
                  onClick={() => addToCart(mapDtoToProduct(product), 1)}
                  disabled={product.quantity === 0}
                >
                  <i className="fa fa-shopping-cart me-2"></i>Add to Cart
                </button>
                <button
                  className="btn btn-danger flex-fill"
                  onClick={() => alert("Proceed to order")}
                  disabled={product.quantity === 0}
                >
                  <i className="fa fa-bolt me-2"></i>Order Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Description and Review Section */}
        <div className="mt-5">
          <ul className="nav nav-tabs" id="productTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="description-tab"
                data-bs-toggle="tab"
                data-bs-target="#description"
                type="button"
                role="tab"
              >
                Description
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="review-tab"
                data-bs-toggle="tab"
                data-bs-target="#review"
                type="button"
                role="tab"
              >
                Reviews
              </button>
            </li>
          </ul>
          <div className="tab-content p-4 border border-top-0 rounded-bottom shadow-sm">
            {/* Description */}
            <div
              className="tab-pane fade show active"
              id="description"
              role="tabpanel"
            >
              <p>
                {product.isActive
                  ? "This product is high-quality, durable, and crafted with attention to detail. Perfect for customers looking for reliability and style."
                  : "This product is currently unavailable."}
              </p>
              <ul>
                <li>Durable build and elegant design</li>
                <li>Available in multiple sizes and variants</li>
                <li>Includes standard warranty coverage</li>
              </ul>
            </div>

            {/* Reviews */}
            <div className="tab-pane fade" id="review" role="tabpanel">
              <div className="mb-3">
                <h5 className="fw-bold">Customer Reviews</h5>
                <p className="text-muted small">No reviews yet. Be the first to review this product!</p>
              </div>
              <div>
                <textarea
                  className="form-control mb-3"
                  placeholder="Write your review here..."
                  rows={3}
                ></textarea>
                <button className="btn btn-outline-primary">
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage