import React from 'react';
import HeroSection from '../components/home/HeroSection';
import ProductSlider from '../components/home/ProductSlider';
import { productImages } from '../constants/images';

// Mock data for products
const mockProducts = [
  {
    id: 1,
    name: 'Wireless Audio System Multiroom 360 degree Full base audio',
    category: 'speakers',
    categoryName: 'Speakers',
    price: 685.00,
    image: productImages[1],
    rating: 4.5,
    reviews: 120
  },
  {
    id: 2,
    name: 'Video Camera 4k Waterproof',
    category: 'cameras',
    categoryName: 'Camera',
    price: 899.00,
    oldPrice: 1200.00,
    image: productImages[2],
    rating: 5,
    reviews: 85
  },
  {
    id: 3,
    name: 'Smartphone 6S 32GB LTE',
    category: 'smartphones',
    categoryName: 'Smartphones',
    price: 685.00,
    image: productImages[4],
    rating: 4,
    reviews: 203
  },
  {
    id: 4,
    name: 'Widescreen NX Mini F1 SMART NX',
    category: 'cameras',
    categoryName: 'Cameras',
    price: 685.00,
    image: productImages[5],
    rating: 4.5,
    reviews: 67
  },
  {
    id: 5,
    name: 'Full Color LaserJet Pro M452dn',
    category: 'printers',
    categoryName: 'Printers',
    price: 439.00,
    image: productImages[6],
    rating: 4,
    reviews: 54
  },
  {
    id: 6,
    name: 'GameConsole Destiny Special Edition',
    category: 'gaming',
    categoryName: 'Gaming',
    price: 399.00,
    oldPrice: 499.00,
    image: productImages[7],
    rating: 5,
    reviews: 312
  }
];

const HomeV6 = () => {
  return (
    <div className="home-v6">
      <HeroSection />
      
      <div className="container">
        <div className="mb-6">
          <ProductSlider 
            title="Featured Products" 
            products={mockProducts} 
          />
        </div>

        <div className="mb-6">
          <ProductSlider 
            title="Best Sellers" 
            products={mockProducts.slice().reverse()} 
          />
        </div>

        <div className="mb-6">
          <ProductSlider 
            title="New Arrivals" 
            products={mockProducts} 
          />
        </div>
      </div>
    </div>
  );
};

export default HomeV6;

