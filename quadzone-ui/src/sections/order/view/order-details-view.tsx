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
import { ordersApi } from 'src/api/orders';
import { Label } from 'src/components/label';
import { fCurrency } from 'src/utils/formatters';
import type { OrderResponse } from 'src/api/types';

// ----------------------------------------------------------------------

export function OrderDetailsView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderResponse | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await ordersApi.getById(id);
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const handleEdit = () => {
    if (id) {
      router.push(`/admin/order/${id}/edit`);
    }
  };

  const handleBack = () => {
    router.push('/admin/order');
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

  if (error || !order) {
    return (
      <DashboardContent>
        <Alert severity="error">{error || 'Order not found'}</Alert>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          Back to Orders
        </Button>
      </DashboardContent>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      case 'PROCESSING':
      case 'CONFIRMED':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <DashboardContent>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">Order Details</Typography>
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
              <Typography variant="h5">{order.orderNumber}</Typography>
              <Label color={getStatusColor(order.status)}>
                {order.status}
              </Label>
            </Box>

            <Divider />

            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' } }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Customer Name
                </Typography>
                <Typography variant="body1">
                  {order.customerName}
                </Typography>
              </Box>

              {order.customerEmail && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Customer Email
                  </Typography>
                  <Typography variant="body1">
                    {order.customerEmail}
                  </Typography>
                </Box>
              )}

              {order.customerPhone && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Customer Phone
                  </Typography>
                  <Typography variant="body1">
                    {order.customerPhone}
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Items Count
                </Typography>
                <Typography variant="body1">
                  {order.itemsCount}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Order Date
                </Typography>
                <Typography variant="body1">
                  {new Date(order.orderDate).toLocaleString()}
                </Typography>
              </Box>

              {order.address && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1">
                    {order.address}
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Payment Details
            </Typography>

            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' } }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Subtotal
                </Typography>
                <Typography variant="body1">
                  {fCurrency(order.subtotal ?? 0)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Tax Amount
                </Typography>
                <Typography variant="body1">
                  {fCurrency(order.taxAmount ?? 0)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Shipping Cost
                </Typography>
                <Typography variant="body1">
                  {fCurrency(order.shippingCost ?? 0)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Discount
                </Typography>
                <Typography variant="body1" color="error.main">
                  -{fCurrency(order.discountAmount ?? 0)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Amount
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="primary.main">
                {fCurrency(order.totalAmount)}
              </Typography>
            </Box>

            {order.notes && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Notes
                  </Typography>
                  <Typography variant="body1">
                    {order.notes}
                  </Typography>
                </Box>
              </>
            )}
          </Stack>
        </Card>
      </Stack>
    </DashboardContent>
  );
}
