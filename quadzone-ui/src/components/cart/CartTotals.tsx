import { useCart } from "../../contexts/CartContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import { fCurrency } from "../../utils/formatters";

const CartTotals = () => {
    const { totalPrice } = useCart();
    const { currency, convertPrice } = useCurrency();
    const shippingCost = 300.0;
    const grandTotal = totalPrice + shippingCost;

    return (
        <div className="row">
            <div className="col-xl-5 col-lg-6 offset-lg-6 offset-xl-7 col-md-8 offset-md-4">
                <div className="border-bottom border-color-1 mb-3">
                    <h3 className="d-inline-block section-title mb-0 pb-2 font-size-26">Cart totals</h3>
                </div>
                <table className="table mb-3 mb-md-0">
                    <tbody>
                        <tr className="cart-subtotal">
                            <th>Subtotal</th>
                            <td data-title="Subtotal">
                                <span className="amount">{fCurrency(convertPrice(totalPrice), { currency })}</span>
                            </td>
                        </tr>
                        <tr className="shipping">
                            <th>Shipping</th>
                            <td data-title="Shipping">
                                Flat Rate: <span className="amount">{fCurrency(convertPrice(shippingCost), { currency })}</span>
                            </td>
                        </tr>
                        <tr className="order-total">
                            <th>Total</th>
                            <td data-title="Total">
                                <strong>
                                    <span className="amount">{fCurrency(convertPrice(grandTotal), { currency })}</span>
                                </strong>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CartTotals;
