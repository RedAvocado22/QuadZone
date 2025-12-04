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
import Divider from '@mui/material/Divider';

import { DashboardContent } from 'src/layouts/dashboard';
import { couponsApi, type Coupon } from 'src/api/coupons';
import { Label } from 'src/components/label';
import { fCurrency } from 'src/utils/formatters';

// ----------------------------------------------------------------------

export function CouponDetailsView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coupon, setCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    const loadCoupon = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await couponsApi.getById(id);
        setCoupon(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load coupon');
      } finally {
        setLoading(false);
      }
    };

    loadCoupon();
  }, [id]);

  const handleEdit = () => {
    if (id) {
      router.push(`/admin/coupon/${id}/edit`);
    }
  };

  const handleBack = () => {
    router.push('/admin/coupon');
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

  if (error || !coupon) {
    return (
      <DashboardContent>
        <Alert severity="error">{error || 'Coupon not found'}</Alert>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          Back to Coupons
        </Button>
      </DashboardContent>
    );
  }

  const isExpired = new Date(coupon.endDate) < new Date();
  const formatValue = (type: string, value: number) => {
    if (type === 'PERCENTAGE') {
      return `${value}%`;
    }
    return fCurrency(value);
  };

  return (
    <DashboardContent>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">Coupon Details</Typography>
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h5">{coupon.code}</Typography>
              <Label color={coupon.active && !isExpired ? 'success' : 'error'}>
                {!coupon.active ? 'Inactive' : isExpired ? 'Expired' : 'Active'}
              </Label>
            </Box>

            <Divider />

            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' } }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Discount Type
                </Typography>
                <Typography variant="body1">
                  <Label color={coupon.discountType === 'PERCENTAGE' ? 'info' : 'warning'}>
                    {coupon.discountType === 'PERCENTAGE' ? 'Percentage' : 'Fixed Amount'}
                  </Label>
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Discount Value
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {formatValue(coupon.discountType, coupon.couponValue)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Max Discount
                </Typography>
                <Typography variant="body1">
                  {coupon.maxDiscountAmount > 0 ? fCurrency(coupon.maxDiscountAmount) : 'No limit'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Min Order Amount
                </Typography>
                <Typography variant="body1">
                  {coupon.minOrderAmount > 0 ? fCurrency(coupon.minOrderAmount) : 'No minimum'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Usage
                </Typography>
                <Typography variant="body1">
                  {coupon.usageCount} / {coupon.maxUsage}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Remaining Uses
                </Typography>
                <Typography variant="body1">
                  {coupon.maxUsage - coupon.usageCount}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Start Date
                </Typography>
                <Typography variant="body1">
                  {new Date(coupon.startDate).toLocaleDateString()}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  End Date
                </Typography>
                <Typography variant="body1">
                  {new Date(coupon.endDate).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Card>
      </Stack>
    </DashboardContent>
  );
}

