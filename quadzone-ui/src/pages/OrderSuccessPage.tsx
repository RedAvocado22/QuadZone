import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import API from "../api/base";
import { fCurrency } from "../utils/formatters";
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

const OrderSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const orderNumber = searchParams.get("orderNumber") || "";
    const { currency, convertPrice } = useCurrency();
    
    const [orderStatus, setOrderStatus] = useState<OrderStatusResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const formatPrice = (value: number) => fCurrency(convertPrice(value), { currency });

    const formatStatus = (status: string | null): string => {
        if (!status) return "Unknown";
        return status
            .split("_")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    };

    const formatDate = (dateString: string | null): string => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    useEffect(() => {
        const fetchOrderStatus = async () => {
            if (!orderNumber.trim()) {
                setError("Order number is missing");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            
            try {
                const response = await API.get<OrderStatusResponse>(
                    `/orders/public/track?orderNumber=${encodeURIComponent(orderNumber.trim())}`
                );
                
                if (response.data.status === null) {
                    setError(response.data.message || "Order not found");
                } else {
                    setOrderStatus(response.data);
                }
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || 
                                   err.message || 
                                   "Failed to load order information. Please try again.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderStatus();
    }, [orderNumber]);

    if (loading) {
        return (
            <div className="container py-10">
                <div className="row justify-content-center">
                    <div className="col-lg-9">
                        <div className="text-center py-8">
                            <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <p className="text-gray-700 font-size-16">Loading order information...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-10">
            <div className="row justify-content-center">
                <div className="col-lg-9">
                    {error ? (
                        <div className="card border-danger shadow-sm">
                            <div className="card-body p-5 text-center">
                                <div className="mb-4">
                                    <i className="ec ec-close-circled text-danger" style={{ fontSize: "64px" }}></i>
                                </div>
                                <h4 className="text-danger mb-3">Unable to load order information</h4>
                                <p className="text-gray-700 mb-4">{error}</p>
                                <Link to="/shop" className="btn btn-primary btn-lg">
                                    <i className="ec ec-shopping-bag mr-2"></i>
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    ) : orderStatus && orderStatus.status ? (
                        <>
                            {/* Success Header */}
                            <div className="text-center mb-6" style={{ animation: 'fadeIn 0.6s ease-in' }}>
                                <div className="mb-4 position-relative d-inline-block">
                                    <div className="position-absolute top-50 start-50 translate-middle" 
                                         style={{
                                             width: '120px',
                                             height: '120px',
                                             background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                             borderRadius: '50%',
                                             opacity: 0.1,
                                             animation: 'pulse 2s infinite'
                                         }}></div>
                                    <i className="ec ec-check-circle text-success position-relative" 
                                       style={{ fontSize: "100px", zIndex: 1 }}></i>
                                </div>
                                <h1 className="mb-3 text-success font-weight-bold" style={{ fontSize: "2.5rem" }}>
                                    Order Placed Successfully!
                                </h1>
                                <p className="text-gray-700 font-size-18 mb-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
                                    Thank you for your order. We have received your order and will begin processing it right away.
                                </p>
                                {orderStatus.orderNumber && (
                                    <div className="d-inline-block px-4 py-2 bg-light border rounded-pill">
                                        <span className="text-gray-700 mr-2">Order Number:</span>
                                        <strong className="text-primary font-size-18">{orderStatus.orderNumber}</strong>
                                    </div>
                                )}
                            </div>

                            {/* Order Details Card */}
                            <div className="card border-0 shadow-lg mb-4" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                                <div className="card-header bg-primary text-white py-3">
                                    <h5 className="card-title mb-0 font-weight-bold">
                                        <i className="ec ec-notebook mr-2"></i>
                                        Order Details
                                    </h5>
                                </div>
                                <div className="card-body p-5">
                                    <div className="row">
                                        <div className="col-md-6 mb-4">
                                            <div className="d-flex align-items-start">
                                                <div className="mr-3">
                                                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" 
                                                         style={{ width: '40px', height: '40px' }}>
                                                        <i className="ec ec-tags text-white"></i>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600 font-size-14 mb-1">Order Number</p>
                                                    <p className="mb-0 font-weight-bold text-primary font-size-16">
                                                        {orderStatus.orderNumber}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-4">
                                            <div className="d-flex align-items-start">
                                                <div className="mr-3">
                                                    <div className="bg-success rounded-circle d-flex align-items-center justify-content-center" 
                                                         style={{ width: '40px', height: '40px' }}>
                                                        <i className="ec ec-check text-white"></i>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600 font-size-14 mb-1">Status</p>
                                                    <p className="mb-0 font-weight-bold text-success font-size-16">
                                                        {formatStatus(orderStatus.status)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="my-4" />

                                    {orderStatus.customerName && (
                                        <>
                                            <div className="row">
                                                <div className="col-md-6 mb-4">
                                                    <div className="d-flex align-items-start">
                                                        <div className="mr-3">
                                                            <div className="bg-info rounded-circle d-flex align-items-center justify-content-center" 
                                                                 style={{ width: '40px', height: '40px' }}>
                                                                <i className="ec ec-user text-white"></i>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-600 font-size-14 mb-1">Customer Name</p>
                                                            <p className="mb-0 font-weight-bold text-gray-90 font-size-16">
                                                                {orderStatus.customerName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-4">
                                                    <div className="d-flex align-items-start">
                                                        <div className="mr-3">
                                                            <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center" 
                                                                 style={{ width: '40px', height: '40px' }}>
                                                                <i className="ec ec-calendar text-white"></i>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-600 font-size-14 mb-1">Order Date</p>
                                                            <p className="mb-0 font-weight-bold text-gray-90 font-size-16">
                                                                {formatDate(orderStatus.orderDate)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr className="my-4" />
                                        </>
                                    )}

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <div className="d-flex align-items-start">
                                                <div className="mr-3">
                                                    <div className="bg-danger rounded-circle d-flex align-items-center justify-content-center" 
                                                         style={{ width: '40px', height: '40px' }}>
                                                        <i className="ec ec-money text-white"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1">
                                                    <p className="text-gray-600 font-size-14 mb-1">Total Amount</p>
                                                    <p className="mb-0 font-weight-bold text-danger font-size-20">
                                                        {orderStatus.totalAmount 
                                                            ? formatPrice(orderStatus.totalAmount)
                                                            : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="d-flex align-items-start">
                                                <div className="mr-3">
                                                    <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center" 
                                                         style={{ width: '40px', height: '40px' }}>
                                                        <i className="ec ec-shopping-bag text-white"></i>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600 font-size-14 mb-1">Items</p>
                                                    <p className="mb-0 font-weight-bold text-gray-90 font-size-16">
                                                        {orderStatus.itemsCount} item(s)
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Next Steps */}
                            <div className="card border-0 mb-4" style={{ 
                                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                                borderRadius: '12px'
                            }}>
                                <div className="card-body p-5">
                                    <h6 className="card-title mb-4 font-weight-bold d-flex align-items-center">
                                        <i className="ec ec-info mr-2 text-primary" style={{ fontSize: '24px' }}></i>
                                        <span className="font-size-18">What's Next?</span>
                                    </h6>
                                    <ul className="mb-0 pl-3" style={{ listStyle: 'none' }}>
                                        <li className="mb-3 d-flex align-items-start">
                                            <i className="ec ec-check text-success mr-2 mt-1"></i>
                                            <span className="text-gray-90 font-size-15">
                                                You will receive an order confirmation email with all the details
                                            </span>
                                        </li>
                                        <li className="mb-3 d-flex align-items-start">
                                            <i className="ec ec-check text-success mr-2 mt-1"></i>
                                            <span className="text-gray-90 font-size-15">
                                                We will notify you when your order ships
                                            </span>
                                        </li>
                                        <li className="d-flex align-items-start">
                                            <i className="ec ec-check text-success mr-2 mt-1"></i>
                                            <span className="text-gray-90 font-size-15">
                                                You can track your order status anytime using your order number
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="text-center mb-5">
                                <Link 
                                    to={`/track-order?orderNumber=${orderStatus.orderNumber}`}
                                    className="btn btn-outline-primary btn-lg mr-3 mb-2 mb-md-0"
                                    style={{ 
                                        minWidth: '200px',
                                        borderRadius: '8px',
                                        padding: '12px 30px',
                                        fontSize: '16px',
                                        fontWeight: 600
                                    }}
                                >
                                    <i className="ec ec-transport mr-2"></i>
                                    Track Your Order
                                </Link>
                                <Link 
                                    to="/shop"
                                    className="btn btn-primary btn-lg mb-2 mb-md-0"
                                    style={{ 
                                        minWidth: '200px',
                                        borderRadius: '8px',
                                        padding: '12px 30px',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        boxShadow: '0 4px 12px rgba(0,123,255,0.3)'
                                    }}
                                >
                                    <i className="ec ec-shopping-bag mr-2"></i>
                                    Continue Shopping
                                </Link>
                            </div>

                            {/* Help Section */}
                            <div className="text-center py-4 border-top">
                                <p className="text-gray-700 font-size-15 mb-0">
                                    Need help? <Link to="/contact" className="text-primary font-weight-bold">Contact our support team</Link>
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="card border-warning shadow-sm">
                            <div className="card-body p-5 text-center">
                                <div className="mb-4">
                                    <i className="ec ec-info text-warning" style={{ fontSize: "64px" }}></i>
                                </div>
                                <h4 className="text-warning mb-3">Unable to load order information</h4>
                                <p className="text-gray-700 mb-4">
                                    Please try tracking your order manually.
                                </p>
                                <div>
                                    <Link to="/track-order" className="btn btn-primary btn-lg mr-3 mb-2 mb-md-0">
                                        <i className="ec ec-transport mr-2"></i>
                                        Track Order
                                    </Link>
                                    <Link to="/shop" className="btn btn-outline-primary btn-lg mb-2 mb-md-0">
                                        <i className="ec ec-shopping-bag mr-2"></i>
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes pulse {
                    0%, 100% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 0.1;
                    }
                    50% {
                        transform: translate(-50%, -50%) scale(1.1);
                        opacity: 0.15;
                    }
                }
            `}</style>
        </div>
    );
};

export default OrderSuccessPage;

