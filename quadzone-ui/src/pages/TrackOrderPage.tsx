import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/base";
import { fCurrency } from "../utils/format-number";
import { useCurrency } from "../contexts/CurrencyContext";

interface OrderStatusResponse {
    orderNumber: string;
    customerName: string | null;
    status: string | null;
    orderDate: string | null;
    totalAmount: number | null;
    itemsCount: number;
    message: string;
}

const TrackOrderPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialOrderNumber = searchParams.get("orderNumber") || "";
    const { currency, convertPrice } = useCurrency();
    
    const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
    const [orderStatus, setOrderStatus] = useState<OrderStatusResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formatPrice = (value: number) => fCurrency(convertPrice(value), { currency });

    const formatStatus = (status: string | null): string => {
        if (!status) return "Unknown";
        return status
            .split("_")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    };

    const getStatusColor = (status: string | null): string => {
        if (!status) return "text-muted";
        switch (status.toUpperCase()) {
            case "PENDING":
                return "text-warning";
            case "PROCESSING":
            case "IN_PROGRESS":
                return "text-info";
            case "COMPLETED":
            case "DELIVERED":
                return "text-success";
            case "CANCELLED":
            case "CANCELED":
                return "text-danger";
            default:
                return "text-muted";
        }
    };

    const handleTrackOrder = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setOrderStatus(null);

        if (!orderNumber.trim()) {
            setError("Please enter an order number");
            return;
        }

        setLoading(true);
        try {
            const response = await API.get<OrderStatusResponse>(
                `/orders/public/track?orderNumber=${encodeURIComponent(orderNumber.trim())}`
            );
            
            if (response.data.status === null) {
                setError(response.data.message || "Order not found");
            } else {
                setOrderStatus(response.data);
                setSearchParams({ orderNumber: orderNumber.trim() });
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 
                               err.message || 
                               "Failed to track order. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="text-center mb-5">
                        <h1 className="mb-3">Track Your Order</h1>
                        <p className="text-muted">
                            Enter your order number to check the status of your order
                        </p>
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <form onSubmit={handleTrackOrder}>
                                <div className="form-group mb-4">
                                    <label htmlFor="orderNumber" className="form-label font-weight-bold">
                                        Order Number
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            id="orderNumber"
                                            placeholder="e.g., ORD-00001"
                                            value={orderNumber}
                                            onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                                            required
                                        />
                                        <div className="input-group-append">
                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-lg"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm mr-2" />
                                                        Tracking...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="ec ec-transport mr-2"></i>
                                                        Track Order
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <small className="form-text text-muted">
                                        Your order number was sent to your email after placing the order
                                    </small>
                                </div>
                            </form>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    <i className="ec ec-close-circled mr-2"></i>
                                    {error}
                                </div>
                            )}

                            {orderStatus && orderStatus.status && (
                                <div className="mt-4">
                                    <div className="alert alert-success" role="alert">
                                        <h5 className="alert-heading">
                                            <i className="ec ec-check mr-2"></i>
                                            Order Found!
                                        </h5>
                                        <p className="mb-0">{orderStatus.message}</p>
                                    </div>

                                    <div className="card bg-light mt-3">
                                        <div className="card-body">
                                            <h5 className="card-title mb-4">Order Details</h5>
                                            
                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <strong>Order Number:</strong>
                                                    <p className="mb-0 font-weight-bold text-primary">
                                                        {orderStatus.orderNumber}
                                                    </p>
                                                </div>
                                                <div className="col-md-6">
                                                    <strong>Status:</strong>
                                                    <p className={`mb-0 font-weight-bold ${getStatusColor(orderStatus.status)}`}>
                                                        {formatStatus(orderStatus.status)}
                                                    </p>
                                                </div>
                                            </div>

                                            {orderStatus.customerName && (
                                                <div className="row mb-3">
                                                    <div className="col-md-6">
                                                        <strong>Customer Name:</strong>
                                                        <p className="mb-0">{orderStatus.customerName}</p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <strong>Order Date:</strong>
                                                        <p className="mb-0">
                                                            {orderStatus.orderDate 
                                                                ? new Date(orderStatus.orderDate).toLocaleString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })
                                                                : 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <strong>Total Amount:</strong>
                                                    <p className="mb-0 font-weight-bold">
                                                        {orderStatus.totalAmount 
                                                            ? formatPrice(orderStatus.totalAmount)
                                                            : 'N/A'}
                                                    </p>
                                                </div>
                                                <div className="col-md-6">
                                                    <strong>Items:</strong>
                                                    <p className="mb-0">{orderStatus.itemsCount} item(s)</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-muted">
                            Need help? <a href="/contact">Contact our support team</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackOrderPage;

