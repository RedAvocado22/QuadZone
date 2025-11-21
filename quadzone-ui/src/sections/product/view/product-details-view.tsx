import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRouter } from 'src/routing/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { DashboardContent } from 'src/layouts/dashboard';
import { productsApi } from 'src/api/productsAdmin';
import { fCurrency } from 'src/utils/formatters';
import { useCurrency } from 'src/contexts/CurrencyContext';
import { Label } from 'src/components/label';
import { ColorPreview } from 'src/components/color-utils';

// ----------------------------------------------------------------------

export function ProductDetailsView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { currency, convertPrice } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const productId = Number(id);
        if (isNaN(productId)) {
          setError('Invalid product ID');
          return;
        }
        const data = await productsApi.getById(productId);
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleEdit = () => {
    router.push(`/admin/products/${id}/edit`);
  };

  const handleBack = () => {
    router.push('/admin/products');
  };

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (error || !product) {
    return (
      <DashboardContent>
        <Alert severity="error">{error || 'Product not found'}</Alert>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          Back to Products
        </Button>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">Product Details</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" onClick={handleEdit}>
              Edit
            </Button>
          </Box>
        </Box>

        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box
                component="img"
                src={product.imageUrl || '/assets/images/product/product-1.webp'}
                alt={product.name}
                sx={{
                  width: 300,
                  height: 300,
                  objectFit: 'cover',
                  borderRadius: 2,
                }}
              />
              <Stack spacing={2} sx={{ flex: 1 }}>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {product.name}
                  </Typography>
                  {!product.isActive && (
                    <Label
                      variant="inverted"
                      color="error"
                      sx={{ mt: 1 }}
                    >
                      Locked
                    </Label>
                  )}
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Price
                  </Typography>
                  <Typography variant="h6">
                    {fCurrency(convertPrice(product.price), { currency })}
                  </Typography>
                </Box>

                {product.color && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Color
                    </Typography>
                    <ColorPreview colors={[product.color]} />
                  </Box>
                )}

                {product.description && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Description
                    </Typography>
                    <Typography variant="body1">{product.description}</Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          </Stack>
        </Card>
      </Stack>
    </DashboardContent>
  );
}
