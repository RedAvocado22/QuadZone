import { Suspense, lazy } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import CartPage from "./pages/CartPage";
import UserProvider from "./hooks/useUser";
import { CartProvider } from "./contexts/CartContext";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./routers/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import DemoPage from "./components/demo/DemoPage";
import Layout from "./components/layout/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import Shop from "./pages/Shop";

const AdminApp = lazy(() => import("./admin/AdminApp"));
const AdminRoutes = lazy(() => import("./admin/AdminRoutes"));

const SiteLayout = () => (
    <Layout>
        <Outlet />
    </Layout>
);

function App() {
    return (
        <UserProvider>
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
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                        <Route path="/shop" element={<Shop/>} />
                        {/* Routes for authenticated users */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="cart" element={<CartPage />} />
                        </Route>

                        {/* Error Boundary */}
                        {/* <Route path="unauthorized" element={<Unauthorized />} />
                        <Route path="*" element={<NotFound />} /> */}
                    </Route>
                </Routes>
                <ToastContainer position="top-right" style={{ zIndex: 999999 }} />
            </CartProvider>
        </UserProvider>
    );
}

export default App;
