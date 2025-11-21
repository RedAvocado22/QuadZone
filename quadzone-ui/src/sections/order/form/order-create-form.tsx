import { useState } from 'react';

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
import { ordersApi, type Order } from 'src/api/orders';

// ----------------------------------------------------------------------

interface OrderCreateFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const STATUS_OPTIONS: Order['status'][] = ['pending', 'processing', 'completed', 'cancelled'];
const PAYMENT_STATUS_OPTIONS: Order['paymentStatus'][] = ['pending', 'paid', 'failed'];

export function OrderCreateForm({ onSuccess, onCancel }: OrderCreateFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    orderNumber: '',
    customerName: '',
    total: 0,
    items: 1,
    status: 'pending' as Order['status'],
    paymentStatus: 'pending' as Order['paymentStatus'],
    createdAt: new Date().toISOString().slice(0, 10),
  });

  const handleChange = (field: keyof typeof formData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: ['total', 'items'].includes(field) ? Number(value) : value,
      }));
      setError(null);
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!formData.orderNumber || !formData.customerName) {
      setError('Order number and customer name are required');
      return;
    }

    const payload: Omit<Order, 'id'> = {
      orderNumber: formData.orderNumber,
      customerName: formData.customerName,
      total: Number(formData.total) || 0,
      items: Number(formData.items) || 0,
      status: formData.status,
      paymentStatus: formData.paymentStatus,
      createdAt: new Date(formData.createdAt).toISOString(),
    };

    setLoading(true);
    try {
      await ordersApi.create(payload);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardContent>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">Create Order</Typography>
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
                label="Order Number"
                required
                value={formData.orderNumber}
                onChange={handleChange('orderNumber')}
              />

              <TextField
                fullWidth
                label="Customer Name"
                required
                value={formData.customerName}
                onChange={handleChange('customerName')}
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
                  type="number"
                  label="Total"
                  value={formData.total}
                  onChange={handleChange('total')}
                  inputProps={{ min: 0, step: 0.01 }}
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Items"
                  value={formData.items}
                  onChange={handleChange('items')}
                  inputProps={{ min: 0 }}
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
                  select
                  fullWidth
                  label="Status"
                  value={formData.status}
                  onChange={handleChange('status')}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option} sx={{ textTransform: 'capitalize' }}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Payment Status"
                  value={formData.paymentStatus}
                  onChange={handleChange('paymentStatus')}
                >
                  {PAYMENT_STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option} sx={{ textTransform: 'capitalize' }}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <TextField
                fullWidth
                type="date"
                label="Created At"
                InputLabelProps={{ shrink: true }}
                value={formData.createdAt}
                onChange={handleChange('createdAt')}
              />

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={onCancel} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : 'Create Order'}
                </Button>
              </Box>
            </Stack>
          </form>
        </Card>
      </Stack>
    </DashboardContent>
  );
}
