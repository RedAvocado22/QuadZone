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
import { usersApi } from 'src/api/users';
import type { OrderStatus, UserResponse } from 'src/api/types';

// ----------------------------------------------------------------------

interface OrderCreateFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const STATUS_OPTIONS: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PROCESSING', 'COMPLETED', 'CANCELLED'];

export function OrderCreateForm({ onSuccess, onCancel }: OrderCreateFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [formData, setFormData] = useState({
    userId: 0,
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
    const fetchUsers = async () => {
      try {
        const response = await usersApi.getAll({ pageSize: 100 });
        setUsers(response.content);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // Auto calculate total
  useEffect(() => {
    const total = formData.subtotal + formData.taxAmount + formData.shippingCost - formData.discountAmount;
    setFormData(prev => ({ ...prev, totalAmount: Math.max(0, total) }));
  }, [formData.subtotal, formData.taxAmount, formData.shippingCost, formData.discountAmount]);

  const handleChange = (field: keyof typeof formData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: ['userId', 'subtotal', 'taxAmount', 'shippingCost', 'discountAmount', 'totalAmount'].includes(field)
          ? Number(value)
          : value,
      }));
      setError(null);
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!formData.userId) {
      setError('Please select a customer');
      return;
    }

    if (formData.totalAmount <= 0) {
      setError('Total amount must be greater than 0');
      return;
    }

    setLoading(true);
    try {
      await ordersApi.create({
        userId: formData.userId,
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
                select
                fullWidth
                label="Customer"
                required
                value={formData.userId || ''}
                onChange={handleChange('userId')}
                disabled={loadingUsers}
              >
                {loadingUsers ? (
                  <MenuItem value="">Loading...</MenuItem>
                ) : (
                  users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  ))
                )}
              </TextField>

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
                  helperText="Auto-calculated from subtotal + tax + shipping - discount"
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
