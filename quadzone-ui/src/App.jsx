import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import HomeV6 from './pages/HomeV6';
import CartPage from './pages/CartPage';
import AdminApp from './admin/AdminApp';
import AdminRoutes from './admin/AdminRoutes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <AdminApp>
              <AdminRoutes />
            </AdminApp>
          }
        />
        
        {/* Main App Routes */}
        <Route
          path="/*"
          element={
            <AuthProvider>
              <CartProvider>
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomeV6 />} />
                    <Route path="/cart" element={<CartPage />} />
                  </Routes>
                </Layout>
              </CartProvider>
            </AuthProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

