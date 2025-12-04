import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import { DashboardContent } from 'src/layouts/dashboard';
import { couponsApi, type DiscountType } from 'src/api/coupons';

// ----------------------------------------------------------------------

interface CouponEditFormProps {
  couponId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const DISCOUNT_TYPE_OPTIONS: DiscountType[] = ['PERCENTAGE', 'FIXED_AMOUNT'];

export function CouponEditForm({ couponId, onSuccess, onCancel }: CouponEditFormProps) {
  const [loading, setLoading] = useState(false);
  const [loadingCoupon, setLoadingCoupon] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE' as DiscountType,
    couponValue: 0,
    maxDiscountAmount: 0,
    minOrderAmount: 0,
    maxUsage: 100,
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    active: true,
  });

  useEffect(() => {
    const loadCoupon = async () => {
      setLoadingCoupon(true);
      setError(null);
      try {
        const coupon = await couponsApi.getById(couponId);
        setFormData({
          code: coupon.code || '',
          discountType: coupon.discountType || 'PERCENTAGE',
          couponValue: coupon.couponValue ?? 0,
          maxDiscountAmount: coupon.maxDiscountAmount ?? 0,
          minOrderAmount: coupon.minOrderAmount ?? 0,
          maxUsage: coupon.maxUsage ?? 100,
          startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
          endDate: coupon.endDate ? new Date(coupon.endDate).toISOString().slice(0, 16) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
          active: coupon.active ?? true,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load coupon');
      } finally {
        setLoadingCoupon(false);
      }
    };

    loadCoupon();
  }, [couponId]);

  const handleChange = (field: keyof typeof formData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: ['couponValue', 'maxDiscountAmount', 'minOrderAmount', 'maxUsage'].includes(field)
          ? Number(value)
          : value,
      }));
      setError(null);
    };

  const handleSwitchChange = (field: keyof typeof formData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.checked,
      }));
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!formData.code) {
      setError('Coupon code is required');
      return;
    }

    if (formData.couponValue <= 0) {
      setError('Discount value must be greater than 0');
      return;
    }

    if (formData.discountType === 'PERCENTAGE' && formData.couponValue > 100) {
      setError('Percentage discount cannot exceed 100%');
      return;
    }

    const payload = {
      code: formData.code.toUpperCase(),
      discountType: formData.discountType,
      couponValue: formData.couponValue,
      maxDiscountAmount: formData.maxDiscountAmount,
      minOrderAmount: formData.minOrderAmount,
      maxUsage: formData.maxUsage,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      active: formData.active,
    };

    setLoading(true);
    try {
      await couponsApi.update(couponId, payload);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update coupon');
    } finally {
      setLoading(false);
    }
  };

  if (loadingCoupon) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">Edit Coupon</Typography>
          <Button variant="outlined" onClick={onCancel}>
            ← Back
          </Button>
        </Box>

        <Card sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                fullWidth
                label="Coupon Code"
                required
                value={formData.code}
                onChange={handleChange('code')}
                placeholder="e.g., SUMMER2024"
                helperText="Code will be converted to uppercase"
              />

              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                }}
              >
                <TextField
                  select
                  fullWidth
                  label="Discount Type"
                  value={formData.discountType}
                  onChange={handleChange('discountType')}
                >
                  {DISCOUNT_TYPE_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option === 'PERCENTAGE' ? 'Percentage (%)' : 'Fixed Amount ($)'}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  type="number"
                  label={formData.discountType === 'PERCENTAGE' ? 'Discount Percentage' : 'Discount Amount'}
                  value={formData.couponValue}
                  onChange={handleChange('couponValue')}
                  inputProps={{ min: 0, max: formData.discountType === 'PERCENTAGE' ? 100 : undefined, step: 0.01 }}
                  required
                />
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                }}
              >
                <TextField
                  fullWidth
                  type="number"
                  label="Max Discount Amount"
                  value={formData.maxDiscountAmount}
                  onChange={handleChange('maxDiscountAmount')}
                  inputProps={{ min: 0, step: 0.01 }}
                  helperText="Leave 0 for no limit (only applies to percentage)"
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Min Order Amount"
                  value={formData.minOrderAmount}
                  onChange={handleChange('minOrderAmount')}
                  inputProps={{ min: 0, step: 0.01 }}
                  helperText="Minimum order value to use this coupon"
                />
              </Box>

              <TextField
                fullWidth
                type="number"
                label="Max Usage"
                value={formData.maxUsage}
                onChange={handleChange('maxUsage')}
                inputProps={{ min: 1 }}
                helperText="Maximum number of times this coupon can be used"
              />

              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                }}
              >
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Start Date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.startDate}
                  onChange={handleChange('startDate')}
                />

                <TextField
                  fullWidth
                  type="datetime-local"
                  label="End Date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.endDate}
                  onChange={handleChange('endDate')}
                />
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.active}
                    onChange={handleSwitchChange('active')}
                  />
                }
                label="Active"
              />

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={onCancel} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
              </Box>
            </Stack>
          </form>
        </Card>
      </Stack>
    </DashboardContent>
  );
}

