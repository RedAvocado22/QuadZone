import { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import { fCurrency } from "../../utils/formatters";

const CartTotals = () => {
    const { totalPrice } = useCart();
    const { currency, convertPrice } = useCurrency();
    const [showShipping, setShowShipping] = useState(false);
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
                                <div className="mt-1">
                                    <a
                                        className="font-size-12 text-gray-90 text-decoration-on underline-on-hover font-weight-bold mb-3 d-inline-block"
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowShipping(!showShipping);
                                        }}>
                                        Calculate Shipping
                                    </a>
                                    {showShipping && (
                                        <div className="mb-3">
                                            <div className="form-group mb-4">
                                                <select className="js-select selectpicker dropdown-select right-dropdown-0-all w-100">
                                                    <option value="">Select a country…</option>
                                                    <option value="US">United States</option>
                                                    <option value="UK">United Kingdom</option>
                                                    <option value="DE">Germany</option>
                                                    <option value="FR">France</option>
                                                </select>
                                            </div>
                                            <div className="form-group mb-4">
                                                <select className="js-select selectpicker dropdown-select right-dropdown-0-all w-100">
                                                    <option value="">Select a state…</option>
                                                    <option value="CA">California</option>
                                                    <option value="TX">Texas</option>
                                                    <option value="NY">New York</option>
                                                </select>
                                            </div>
                                            <input
                                                className="form-control mb-4"
                                                type="text"
                                                placeholder="Postcode / ZIP"
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-soft-secondary mb-3 mb-md-0 font-weight-normal px-5 px-md-4 px-lg-5 w-100 w-md-auto">
                                                Update Totals
                                            </button>
                                        </div>
                                    )}
                                </div>
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
                <button
                    type="button"
                    className="btn btn-primary-dark-w ml-md-2 px-5 px-md-4 px-lg-5 w-100 w-md-auto d-md-none">
                    Proceed to checkout
                </button>
            </div>
        </div>
    );
};

export default CartTotals;
