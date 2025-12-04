import { lazy, Suspense } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { varAlpha } from 'minimal-shared/utils';

import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

const DashboardPage = lazy(() => import('src/pages/admin/dashboard'));
const BlogPage = lazy(() => import('src/pages/admin/blog'));
const BlogCreatePage = lazy(() => import('src/pages/admin/blog-create'));
const BlogDetailsPage = lazy(() => import('src/pages/admin/blog-details'));
const BlogEditPage = lazy(() => import('src/pages/admin/blog-edit'));
const UserPage = lazy(() => import('src/pages/admin/user'));
const UserCreatePage = lazy(() => import('src/pages/admin/user-create'));
const UserEditPage = lazy(() => import('src/pages/admin/user-edit'));
const ProductsPage = lazy(() => import('src/pages/admin/products'));
const ProductDetailsPage = lazy(() => import('src/pages/admin/product-details'));
const ProductCreatePage = lazy(() => import('src/pages/admin/product-create'));
const ProductEditPage = lazy(() => import('src/pages/admin/product-edit'));
const CategoryPage = lazy(() => import('src/pages/admin/category'));
const CategoryCreatePage = lazy(() => import('src/pages/admin/category-create'));
const CategoryDetailsPage = lazy(() => import('src/pages/admin/category-details'));
const CategoryEditPage = lazy(() => import('src/pages/admin/category-edit'));
const OrderPage = lazy(() => import('src/pages/admin/order'));
const OrderCreatePage = lazy(() => import('src/pages/admin/order-create'));
const OrderDetailsPage = lazy(() => import('src/pages/admin/order-details'));
const OrderEditPage = lazy(() => import('src/pages/admin/order-edit'));
const ChatPage = lazy(() => import('src/pages/admin/chat'));
const OrderAssignShipperPage = lazy(() => import('src/pages/admin/order-assign-shipper'));
const OrderAssignDeliveryPage = lazy(() => import('src/pages/admin/order-assign-delivery'));
const CouponPage = lazy(() => import('src/pages/admin/coupon'));
const CouponCreatePage = lazy(() => import('src/pages/admin/coupon-create'));
const CouponDetailsPage = lazy(() => import('src/pages/admin/coupon-details'));
const CouponEditPage = lazy(() => import('src/pages/admin/coupon-edit'));

const renderFallback = () => (
    <Box
        sx={{
            display: 'flex',
            flex: '1 1 auto',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        <LinearProgress
            sx={{
                width: 1,
                maxWidth: 320,
                bgcolor: (theme) =>
                    varAlpha(
                        theme?.vars?.palette?.text?.primaryChannel ?? '0 0 0',
                        0.16
                    ),
                [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
            }}
        />
    </Box>
);

// ----------------------------------------------------------------------

export default function AdminRoutes() {
    return (
        <Routes>
            <Route
                path=""
                element={
                    <DashboardLayout>
                        <Suspense fallback={renderFallback()}>
                            <Outlet />
                        </Suspense>
                    </DashboardLayout>
                }
            >
                <Route index element={<DashboardPage />} />
                {/* User management routes */}
                <Route path="user" element={<UserPage />} />
                <Route path="user/create" element={<UserCreatePage />} />
                <Route path="user/:id/edit" element={<UserEditPage />} />
                {/* Product management routes */}
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/create" element={<ProductCreatePage />} />
                <Route path="products/:id" element={<ProductDetailsPage />} />
                <Route path="products/:id/edit" element={<ProductEditPage />} />
                {/* Blog management routes */}
                <Route path="blog" element={<BlogPage />} />
                <Route path="blog/create" element={<BlogCreatePage />} />
                <Route path="blog/:id" element={<BlogDetailsPage />} />
                <Route path="blog/:id/edit" element={<BlogEditPage />} />
                {/* Category management routes */}
                <Route path="category" element={<CategoryPage />} />
                <Route path="category/create" element={<CategoryCreatePage />} />
                <Route path="category/:id" element={<CategoryDetailsPage />} />
                <Route path="category/:id/edit" element={<CategoryEditPage />} />
                {/* Order management routes */}
                <Route path="order" element={<OrderPage />} />
                <Route path="order/create" element={<OrderCreatePage />} />
                <Route path="order/assign-delivery" element={<OrderAssignDeliveryPage />} />
                <Route path="order/:id" element={<OrderDetailsPage />} />
                <Route path="order/:id/edit" element={<OrderEditPage />} />
                {/* Chat management routes */}
                <Route path="chat" element={<ChatPage />} />
                <Route path="order/:id/assign-shipper" element={<OrderAssignShipperPage />} />
                {/* Coupon management routes */}
                <Route path="coupon" element={<CouponPage />} />
                <Route path="coupon/create" element={<CouponCreatePage />} />
                <Route path="coupon/:id" element={<CouponDetailsPage />} />
                <Route path="coupon/:id/edit" element={<CouponEditPage />} />
            </Route>
        </Routes>
    );
}
