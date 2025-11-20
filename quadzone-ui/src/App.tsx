import { Suspense, lazy } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import CartPage from "./pages/CartPage";
import UserProvider from "./hooks/useUser";
import { CartProvider } from "./contexts/CartContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import HomePage from "./pages/HomePage";
import { ToastContainer } from "react-toastify";
import DemoPage from "./components/demo/DemoPage";
import Layout from "./components/layout/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CheckoutPage from "./pages/CheckoutPage";

const AdminApp = lazy(() => import("./AdminApp"));
const AdminRoutes = lazy(() => import("./AdminRoutes"));

const SiteLayout = () => (
    <Layout>
        <Outlet />
    </Layout>
);

function App() {
    return (
        <UserProvider>
            <CurrencyProvider>
                <CartProvider>
                    <Routes>
                    <Route
                        path="/admin/*"
                        element={
                            <Suspense fallback={<div>Loading admin...</div>}>
                                <AdminApp>
                                    <AdminRoutes />
                                </AdminApp>
                            </Suspense>
                        }
                    />

                    <Route element={<SiteLayout />}>
                        {/* Public Routes */}
                        <Route index element={<HomePage />} />
                        <Route path="demo" element={<DemoPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/activate/:token" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        {/* Cart - accessible to everyone (guest and authenticated) */}
                        <Route path="cart" element={<CartPage />} />

                        {/* Error Boundary */}
                        {/* <Route path="unauthorized" element={<Unauthorized />} />
                        <Route path="*" element={<NotFound />} /> */}
                    </Route>
                    </Routes>
                    <ToastContainer position="top-right" style={{ zIndex: 999999 }} />
                </CartProvider>
            </CurrencyProvider>
        </UserProvider>
    );
}

export default App;
