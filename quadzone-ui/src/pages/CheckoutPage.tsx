import { useMemo, useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { fCurrency } from "../utils/formatters";
import { useUser } from "../hooks/useUser";
import { ordersApi } from "../api/orders";
import { fCurrency } from "../utils/format-number";
import CheckoutBreadcrumb from "../components/checkout/CheckoutBreadcrumb";
import ReturningCustomerSection from "../components/checkout/ReturningCustomerSection";
import CouponSection from "../components/checkout/CouponSection";
import AddressFieldsSection from "../components/checkout/AddressFieldSection";
import ShippingDetailsSection from "../components/checkout/ShippingDetailsSection";
import OrderNotes from "../components/checkout/OrderNote";
import OrderSummary from "../components/checkout/OrderSummary";
import PaymentMethods from "../components/checkout/PaymentMethod";
import TermsCheckbox from "../components/checkout/TermsCheckbox";
import type { AddressFields, AlertState, PaymentMethod } from "../types/checkout";
import "../assets/css/checkout.css";

const emptyAddress: AddressFields = {
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    email: "",
    phone: ""
};

const SHIPPING_FLAT_RATE = 300;

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { items, totalPrice, clearCart } = useCart();
    const { currency, convertPrice } = useCurrency();
    const { user } = useUser();

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
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-fill billing information for logged-in users
    useEffect(() => {
        if (user) {
            setBilling((prev) => ({
                ...prev,
                firstName: user.firstName || prev.firstName,
                lastName: user.lastName || prev.lastName,
                email: user.email || prev.email,
            }));
        }
    }, [user]);

    const formatPrice = (value: number) => fCurrency(convertPrice(value), { currency });

    const { shippingCost, grandTotal } = useMemo(() => {
        const shippingAmount = items.length ? SHIPPING_FLAT_RATE : 0;
        return {
            shippingCost: shippingAmount,
            grandTotal: totalPrice + shippingAmount
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

    // Email validation helper
    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Phone validation helper
    const isValidPhone = (phone: string): boolean => {
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
        return phoneRegex.test(phone.replace(/\s/g, ""));
    };

    const handlePlaceOrder = async (event: FormEvent) => {
        event.preventDefault();
        setAlert({ type: "idle" });

        if (!items.length) {
            setAlert({ type: "error", message: "Your cart is empty. Please add items before checking out." });
            return;
        }

        // Validate required fields
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
                message: "Please fill out all required billing details before placing your order."
            });
            return;
        }

        // Validate email format
        if (!isValidEmail(billing.email)) {
            setAlert({
                type: "error",
                message: "Please enter a valid email address."
            });
            return;
        }

        // Validate phone format
        if (!isValidPhone(billing.phone)) {
            setAlert({
                type: "error",
                message: "Please enter a valid phone number."
            });
            return;
        }

        if (!termsAccepted) {
            setAlert({
                type: "error",
                message: "Please accept the terms and conditions to proceed."
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Map payment method from frontend to backend format
            const paymentMethodMap: Record<PaymentMethod, string> = {
                "bank-transfer": "BANK_TRANSFER",
                "cheque": "BANK_TRANSFER",
                "cod": "CASH_ON_DELIVERY",
                "paypal": "CREDIT_CARD"
            };

            const checkoutData = {
                firstName: billing.firstName,
                lastName: billing.lastName,
                email: billing.email,
                phone: billing.phone,
                address: billing.address,
                city: billing.city || "",
                state: billing.state || "",
                apartment: billing.apartment || "",
                items: items.map((item) => ({
                    productId: item.id!,
                    quantity: item.quantity
                })),
                subtotal: totalPrice,
                taxAmount: 0, // Can be calculated if needed
                shippingCost: shippingCost,
                discountAmount: 0, // Can be calculated from coupon if needed
                totalAmount: grandTotal,
                paymentMethod: paymentMethodMap[paymentMethod] || "BANK_TRANSFER",
                notes: orderNotes || undefined
            };

            const orderResponse = await ordersApi.checkout(checkoutData);

            setAlert({
                type: "success",
                message: `Order placed successfully! Your order number is ${orderResponse.orderNumber}. A confirmation email has been sent to ${billing.email}.`
            });

            setTimeout(() => {
                clearCart();
                navigate(`/track-order?orderNumber=${orderResponse.orderNumber}`);
            }, 3000);
        } catch (error: any) {
            console.error("Checkout error:", error);
            const errorMessage = error.response?.data?.message ||
                               error.message ||
                               "Failed to place order. Please try again.";
            setAlert({
                type: "error",
                message: errorMessage
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const summaryItems = items.map((item, index) => ({
        id: item.id ?? `cart-item-${index}`,
        name: item.name,
        quantity: item.quantity,
        total: formatPrice(item.price * item.quantity)
    }));

    const shippingDisplay = items.length ? (
        `Flat rate ${formatPrice(shippingCost)}`
    ) : (
        <span className="text-muted small">Add items to calculate shipping</span>
    );

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
                                        role="alert">
                                        {alert.message}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn btn-primary-dark-w btn-block btn-pill font-size-20 py-3 mb-3">
                                    {isSubmitting ? "Placing order..." : "Place order"}
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
