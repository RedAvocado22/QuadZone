import { lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { varAlpha } from 'minimal-shared/utils';

import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

const DashboardPage = lazy(() => import('src/pages/dashboard'));
const BlogPage = lazy(() => import('src/pages/blog'));
const UserPage = lazy(() => import('src/pages/user'));
const ProductsPage = lazy(() => import('src/pages/products'));
const CategoryPage = lazy(() => import('src/pages/category'));
const OrderPage = lazy(() => import('src/pages/order'));

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
            {/* Dashboard Layout Routes */}
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
                <Route path="products" element={<ProductsPage />} />
                <Route path="category" element={<CategoryPage />} />
                <Route path="order" element={<OrderPage />} />
                <Route path="blog" element={<BlogPage />} />
            </Route>

        </Routes>
    );
}

