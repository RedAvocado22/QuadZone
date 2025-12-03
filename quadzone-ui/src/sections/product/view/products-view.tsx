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
import { ProductFilters } from '../product-filters';

import { Iconify } from 'src/components/iconify';
import { PostSearch } from '../../blog/post-search';

import type { FiltersProps } from '../product-filters';

// ----------------------------------------------------------------------

const GENDER_OPTIONS = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'kids', label: 'Kids' },
];

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'shose', label: 'Shose' },
  { value: 'apparel', label: 'Apparel' },
  { value: 'accessories', label: 'Accessories' },
];

const RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];

const PRICE_OPTIONS = [
  { value: 'below', label: 'Below $25' },
  { value: 'between', label: 'Between $25 - $75' },
  { value: 'above', label: 'Above $75' },
];

const COLOR_OPTIONS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

const defaultFilters = {
  price: '',
  gender: [GENDER_OPTIONS[0].value],
  colors: [COLOR_OPTIONS[4]],
  rating: RATING_OPTIONS[0],
  category: CATEGORY_OPTIONS[0].value,
};

export function ProductsView() {
  const router = useRouter();
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(0);
  const [openFilter, setOpenFilter] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<FiltersProps>(defaultFilters);

  // Fetch products from API
  const { products, loading, error, total, refetch } = useAdminProducts({
    page,
    pageSize: 12,
    search,
    category: filters.category,
    price: filters.price,
    gender: filters.gender,
    colors: filters.colors,
    rating: filters.rating,
  });

  const handleOpenFilter = useCallback(() => {
    setOpenFilter(true);
  }, []);

  const handleCloseFilter = useCallback(() => {
    setOpenFilter(false);
  }, []);

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
    setPage(0);
  }, []);

  const handleSetFilters = useCallback((updateState: Partial<FiltersProps>) => {
    setFilters((prevValue) => ({ ...prevValue, ...updateState }));
    setPage(0);
  }, []);

  const handlePageChange = useCallback((_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage - 1);
  }, []);

  const handleSearch = useCallback((searchValue: string) => {
    setSearch(searchValue);
    setPage(0);
  }, []);

  const canReset = Object.keys(filters).some(
    (key) => filters[key as keyof FiltersProps] !== defaultFilters[key as keyof FiltersProps]
  );

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
      await productsApi.update(id, { status: 'active' as any }); 
      refetch();
    } catch (error) {
      console.error('Failed to unlock product:', error);
      alert('Failed to unlock product');
    }
  }
}, [refetch])

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
          <Box
            sx={{
              my: 1,
              gap: 1,
              flexShrink: 0,
              display: 'flex',
            }}
          >
            <ProductFilters
              canReset={canReset}
              filters={filters}
              onSetFilters={handleSetFilters}
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
              onResetFilter={() => setFilters(defaultFilters)}
              options={{
                genders: GENDER_OPTIONS,
                categories: CATEGORY_OPTIONS,
                ratings: RATING_OPTIONS,
                price: PRICE_OPTIONS,
                colors: COLOR_OPTIONS,
              }}
            />

            <ProductSort
              sortBy={sortBy}
              onSort={handleSort}
              options={[
                { value: 'featured', label: 'Featured' },
                { value: 'newest', label: 'Newest' },
                { value: 'priceDesc', label: 'Price: High-Low' },
                { value: 'priceAsc', label: 'Price: Low-High' },
              ]}
            />
          </Box>
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
                              coverUrl: product.imageUrl ||'/assets/images/product/product-1.webp',
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
