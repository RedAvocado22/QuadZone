import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useProducts as useAdminProducts } from 'src/hooks/useProductsAdmin';
import { DashboardContent } from 'src/layouts/dashboard';
import { useRouter } from 'src/routing/hooks';
import { productsApi } from 'src/api/productsAdmin';

import { ProductItem } from '../product-item';
import { ProductSort } from '../product-sort';

import { Iconify } from 'src/components/iconify';
import { PostSearch } from '../../blog/blog-search';

// ----------------------------------------------------------------------

export function ProductsView() {
  const router = useRouter();
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  // Fetch products from API
  const { products, loading, error, total, refetch } = useAdminProducts({
    page,
    pageSize: 12,
    search,
    sortBy,
  });

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
    setPage(0);
  }, []);

  const handlePageChange = useCallback((_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage - 1);
  }, []);

  const handleSearch = useCallback((searchValue: string) => {
    setSearch(searchValue);
    setPage(0);
  }, []);

  const totalPages = Math.ceil(total / 12);

  const handleCreateProduct = useCallback(() => {
    router.push('/admin/products/create');
  }, [router]);

  const handleViewDetails = useCallback((id: number) => {
    router.push(`/admin/products/${id}`);
  }, [router]);

  const handleEdit = useCallback((id: number) => {
    router.push(`/admin/products/${id}/edit`);
  }, [router]);

  const handleLock = useCallback(async (id: number) => {
    if (window.confirm('Are you sure you want to lock this product?')) {
      try {
        await productsApi.update(id, { status: 'locked' as any });
        refetch();
      } catch (error) {
        console.error('Failed to lock product:', error);
        alert('Failed to lock product');
      }
    }
  }, [refetch]);

  const handleUnlock = useCallback(async (id: number) => {
    if (window.confirm('Are you sure you want to unlock this product?')) {
      try {
        await productsApi.update(id, { status: '' as any });
        refetch();
      } catch (error) {
        console.error('Failed to unlock product:', error);
        alert('Failed to unlock product');
      }
    }
  }, [refetch]);

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Products
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleCreateProduct}
        >
          New Product
        </Button>
      </Box>
      <Card>
        <Box
          sx={{
            mb: 3,
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <PostSearch onSearch={handleSearch} />
          <ProductSort
            sortBy={sortBy}
            onSort={handleSort}
            options={[
              { value: 'newest', label: 'Newest' },
              { value: 'priceDesc', label: 'Price: High-Low' },
              { value: 'priceAsc', label: 'Price: Low-High' },
            ]}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="error">Error loading products: {error.message}</Typography>
            <Button onClick={refetch} sx={{ mt: 2 }}>Retry</Button>
          </Box>
        ) : products.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography>No products found</Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid key={product.id} size={{ xs: 12, sm: 6, md: 3 }}>
                    <ProductItem
                      product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        status: product.isActive ? '' : 'locked',
                        coverUrl: product.imageUrl || '',
                        colors: product.color ? [product.color] : [],
                        priceSale: null,
                      }}
                      onViewDetails={handleViewDetails}
                      onEdit={handleEdit}
                      onLock={handleLock}
                      onUnlock={handleUnlock}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box sx={{ p: 3, pt: 0, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </>
        )}
      </Card>
    </DashboardContent>
  );
}
