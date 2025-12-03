import CartRow from "./CartItem";
import { useCart } from "../../contexts/CartContext";

const CartTable = () => {
    const { items } = useCart();

    return (
        <form className="mb-4" action="#" method="post">
            <table className="table" cellSpacing="0">
                <thead>
                    <tr>
                        <th className="product-remove">&nbsp;</th>
                        <th className="product-thumbnail">&nbsp;</th>
                        <th className="product-name">Product</th>
                        <th className="product-price">Price</th>
                        <th className="product-quantity w-lg-15">Quantity</th>
                        <th className="product-subtotal">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <CartRow key={item.id} item={item} />
                    ))}
                    <tr>
                        <td colSpan={6} className="border-top space-top-2 justify-content-center">
                            <div className="pt-md-3">
                                <div className="d-block d-md-flex flex-center-between">
                                    {/* Left column kept for layout spacing; coupon is now handled on Checkout page */}
                                    <div className="mb-3 mb-md-0 w-xl-40" />
                                    <div className="d-md-flex">
                                        <button
                                            type="button"
                                            className="btn btn-soft-secondary mb-3 mb-md-0 font-weight-normal px-5 px-md-4 px-lg-5 w-100 w-md-auto">
                                            Update cart
                                        </button>
                                        <a
                                            href="/checkout"
                                            className="btn btn-primary-dark-w ml-md-2 px-5 px-md-4 px-lg-5 w-100 w-md-auto d-none d-md-inline-block">
                                            Proceed to checkout
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
    );
};

export default CartTable;
