import { useState } from 'react';
import ShopBreadcrumb from '../components/shop/ShopBreadcrumb';
import ShopSidebar from '../components/shop/ShopSidebar';
import ShopControlBar from '../components/shop/ShopControlBar';
import ProductGrid from '../components/shop/ProductGrid';
import ShopPagination from '../components/shop/ShopPagination';
import RecommendedProducts from '../components/shop/RecommendedProducts';
import { productImages } from '../constants/images';
import type { Product, ViewMode, SortOption } from '../types/shop';

// Mock data for products
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Audio System Multiroom 360 degree Full base audio',
    category: 'Speakers',
    price: 685.00,
    image: productImages[1],
    rating: 4,
    reviews: 40,
    sku: 'FW511948218',
    features: [
      'Brand new and high quality',
      'Made of supreme quality, durable EVA crush resistant, anti-shock material.',
      '20 MP Electro and 28 megapixel CMOS rear camera'
    ]
  },
  {
    id: 2,
    name: 'Tablet White EliteBook Revolve 810 G2',
    category: 'Speakers',
    price: 1999.00,
    oldPrice: 2299.00,
    image: productImages[2],
    rating: 4,
    reviews: 40,
    sku: 'FW511948218',
    features: [
      'Brand new and high quality',
      'Made of supreme quality, durable EVA crush resistant, anti-shock material.',
      '20 MP Electro and 28 megapixel CMOS rear camera'
    ]
  },
  {
    id: 3,
    name: 'Purple Solo 2 Wireless',
    category: 'Speakers',
    price: 685.00,
    image: productImages[2],
    rating: 4,
    reviews: 40,
    sku: 'FW511948218',
    features: [
      'Brand new and high quality',
      'Made of supreme quality, durable EVA crush resistant, anti-shock material.',
      '20 MP Electro and 28 megapixel CMOS rear camera'
    ]
  },
  {
    id: 4,
    name: 'Smartphone 6S 32GB LTE',
    category: 'Speakers',
    price: 685.00,
    image: productImages[4],
    rating: 4,
    reviews: 40,
    sku: 'FW511948218',
    features: [
      'Brand new and high quality',
      'Made of supreme quality, durable EVA crush resistant, anti-shock material.',
      '20 MP Electro and 28 megapixel CMOS rear camera'
    ]
  },
  {
    id: 5,
    name: 'Widescreen NX Mini F1 SMART NX',
    category: 'Speakers',
    price: 685.00,
    image: productImages[5],
    rating: 4,
    reviews: 40,
    sku: 'FW511948218',
    features: [
      'Brand new and high quality',
      'Made of supreme quality, durable EVA crush resistant, anti-shock material.',
      '20 MP Electro and 28 megapixel CMOS rear camera'
    ]
  },
  {
    id: 6,
    name: 'Wireless Audio System Multiroom 360 degree Full base audio',
    category: 'Speakers',
    price: 685.00,
    image: productImages[6],
    rating: 4,
    reviews: 40,
    sku: 'FW511948218',
    features: [
      'Brand new and high quality',
      'Made of supreme quality, durable EVA crush resistant, anti-shock material.',
      '20 MP Electro and 28 megapixel CMOS rear camera'
    ]
  },
  {
    id: 7,
    name: 'Tablet White EliteBook Revolve 810 G2',
    category: 'Speakers',
    price: 1999.00,
    oldPrice: 2299.00,
    image: productImages[7],
    rating: 4,
    reviews: 40,
    sku: 'FW511948218',
    features: [
      'Brand new and high quality',
      'Made of supreme quality, durable EVA crush resistant, anti-shock material.',
      '20 MP Electro and 28 megapixel CMOS rear camera'
    ]
  },
  {
    id: 8,
    name: 'Purple Solo 2 Wireless',
    category: 'Speakers',
    price: 685.00,
    image: productImages[1],
    rating: 4,
    reviews: 40,
    sku: 'FW511948218',
    features: [
      'Brand new and high quality',
      'Made of supreme quality, durable EVA crush resistant, anti-shock material.',
      '20 MP Electro and 28 megapixel CMOS rear camera'
    ]
  },
  {
    id: 9,
    name: 'Smartphone 6S 32GB LTE',
    category: 'Speakers',
    price: 685.00,
    image: productImages[1],
    rating: 4,
    reviews: 40,
    sku: 'FW511948218',
    features: [
      'Brand new and high quality',
      'Made of supreme quality, durable EVA crush resistant, anti-shock material.',
      '20 MP Electro and 28 megapixel CMOS rear camera'
    ]
  },
  {
    id: 10,
    name: 'Widescreen NX Mini F1 SMART NX',
    category: 'Speakers',
    price: 685.00,
    image: productImages[2],
    rating: 4,
    reviews: 40,
    sku: 'FW511948218',
    features: [
      'Brand new and high quality',
      'Made of supreme quality, durable EVA crush resistant, anti-shock material.',
      '20 MP Electro and 28 megapixel CMOS rear camera'
    ]
  }
];

const Shop: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <>
      {/* Breadcrumb */}
      <ShopBreadcrumb />

      <div className="container">
        <div className="row mb-8">
          {/* Sidebar */}
          <ShopSidebar 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Main Content */}
          <div className="col-xl-9 col-wd-9gdot5">
            {/* Recommended Products */}
            <RecommendedProducts products={mockProducts.slice(0, 9)} />

            {/* Shop Control Bar Title */}
            <div className="flex-center-between mb-3">
              <h3 className="font-size-25 mb-0">Shop</h3>
              <p className="font-size-14 text-gray-90 mb-0">Showing 1–{Math.min(itemsPerPage, mockProducts.length)} of {mockProducts.length} results</p>
            </div>

            {/* Shop Control Bar */}
            <ShopControlBar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortBy={sortBy}
              onSortChange={setSortBy}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
              currentPage={currentPage}
              totalPages={Math.ceil(mockProducts.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

            {/* Product Grid */}
            <ProductGrid 
              products={mockProducts.slice(0, itemsPerPage)}
              viewMode={viewMode}
            />

            {/* Pagination */}
            <ShopPagination
              currentPage={currentPage}
              totalPages={Math.ceil(mockProducts.length / itemsPerPage)}
              totalItems={mockProducts.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;

