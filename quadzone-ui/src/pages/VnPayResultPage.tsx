import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { paymentsApi } from "../api/payments";
import { useCart } from "../contexts/CartContext";

const VnPayResultPage = () => {
    const { clearCart } = useCart();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const hasCalledApi = useRef(false);

    useEffect(() => {
        // Kiểm tra xem đã gọi API chưa
        if (hasCalledApi.current) {
            return;
        }

        // Kiểm tra xem có params từ VNPay không
        const vnpAmount = searchParams.get("vnp_Amount");
        const vnpResponseCode = searchParams.get("vnp_ResponseCode");
        const vnpTxnRef = searchParams.get("vnp_TxnRef");

        if (!vnpAmount || !vnpResponseCode) {
            // Nếu không có params từ VNPay, redirect về checkout
            toast.error("Thông tin thanh toán không hợp lệ.");
            navigate("/checkout", { replace: true });
            return;
        }

        // Đánh dấu là đã bắt đầu gọi
        hasCalledApi.current = true;

        const verifyPayment = async () => {
            try {
                // Lấy query string từ URL (bao gồm tất cả params từ VNPay)
                const queryString = window.location.search;
                
                // Gọi API để verify và xử lý payment
                const result = await paymentsApi.confirmVnPay(queryString);
                
                const isSuccess = result.vnp_ResponseCode === "00";
                const orderNumber = result.vnp_TxnRef || vnpTxnRef || "";

                if (isSuccess) {
                    clearCart();
                    toast.success("Thanh toán thành công!");
                    
                    // Redirect về trang order success với orderNumber
                    const successUrl = orderNumber
                        ? `/order-success?orderNumber=${encodeURIComponent(orderNumber)}`
                        : "/order-success";
                    
                    setTimeout(() => {
                        navigate(successUrl, { replace: true });
                    }, 500);
                } else {
                    toast.error(result.message || "Thanh toán thất bại. Vui lòng thử lại.");
                    navigate("/checkout", { replace: true });
                }
            } catch (error: any) {
                console.error("Payment verification error:", error);
                
                // Xử lý lỗi
                let errorMessage = "Không xác thực được giao dịch.";
                
                if (error.response) {
                    if (error.response.status === 400) {
                        errorMessage = error.response.data || "Chữ ký không hợp lệ hoặc giao dịch thất bại.";
                    } else {
                        errorMessage = error.response.data?.message || error.response.data || errorMessage;
                    }
                } else if (error.message) {
                    errorMessage = error.message;
                }
                
                toast.error(errorMessage);
                
                // Vẫn redirect về checkout
                setTimeout(() => {
                    navigate("/checkout", { replace: true });
                }, 1000);
            }
        };

        verifyPayment();
    }, [clearCart, navigate, searchParams]);

    return (
        <div className="container py-8" style={{ minHeight: "60vh" }}>
            <div className="row justify-content-center">
                <div className="col-md-8 text-center">
                    <h2 className="text-primary">Đang xác thực thanh toán...</h2>
                    <div className="spinner-border text-primary my-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Vui lòng chờ trong giây lát, chúng tôi sẽ chuyển bạn tới trang kết quả.</p>
                </div>
            </div>
        </div>
    );
};

export default VnPayResultPage;