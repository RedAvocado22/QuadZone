// pages/WishlistPage.tsx
// Main wishlist page component

import type { FC } from 'react';
import { Link } from 'react-router-dom';
import WishlistTable from '../components/wishlist/WishListTable';

const WishlistPage: FC = () => {
  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-gray-13 bg-md-transparent">
        <div className="container">
          <div className="my-md-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-3 flex-nowrap flex-xl-wrap overflow-auto overflow-xl-visble">
                <li className="breadcrumb-item flex-shrink-0 flex-xl-shrink-1">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item flex-shrink-0 flex-xl-shrink-1 active" aria-current="page">
                  Wishlist
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      {/* End Breadcrumb */}

      {/* Main Content */}
      <div className="container">
        <div className="my-6">
          <h1 className="text-center">My Wishlist</h1>
        </div>
        <div className="mb-16 wishlist-table">
          <WishlistTable />
        </div>
      </div>
    </>
  );
};

export default WishlistPage;