import { useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { fCurrency } from "../utils/format-number";
import CheckoutBreadcrumb from "../components/checkout/CheckoutBreadcrumb";
import ReturningCustomerSection from "../components/checkout/ReturningCustomerSection";
import CouponSection from "../components/checkout/CouponSection";
import AddressFieldsSection from "../components/checkout/AddressFieldsSection";
import ShippingDetailsSection from "../components/checkout/ShippingDetailsSection";
import OrderNotes from "../components/checkout/OrderNotes";
import OrderSummary from "../components/checkout/OrderSummary";
import PaymentMethods from "../components/checkout/PaymentMethods";
import TermsCheckbox from "../components/checkout/TermsCheckbox";
import type { AddressFields, AlertState, PaymentMethod } from "../types/checkout";
import "../components/checkout/checkout.css";

const emptyAddress: AddressFields = {
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    email: "",
    phone: "",
};

const SHIPPING_FLAT_RATE = 300;

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { items, totalPrice, clearCart } = useCart();
    const { currency, convertPrice } = useCurrency();

    const [isReturningCustomerOpen, setReturningCustomerOpen] = useState(false);
    const [isCouponOpen, setCouponOpen] = useState(false);
    const [createAccount, setCreateAccount] = useState(false);
    const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false);
    const [billing, setBilling] = useState<AddressFields>(emptyAddress);
    const [shipping, setShipping] = useState<AddressFields>(emptyAddress);
    const [couponCode, setCouponCode] = useState("");
    const [orderNotes, setOrderNotes] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank-transfer");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [alert, setAlert] = useState<AlertState>({ type: "idle" });

    const formatPrice = (value: number) => fCurrency(convertPrice(value), { currency });

    const { shippingCost, grandTotal } = useMemo(() => {
        const shippingAmount = items.length ? SHIPPING_FLAT_RATE : 0;
        return {
            shippingCost: shippingAmount,
            grandTotal: totalPrice + shippingAmount,
        };
    }, [items.length, totalPrice]);

    const handleBillingChange = (field: keyof AddressFields, value: string) => {
        setBilling((prev) => ({ ...prev, [field]: value }));
    };

    const handleShippingChange = (field: keyof AddressFields, value: string) => {
        setShipping((prev) => ({ ...prev, [field]: value }));
    };

    const handleApplyCoupon = (event: FormEvent) => {
        event.preventDefault();
        if (!couponCode.trim()) {
            return;
        }
        // TODO: Integrate with coupon API
        setAlert({ type: "success", message: `Coupon "${couponCode}" applied successfully!` });
        setCouponCode("");
        setCouponOpen(false);
    };

    const handlePlaceOrder = (event: FormEvent) => {
        event.preventDefault();
        setAlert({ type: "idle" });
        
        if (!items.length) {
            setAlert({ type: "error", message: "Your cart is empty. Please add items before checking out." });
            return;
        }
        
        if (
            !billing.firstName ||
            !billing.lastName ||
            !billing.email ||
            !billing.phone ||
            !billing.address ||
            !billing.city ||
            !billing.state
        ) {
            setAlert({
                type: "error",
                message: "Please fill out all required billing details before placing your order.",
            });
            return;
        }
        
        if (!termsAccepted) {
            setAlert({
                type: "error",
                message: "Please accept the terms and conditions to proceed.",
            });
            return;
        }
        
        // TODO: Integrate with order API
        setAlert({ type: "success", message: "Order placed successfully! Thank you for shopping with QuadZone." });
        setTimeout(() => {
            clearCart();
            navigate("/");
        }, 2000);
    };

    const summaryItems = items.map((item, index) => ({
        id: item.id ?? `cart-item-${index}`,
        name: item.name,
        quantity: item.quantity,
        total: formatPrice(item.price * item.quantity),
    }));

    const shippingDisplay = items.length
        ? `Flat rate ${formatPrice(shippingCost)}`
        : <span className="text-muted small">Add items to calculate shipping</span>;

    return (
        <div className="checkout-page pb-10">
            <CheckoutBreadcrumb />
            <div className="container">
                <div className="mb-5 text-center">
                    <h1>Checkout</h1>
                    <p className="text-gray-700 mb-0">
                        Securely complete your purchase. Need help? Call our support line anytime.
                    </p>
                </div>

                <ReturningCustomerSection
                    isOpen={isReturningCustomerOpen}
                    onToggle={() => setReturningCustomerOpen((prev) => !prev)}
                />
                <CouponSection
                    isOpen={isCouponOpen}
                    couponCode={couponCode}
                    onToggle={() => setCouponOpen((prev) => !prev)}
                    onChange={setCouponCode}
                    onApply={handleApplyCoupon}
                />

                <form onSubmit={handlePlaceOrder} noValidate>
                    <div className="row">
                        <div className="col-lg-7 order-lg-1 order-2">
                            <div className="pb-7 mb-7 border-bottom border-color-1">
                                <AddressFieldsSection
                                    title="Billing details"
                                    address={billing}
                                    onChange={handleBillingChange}
                                    prefix="billing"
                                />

                                <div className="custom-control custom-checkbox d-flex align-items-center mb-3">
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="createAccount"
                                        checked={createAccount}
                                        onChange={(event) => setCreateAccount(event.target.checked)}
                                    />
                                    <label className="custom-control-label form-label" htmlFor="createAccount">
                                        Create an account?
                                    </label>
                                </div>
                                {createAccount && (
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="accountPassword">
                                            Account password <span className="text-danger">*</span>
                                        </label>
                                        <input type="password" className="form-control" id="accountPassword" required />
                                    </div>
                                )}

                                <ShippingDetailsSection 
                                    shippingAddress={shipping}
                                    shipToDifferentAddress={shipToDifferentAddress}
                                    onToggle={setShipToDifferentAddress}
                                    onChange={handleShippingChange}
                                />

                                <OrderNotes value={orderNotes} onChange={setOrderNotes} />
                            </div>
                        </div>

                        <div className="col-lg-5 order-lg-2 order-1 mb-5">
                            <div className="pl-lg-4">
                                <OrderSummary
                                    items={summaryItems}
                                    subtotal={formatPrice(totalPrice)}
                                    shipping={shippingDisplay}
                                    total={formatPrice(grandTotal)}
                                />
                                <PaymentMethods selected={paymentMethod} onChange={setPaymentMethod} />
                                <TermsCheckbox checked={termsAccepted} onChange={setTermsAccepted} />

                                {alert.type !== "idle" && (
                                    <div
                                        className={`alert ${alert.type === "error" ? "alert-danger" : "alert-success"}`}
                                        role="alert"
                                    >
                                        {alert.message}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn-primary-dark-w btn-block btn-pill font-size-20 py-3 mb-3"
                                >
                                    Place order
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;

