import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import CartPage from "./pages/CartPage";
import UserProvider from "./hooks/useUser";
import { CartProvider } from "./contexts/CartContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { ThemeProvider } from "./theme/theme-provider";
import HomePage from "./pages/HomePage";
import { ToastContainer } from "react-toastify";
import DemoPage from "./components/demo/DemoPage";
import Layout from "./components/layout/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AboutUsPage from "./pages/AboutUsPage";
import ContactUsPage from "./pages/ContactUsPage";
import CheckoutPage from "@/pages/CheckoutPage.tsx";
import "src/assets/css/global.css";
import TrackOrderPage from "./pages/TrackOrderPage";

import Shop from "./pages/Shop";

const AdminRoutes = lazy(() => import("./routing/AdminRoutes"));

const SiteLayout = () => (
    <Layout>
        <Outlet />
    </Layout>
);

// Scroll to top on route change
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
                        <Routes>
                            <Route
                                path="/admin/*"
                                element={
                                    <Suspense fallback={<div>Loading admin...</div>}>
                                        <AdminRoutes />
                                    </Suspense>
                                }
                            />

                            <Route element={<SiteLayout />}>
                                {/* Public Routes */}
                                <Route index element={<HomePage />} />
                                <Route path="demo" element={<DemoPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/activate/:token" element={<HomePage />} />
                                <Route path="/register" element={<RegisterPage />} />
                                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                                <Route path="/product/:id" element={<ProductDetailPage />} />
                                <Route path="/shop" element={<Shop />} />
                                <Route path="/about-us" element={<AboutUsPage />} />
                                <Route path="/contact" element={<ContactUsPage />} />

                                {/* Cart - accessible to everyone (guest and authenticated) */}
                                <Route path="cart" element={<CartPage />} />
                                <Route path="checkout" element={<CheckoutPage />} />
                                <Route path="track-order" element={<TrackOrderPage />} />

                                {/* Error Boundary */}
                                {/* <Route path="unauthorized" element={<Unauthorized />} />
                                {/* Error Boundary */}
                                {/* <Route path="unauthorized" element={<Unauthorized />} />
                        <Route path="*" element={<NotFound />} /> */}
                            </Route>
                        </Routes>
                        <ToastContainer position="top-right" style={{ zIndex: 999999 }} />
                    </CartProvider>
                </CurrencyProvider>
            </UserProvider>
        </ThemeProvider>
    );
}

export default App;
