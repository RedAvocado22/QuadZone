import { useState, useEffect, type FormEvent, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { fCurrency } from "../utils/formatters";
import { useUser } from "../hooks/useUser";
import { ordersApi } from "../api/orders";
import { couponsApi } from "../api/coupons";
import { shippingApi } from "../api/shipping";
import { toast } from "react-toastify";
import CheckoutBreadcrumb from "../components/checkout/CheckoutBreadcrumb";
import CouponSection from "../components/checkout/CouponSection";
import AddressFieldsSection from "../components/checkout/AddressFieldSection";
import OrderNotes from "../components/checkout/OrderNote";
import OrderSummary from "../components/checkout/OrderSummary";
import PaymentMethods from "../components/checkout/PaymentMethod";
import TermsCheckbox from "../components/checkout/TermsCheckbox";
import type { AddressFields, PaymentMethod } from "../types/checkout";
import "../assets/css/checkout.css";

const emptyAddress: AddressFields = {
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    block: "",
    district: "",
    city: "",
    email: "",
    phone: ""
};

const SHIPPING_FLAT_RATE = 10;

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { items, totalPrice, clearCart } = useCart();
    const { currency, convertPrice } = useCurrency();
    const { user } = useUser();

    const [isCouponOpen, setCouponOpen] = useState(false);
    const [billing, setBilling] = useState<AddressFields>(emptyAddress);
    const [couponCode, setCouponCode] = useState("");
    const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [orderNotes, setOrderNotes] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank-transfer");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shippingCost, setShippingCost] = useState(SHIPPING_FLAT_RATE);
    const [shippingMessage, setShippingMessage] = useState<string | null>(null);
    const [isShippingDirty, setIsShippingDirty] = useState(false);
    const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

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

    // Check if address is complete enough to calculate shipping
    const isAddressComplete = useCallback((address: AddressFields): boolean => {
        return !!(
            address.address &&
            address.district &&
            address.city &&
            address.address.trim() !== "" &&
            address.district.trim() !== "" &&
            address.city.trim() !== ""
        );
    }, []);

    // Calculate shipping cost when address is complete
    const calculateShippingCost = useCallback(async (address: AddressFields) => {
        if (!isAddressComplete(address) || !items.length) {
            return;
        }

        setIsCalculatingShipping(true);
        try {
            const response = await shippingApi.calculate({
                address: address.address,
                apartment: address.apartment || undefined,
                block: address.block || undefined,
                district: address.district,
                city: address.city,
            });
            setShippingCost(response.shippingCost);
            setShippingMessage(response.message);
            setIsShippingDirty(false);
        } catch (error: any) {
            console.error("Error calculating shipping cost:", error);
            setShippingCost(SHIPPING_FLAT_RATE);
            setShippingMessage("Unable to calculate shipping. Using default rate.");
        } finally {
            setIsCalculatingShipping(false);
        }
    }, [isAddressComplete, items.length]);

    const handleBillingChange = (field: keyof AddressFields, value: string) => {
        const updatedBilling = { ...billing, [field]: value };
        setBilling(updatedBilling);
        
        if (field === "address" || field === "apartment" || field === "block" || field === "district" || field === "city") {
            setIsShippingDirty(true);
            setShippingMessage(null);
        }
    };

    const handleApplyCoupon = async (event: FormEvent) => {
        event.preventDefault();
        if (!couponCode.trim()) {
            return;
        }
        try {
            if (!items.length) {
                toast.error("Your cart is empty. Add items before applying a coupon.");
                return;
            }

            const trimmed = couponCode.trim();
            const response = await couponsApi.validate({
                code: trimmed,
                subtotal: totalPrice,
            });

            if (!response.valid) {
                setDiscountAmount(0);
                toast.error(response.message || "Coupon is not valid.");
                return;
            }

            setDiscountAmount(response.discountAmount);
            setAppliedCouponCode(trimmed);
            toast.success(response.message || `Coupon "${trimmed}" applied successfully!`);
            setCouponCode("");
            setCouponOpen(false);
        } catch (error: any) {
            console.error("Apply coupon error:", error);
            const errorMessage = error.response?.data?.message ||
                error.message ||
                "Failed to apply coupon. Please try again.";
            toast.error(errorMessage);
        }
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

        if (!items.length) {
            toast.error("Your cart is empty. Please add items before checking out.");
            return;
        }

        // Validate required fields
        if (
            !billing.firstName ||
            !billing.lastName ||
            !billing.email ||
            !billing.phone ||
            !billing.address ||
            !billing.apartment ||
            !billing.block ||
            !billing.district ||
            !billing.city
        ) {
            toast.error("Please fill out all required billing details before placing your order.");
            return;
        }

        // Validate email format
        if (!isValidEmail(billing.email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        // Validate phone format
        if (!isValidPhone(billing.phone)) {
            toast.error("Please enter a valid phone number.");
            return;
        }

        if (!termsAccepted) {
            toast.error("Please accept the terms and conditions to proceed.");
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
                apartment: billing.apartment || "",
                block: billing.block || "",
                district: billing.district || "",
                city: billing.city || "",
                items: items.map((item) => ({
                    productId: item.id!,
                    quantity: item.quantity
                })),
                subtotal: totalPrice,
                taxAmount: 0, // Can be calculated if needed
                shippingCost: shippingCost,
                discountAmount: discountAmount,
                totalAmount: totalPrice + shippingCost - discountAmount,
                couponCode: appliedCouponCode || undefined,
                paymentMethod: paymentMethodMap[paymentMethod] || "BANK_TRANSFER",
                notes: orderNotes || undefined
            };

            const orderResponse = await ordersApi.checkout(checkoutData);

            toast.success(`Order placed successfully! Your order number is ${orderResponse.orderNumber}. A confirmation email has been sent to ${billing.email}.`);

            setTimeout(() => {
                clearCart();
                navigate(`/order-success?orderNumber=${orderResponse.orderNumber}`);
            }, 3000);
        } catch (error: any) {
            console.error("Checkout error:", error);
            const errorMessage = error.response?.data?.message ||
                               error.message ||
                               "Failed to place order. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleManualShippingCalculation = () => {
        if (!items.length) {
            toast.error("Add items to your cart before calculating shipping.");
            return;
        }
        if (!isAddressComplete(billing)) {
            toast.error("Please complete the address fields before calculating shipping.");
            return;
        }
        calculateShippingCost(billing);
    };

    const summaryItems = items.map((item, index) => ({
        id: item.id ?? `cart-item-${index}`,
        name: item.name,
        quantity: item.quantity,
        total: formatPrice(item.price * item.quantity)
    }));

    const canCalculateShipping = items.length > 0 && isAddressComplete(billing);

    const shippingDisplay = (
        <div className="d-flex flex-column align-items-end">
            <div>
                {items.length ? (
                    isCalculatingShipping ? (
                        <span className="text-muted small">Calculating shipping...</span>
                    ) : (
                        formatPrice(shippingCost)
                    )
                ) : (
                    <span className="text-muted small">Add items to calculate shipping</span>
                )}
            </div>
            <button
                type="button"
                className="btn btn-sm btn-outline-primary mt-2"
                disabled={isCalculatingShipping || !canCalculateShipping}
                onClick={handleManualShippingCalculation}
            >
                {isCalculatingShipping ? "Calculating..." : "Calculate shipping"}
            </button>
            {shippingMessage && (
                <small className="text-muted mt-1 text-right w-100">{shippingMessage}</small>
            )}
            {isShippingDirty && (
                <small className="text-warning mt-1 text-right w-100">Address changed — recalculate for accurate fee.</small>
            )}
        </div>
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

                                <OrderNotes value={orderNotes} onChange={setOrderNotes} />
                            </div>
                        </div>

                        <div className="col-lg-5 order-lg-2 order-1 mb-5">
                            <div className="pl-lg-4">
                                <OrderSummary
                                    items={summaryItems}
                                    subtotal={formatPrice(totalPrice)}
                                    shipping={shippingDisplay}
                                    discount={discountAmount > 0 ? `- ${formatPrice(discountAmount)}` : undefined}
                                    total={formatPrice(totalPrice + shippingCost - discountAmount)}
                                />
                                <PaymentMethods selected={paymentMethod} onChange={setPaymentMethod} />
                                <TermsCheckbox checked={termsAccepted} onChange={setTermsAccepted} />

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
