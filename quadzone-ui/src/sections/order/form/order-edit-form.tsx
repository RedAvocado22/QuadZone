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

import { DashboardContent } from 'src/layouts/dashboard';
import { ordersApi } from 'src/api/orders';
import type { OrderStatus } from 'src/api/types';

// ----------------------------------------------------------------------

interface OrderEditFormProps {
  orderId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const STATUS_OPTIONS: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PROCESSING', 'COMPLETED', 'CANCELLED'];

export function OrderEditForm({ orderId, onSuccess, onCancel }: OrderEditFormProps) {
  const [loading, setLoading] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    orderNumber: '',
    customerName: '',
    subtotal: 0,
    taxAmount: 0,
    shippingCost: 0,
    discountAmount: 0,
    totalAmount: 0,
    orderStatus: 'PENDING' as OrderStatus,
    notes: '',
    address: '',
  });

  useEffect(() => {
    const loadOrder = async () => {
      setLoadingOrder(true);
      setError(null);
      try {
        const order = await ordersApi.getById(orderId);
        setFormData({
          orderNumber: order.orderNumber || '',
          customerName: order.customerName || '',
          subtotal: order.subtotal ?? 0,
          taxAmount: order.taxAmount ?? 0,
          shippingCost: order.shippingCost ?? 0,
          discountAmount: order.discountAmount ?? 0,
          totalAmount: order.totalAmount ?? 0,
          orderStatus: order.status || 'PENDING',
          notes: order.notes || '',
          address: order.address || '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setLoadingOrder(false);
      }
    };

    loadOrder();
  }, [orderId]);

  const handleChange = (field: keyof typeof formData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: ['subtotal', 'taxAmount', 'shippingCost', 'discountAmount', 'totalAmount'].includes(field)
          ? Number(value)
          : value,
      }));
      setError(null);
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    setLoading(true);
    try {
      await ordersApi.update(orderId, {
        subtotal: formData.subtotal,
        taxAmount: formData.taxAmount,
        shippingCost: formData.shippingCost,
        discountAmount: formData.discountAmount,
        totalAmount: formData.totalAmount,
        orderStatus: formData.orderStatus,
        notes: formData.notes || undefined,
        address: formData.address || undefined,
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order');
    } finally {
      setLoading(false);
    }
  };

  if (loadingOrder) {
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
          <Typography variant="h4">Edit Order</Typography>
          <Button variant="outlined" onClick={onCancel}>
            ← Back
          </Button>
        </Box>

        <Card sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {error && <Alert severity="error">{error}</Alert>}

              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                }}
              >
                <TextField
                  fullWidth
                  label="Order Number"
                  value={formData.orderNumber}
                  disabled
                />

                <TextField
                  fullWidth
                  label="Customer Name"
                  value={formData.customerName}
                  disabled
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
                  label="Subtotal"
                  value={formData.subtotal}
                  onChange={handleChange('subtotal')}
                  inputProps={{ min: 0, step: 0.01 }}
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Tax Amount"
                  value={formData.taxAmount}
                  onChange={handleChange('taxAmount')}
                  inputProps={{ min: 0, step: 0.01 }}
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
                  label="Shipping Cost"
                  value={formData.shippingCost}
                  onChange={handleChange('shippingCost')}
                  inputProps={{ min: 0, step: 0.01 }}
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Discount Amount"
                  value={formData.discountAmount}
                  onChange={handleChange('discountAmount')}
                  inputProps={{ min: 0, step: 0.01 }}
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
                  label="Total Amount"
                  value={formData.totalAmount}
                  onChange={handleChange('totalAmount')}
                  inputProps={{ min: 0, step: 0.01 }}
                />

                <TextField
                  select
                  fullWidth
                  label="Status"
                  value={formData.orderStatus}
                  onChange={handleChange('orderStatus')}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <TextField
                fullWidth
                label="Address"
                multiline
                rows={2}
                value={formData.address}
                onChange={handleChange('address')}
              />

              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={2}
                value={formData.notes}
                onChange={handleChange('notes')}
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
