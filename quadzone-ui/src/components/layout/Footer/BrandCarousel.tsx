import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { brandLogos } from "../../../constants/images";

const BrandCarousel = () => {
    const brands = brandLogos;

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    };

    return (
        <div className="container">
            <div className="mb-6">
                <div className="py-2 border-top border-bottom">
                    <Slider {...settings} className="my-1">
                        {brands.map((brand, index) => (
                            <div key={index} className="js-slide">
                                <a href="#" className="link-hover__brand">
                                    <img
                                        className="img-fluid m-auto max-height-50"
                                        src={brand}
                                        alt={`Brand ${index + 1}`}
                                    />
                                </a>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
};

export default BrandCarousel;
