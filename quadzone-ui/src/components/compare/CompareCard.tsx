import React from "react";
import { Link } from "react-router-dom";
import type { ProductDetails } from "../../api/types";

interface CompareProductCardProps {
    product: ProductDetails;
    rating: number;
}

const CompareProductCard: React.FC<CompareProductCardProps> = ({ product, rating }) => {
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <small key={i} className={i < rating ? "fas fa-star" : "far fa-star text-muted"} />
        ));
    };

    return (
        <Link to={`/product/${product.id}`} className="product d-block text-decoration-none">
            <div className="product-compare-image">
                <div className="d-flex mb-3">
                    <img
                        className="img-fluid mx-auto"
                        src={product.imageUrl || "/assets/img/placeholder.jpg"}
                        alt={product.name}
                        style={{ maxHeight: "200px", objectFit: "contain" }}
                    />
                </div>
            </div>
            <h3 className="product-item__title text-blue font-weight-bold mb-3 font-size-16">{product.name}</h3>
            {rating > 0 && <div className="text-warning mb-2">{renderStars(rating)}</div>}
        </Link>
    );
};

export default CompareProductCard;
