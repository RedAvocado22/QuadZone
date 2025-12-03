import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";

import CartPage from "./pages/CartPage";
import UserProvider from "./hooks/useUser";
import { CartProvider } from "./contexts/CartContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { ChatProvider } from "./contexts/ChatContext";
import { ThemeProvider } from "./theme/theme-provider";
import HomePage from "./pages/HomePage";
import { ToastContainer } from "react-toastify";
import DemoPage from "./components/demo/DemoPage";
import Layout from "./components/layout/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import UserProfilePage from "./pages/UserProfilePage";
import AboutUsPage from "./pages/AboutUsPage";
import ContactUsPage from "./pages/ContactUsPage";
import CheckoutPage from "@/pages/CheckoutPage";
import "src/assets/css/global.css";
import TrackOrderPage from "./pages/TrackOrderPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import VnPayResultPage from "./pages/VnPayResultPage";
import ShopPage from "./pages/ShopPage";

import { CompareProvider } from "./contexts/CompareContext";
import ComparePage from "./pages/ComparePage";
import WishlistPage from "./pages/WishListPage";
import { WishlistProvider } from "./contexts/WishListContext";
import BlogListPage from "./pages/BlogListPage";
import BlogDetailPage from "./pages/BlogDetailPage";

const AdminRoutes = lazy(() => import("./routing/AdminRoutes"));

const SiteLayout = () => (
    <Layout>
        <Outlet />
    </Layout>
);

function useScrollToTop() {
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);
}

function App() {
    useScrollToTop();

    return (
        <ThemeProvider>
            <UserProvider>
                <CurrencyProvider>
                    <CartProvider>
                        <WishlistProvider>
                            <CompareProvider>
                                <ChatProvider>
                                    <Routes>
                                        {/* Admin Routes (lazy loaded) */}
                                        <Route
                                            path="/admin/*"
                                            element={
                                                <Suspense fallback={<div>Loading admin...</div>}>
                                                    <AdminRoutes />
                                                </Suspense>
                                            }
                                        />

                                        {/* Customer Routes with SiteLayout */}
                                        <Route element={<SiteLayout />}>
                                            <Route index element={<HomePage />} />
                                            <Route path="demo" element={<DemoPage />} />

                                            {/* Authentication */}
                                            <Route path="login" element={<LoginPage />} />
                                            <Route path="register" element={<RegisterPage />} />
                                            <Route path="activate/:token" element={<HomePage />} />
                                            <Route path="reset-password/:token" element={<ResetPasswordPage />} />

                                            {/* Products */}
                                            <Route path="product/:id" element={<ProductDetailPage />} />
                                            <Route path="shop" element={<ShopPage />} />

                                            {/* User */}
                                            <Route path="profile" element={<UserProfilePage />} />

                                            {/* Pages */}
                                            <Route path="about-us" element={<AboutUsPage />} />
                                            <Route path="contact" element={<ContactUsPage />} />

                                            {/* Compare + Wishlist */}
                                            <Route path="compare" element={<ComparePage />} />
                                            <Route path="wishlist" element={<WishlistPage />} />

                                            {/* Cart + Checkout */}
                                            <Route path="cart" element={<CartPage />} />
                                            <Route path="checkout" element={<CheckoutPage />} />
                                            <Route path="track-order" element={<TrackOrderPage />} />
                                            <Route path="order-success" element={<OrderSuccessPage />} />
                                            <Route path="vnpay-result" element={<VnPayResultPage />} />

                                            {/* 404 */}
                                            {/* <Route path="*" element={<NotFound />} /> */}
                                        </Route>
                                    </Routes>

                                    <ToastContainer position="top-right" style={{ zIndex: 999999 }} />
                                </ChatProvider>
                            </CompareProvider>
                        </WishlistProvider>
                    </CartProvider>
                </CurrencyProvider>
            </UserProvider>
        </ThemeProvider>
    );
}

export default App;
