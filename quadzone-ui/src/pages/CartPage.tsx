import { Link } from "react-router-dom";
import CartTable from "../components/cart/CartTable";
import CartTotals from "../components/cart/CartTotals";
import { useCart } from "../contexts/CartContext";

const CartPage = () => {
    const { items } = useCart();

    return (
        <div className="cart-page">
            {/* Breadcrumb */}
            <div className="bg-gray-13 bg-md-transparent">
                <div className="container">
                    <div className="my-md-3">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-3 flex-nowrap flex-xl-wrap overflow-auto overflow-xl-visble">
                                <li className="breadcrumb-item flex-shrink-0 flex-xl-shrink-1">
                                    <Link to="/">Home</Link>
                                </li>
                                <li
                                    className="breadcrumb-item flex-shrink-0 flex-xl-shrink-1 active"
                                    aria-current="page">
                                    Cart
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="mb-4">
                    <h1 className="text-center">Cart</h1>
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-5">
                        <h3 className="mb-4">Your cart is empty</h3>
                        <Link to="/shop" className="btn btn-primary">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="mb-10 cart-table">
                            <CartTable />
                        </div>
                        <div className="mb-8 cart-total">
                            <CartTotals />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CartPage;
