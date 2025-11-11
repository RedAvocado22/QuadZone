import { Routes, Route } from "react-router-dom";
import CartPage from "./pages/CartPage";
import UserProvider from "./hooks/useUser";
import { CartProvider } from "./contexts/CartContext";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./routers/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import DemoPage from "./components/demo/DemoPage";
import Layout from "./components/layout/Layout";

function App() {
    return (
        <UserProvider>
            <CartProvider>
                <Layout>
                    <Routes>
                        {/*Public Routes */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="demo" element={<DemoPage />} />

                        {/* Routes for authenticated users */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/cart" element={<CartPage />} />
                        </Route>

                        {/* Error Boundary */}
                        {/* <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="/*" element={<NotFound />} /> */}
                    </Routes>
                </Layout>
            </CartProvider>
            <ToastContainer position="top-right" style={{ zIndex: 999999 }} />
        </UserProvider>
    );
}

export default App;
