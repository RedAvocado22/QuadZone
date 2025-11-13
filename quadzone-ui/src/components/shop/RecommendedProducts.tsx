import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import type { Product } from '../../types/shop';

interface RecommendedProductsProps {
  products: Product[];
}

const RecommendedProducts = ({ products }: RecommendedProductsProps) => {
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 4
        }
      },
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
        breakpoint: 554,
        settings: {
          slidesToShow: 2
        }
      }
    ]
  };

  return (
    <div className="mb-6 d-none d-xl-block">
      <div className="position-relative">
        <div className="border-bottom border-color-1 mb-2">
          <h3 className="d-inline-block section-title section-title__full mb-0 pb-2 font-size-22">
            Recommended Products
          </h3>
        </div>
        
        <div className="position-relative pb-7 pt-2 px-1">
          {/* Navigation Arrows */}
          <button
            className="position-absolute top-0 font-size-17 u-slick__arrow-normal top-10 fa fa-angle-left right-1"
            style={{ zIndex: 1, border: 'none', background: 'transparent' }}
            onClick={() => sliderRef.current?.slickPrev()}
          />
          <button
            className="position-absolute top-0 font-size-17 u-slick__arrow-normal top-10 fa fa-angle-right right-0"
            style={{ zIndex: 1, border: 'none', background: 'transparent' }}
            onClick={() => sliderRef.current?.slickNext()}
          />

          <Slider ref={sliderRef} {...settings}>
            {products.map((product) => (
              <div key={product.id} className="js-slide products-group">
                <div className="product-item">
                  <div className="product-item__outer h-100">
                    <div className="product-item__inner px-wd-4 p-2 p-md-3">
                      <div className="product-item__body pb-xl-2">
                        <div className="mb-2">
                          <Link to="#" className="font-size-12 text-gray-5">{product.category}</Link>
                        </div>
                        <h5 className="mb-1 product-item__title">
                          <Link to="#" className="text-blue font-weight-bold">{product.name}</Link>
                        </h5>
                        <div className="mb-2">
                          <Link to="#" className="d-block text-center">
                            <img className="img-fluid" src={product.image} alt={product.name} />
                          </Link>
                        </div>
                        <div className="flex-center-between mb-1">
                          <div className="prodcut-price">
                            <div className="text-gray-100">${product.price.toFixed(2)}</div>
                          </div>
                          <div className="d-none d-xl-block prodcut-add-cart">
                            <Link to="#" className="btn-add-cart btn-primary transition-3d-hover">
                              <i className="ec ec-add-to-cart"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="product-item__footer">
                        <div className="border-top pt-2 flex-center-between flex-wrap">
                          <Link to="#" className="text-gray-6 font-size-13">
                            <i className="ec ec-compare mr-1 font-size-15"></i> Compare
                          </Link>
                          <Link to="#" className="text-gray-6 font-size-13">
                            <i className="ec ec-favorites mr-1 font-size-15"></i> Wishlist
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default RecommendedProducts;

