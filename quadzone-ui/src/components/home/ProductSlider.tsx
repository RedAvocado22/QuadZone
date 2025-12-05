import Slider from "react-slick";
import ProductCard from "../shared/ProductCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import type { PublicProductDTO, Product } from "../../api/types";

interface ProductSliderProps {
    title?: string;
    products: PublicProductDTO[];
}

const sliderStyle = {
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "20px 20px 35px 20px"
};

const ProductSlider: React.FC<ProductSliderProps> = ({ title, products }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: false,
        arrows: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    };

    return (
        <div className="product-slider mb-6" style={sliderStyle}>
            {title && (
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="h3 mb-0">{title}</h2>
                </div>
            )}
            <Slider {...settings}>
                {products.map((product) => {
                    const mapped: Product = {
                        id: product.id,
                        name: product.name,
                        brand: product.brand ?? null,
                        price: product.price,
                        imageUrl: product.imageUrl ?? null,
                        quantity: product.quantity,
                        subCategory: { id: product.subCategoryId ?? 0, name: product.subCategoryName ?? "Unknown" },
                        category: { id: 0, name: "Unknown" },
                        createdAt: product.createdAt
                    };
                    return (
                        <div key={product.id} className="px-2">
                            <ProductCard product={mapped} />
                        </div>
                    );
                })}
            </Slider>
        </div>
    );
};

export default ProductSlider;
