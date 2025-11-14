import { lazy, Suspense } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { varAlpha } from 'minimal-shared/utils';

import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

const DashboardPage = lazy(() => import('src/pages/dashboard'));
const BlogPage = lazy(() => import('src/pages/blog'));
const BlogCreatePage = lazy(() => import('src/pages/blog-create'));
const BlogDetailsPage = lazy(() => import('src/pages/blog-details'));
const BlogEditPage = lazy(() => import('src/pages/blog-edit'));
const UserPage = lazy(() => import('src/pages/user'));
const UserCreatePage = lazy(() => import('src/pages/user-create'));
const UserEditPage = lazy(() => import('src/pages/user-edit'));
const ProductsPage = lazy(() => import('src/pages/products'));
const ProductDetailsPage = lazy(() => import('src/pages/product-details'));
const ProductCreatePage = lazy(() => import('src/pages/product-create'));
const ProductEditPage = lazy(() => import('src/pages/product-edit'));
const CategoryPage = lazy(() => import('src/pages/category'));
const CategoryCreatePage = lazy(() => import('src/pages/category-create'));
const CategoryDetailsPage = lazy(() => import('src/pages/category-details'));
const CategoryEditPage = lazy(() => import('src/pages/category-edit'));
const OrderPage = lazy(() => import('src/pages/order'));
const OrderCreatePage = lazy(() => import('src/pages/order-create'));
const OrderDetailsPage = lazy(() => import('src/pages/order-details'));
const OrderEditPage = lazy(() => import('src/pages/order-edit'));

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
                <Route path="user" element={<UserPage />} />
                <Route path="user/create" element={<UserCreatePage />} />
                <Route path="user/:id/edit" element={<UserEditPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/create" element={<ProductCreatePage />} />
                <Route path="products/:id" element={<ProductDetailsPage />} />
                <Route path="products/:id/edit" element={<ProductEditPage />} />
                <Route path="blog" element={<BlogPage />} />
                <Route path="blog/create" element={<BlogCreatePage />} />
                <Route path="blog/:id" element={<BlogDetailsPage />} />
                <Route path="blog/:id/edit" element={<BlogEditPage />} />
                <Route path="category" element={<CategoryPage />} />
                <Route path="category/create" element={<CategoryCreatePage />} />
                <Route path="category/:id" element={<CategoryDetailsPage />} />
                <Route path="category/:id/edit" element={<CategoryEditPage />} />
                <Route path="order" element={<OrderPage />} />
                <Route path="order/create" element={<OrderCreatePage />} />
                <Route path="order/:id" element={<OrderDetailsPage />} />
                <Route path="order/:id/edit" element={<OrderEditPage />} />
            </Route>
        </Routes>
    );
}

