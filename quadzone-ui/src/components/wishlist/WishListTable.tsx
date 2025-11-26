// components/wishlist/WishlistTable.tsx
// Table component to display all wishlist items

import type { FC } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../contexts/WishListContext";
import WishlistItem from "./WishListItem";

const WishlistTable: FC = () => {
    const { wishlistItems, loading, error } = useWishlist();

    if (loading) {
        return (
            <output className="text-center py-10 d-block" aria-live="polite" aria-busy="true">
                <div className="spinner-border text-primary">
                    <span className="sr-only">Loading...</span>
                </div>
                <p className="mt-3">Loading your wishlist...</p>
            </output>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center" role="alert">
                <i className="ec ec-error font-size-32 mb-3 d-block"></i>
                <p>{error}</p>
            </div>
        );
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="text-center py-10">
                <i className="ec ec-favorites font-size-64 text-gray-50 mb-4 d-block"></i>
                <h3 className="font-size-18 mb-3">Your wishlist is empty</h3>
                <p className="text-gray-90 mb-4">Add items you like to your wishlist.</p>
                <Link to="/" className="btn btn-primary">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <form className="mb-4" action="#" method="post">
            <div className="table-responsive">
                <table className="table" cellSpacing="0">
                    <thead>
                        <tr>
                            <th className="product-remove">&nbsp;</th>
                            <th className="product-thumbnail">&nbsp;</th>
                            <th className="product-name">Product</th>
                            <th className="product-price">Unit Price</th>
                            <th className="product-Stock w-lg-15">Stock Status</th>
                            <th className="product-subtotal min-width-200-md-lg">&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {wishlistItems.map((item) => (
                            <WishlistItem key={item.id} product={item} />
                        ))}
                    </tbody>
                </table>
            </div>
        </form>
    );
};

export default WishlistTable;
