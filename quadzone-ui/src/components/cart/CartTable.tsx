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
                        <td colSpan={6} className="border-top">
                            <div className="pt-4 pb-3 px-3">
                                <div className="d-block d-md-flex align-items-center justify-content-between gap-3">
                                    {/* Left side - could be used for cart summary or promo code */}
                                    <div className="mb-3 mb-md-0 flex-shrink-0" style={{ minWidth: "200px" }}>
                                        {/* Optional: Add cart summary or discount code here */}
                                    </div>

                                    {/* Right side - Action buttons */}
                                    <div
                                        className="d-flex flex-column flex-sm-row gap-3 w-100 w-md-auto"
                                        style={{ maxWidth: "500px" }}>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2 px-4"
                                            style={{
                                                minHeight: "52px",
                                                fontWeight: "500",
                                                borderWidth: "2px",
                                                transition: "all 0.2s ease"
                                            }}
                                            aria-label="Update shopping cart">
                                            <i className="bi bi-arrow-clockwise"></i>
                                            Update Cart
                                        </button>

                                        <a
                                            href="/checkout"
                                            className="btn btn-primary d-flex align-items-center justify-content-center gap-2 px-4"
                                            role="button"
                                            style={{
                                                minHeight: "52px",
                                                fontWeight: "600",
                                                lineHeight: "normal",
                                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                                transition: "all 0.2s ease"
                                            }}
                                            aria-label="Proceed to checkout">
                                            Proceed to Checkout
                                            <i className="bi bi-arrow-right"></i>
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
