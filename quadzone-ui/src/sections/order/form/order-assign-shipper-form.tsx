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
import { usersApi, type User } from 'src/api/users';

// ----------------------------------------------------------------------

interface OrderAssignShipperFormProps {
  orderId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function OrderAssignShipperForm({ orderId, onSuccess, onCancel }: OrderAssignShipperFormProps) {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [shippers, setShippers] = useState<User[]>([]);
  const [orderInfo, setOrderInfo] = useState<{
    orderNumber: string;
    customerName: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    shipperId: '',
    trackingNumber: '',
    carrier: '',
    estimatedDeliveryDate: '',
    deliveryNotes: '',
  });

  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      setError(null);
      try {
        // Load shippers
        const shippersList = await usersApi.getShippers();
        setShippers(shippersList);

        // Load order info
        const order = await ordersApi.getById(orderId);
        setOrderInfo({
          orderNumber: order.orderNumber || '',
          customerName: order.customerName || '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [orderId]);

  const handleChange = (field: keyof typeof formData): React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      setError(null);
      setSuccess(null);
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.shipperId) {
      setError('Please select a shipper');
      return;
    }

    const payload = {
      shipperId: Number(formData.shipperId),
      trackingNumber: formData.trackingNumber || undefined,
      carrier: formData.carrier || undefined,
      estimatedDeliveryDate: formData.estimatedDeliveryDate || undefined,
      deliveryNotes: formData.deliveryNotes || undefined,
    };

    setLoading(true);
    try {
      await ordersApi.assignToShipper(orderId, payload);
      setSuccess('Order has been successfully assigned to shipper!');
      
      // Wait a bit before calling onSuccess to show success message
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to assign order to shipper');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
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
          <Typography variant="h4">Assign Order to Shipper</Typography>
          <Button variant="outlined" onClick={onCancel}>
            ← Back
          </Button>
        </Box>

        {orderInfo && (
          <Card sx={{ p: 3, bgcolor: 'background.neutral' }}>
            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Order Information
              </Typography>
              <Typography variant="body1">
                <strong>Order Number:</strong> {orderInfo.orderNumber}
              </Typography>
              <Typography variant="body1">
                <strong>Customer:</strong> {orderInfo.customerName}
              </Typography>
            </Stack>
          </Card>
        )}

        <Card sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}

              <TextField
                select
                fullWidth
                label="Select Shipper *"
                required
                value={formData.shipperId}
                onChange={handleChange('shipperId')}
                disabled={loading || shippers.length === 0}
              >
                {shippers.length === 0 ? (
                  <MenuItem disabled>No shippers available</MenuItem>
                ) : (
                  shippers.map((shipper) => (
                    <MenuItem key={shipper.id} value={shipper.id.toString()}>
                      {shipper.firstName} {shipper.lastName} ({shipper.email})
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
                  label="Tracking Number"
                  value={formData.trackingNumber}
                  onChange={handleChange('trackingNumber')}
                  disabled={loading}
                  helperText="Leave empty to auto-generate"
                />

                <TextField
                  fullWidth
                  label="Carrier"
                  value={formData.carrier}
                  onChange={handleChange('carrier')}
                  disabled={loading}
                  placeholder="e.g., FedEx, DHL, UPS"
                />
              </Box>

              <TextField
                fullWidth
                type="datetime-local"
                label="Estimated Delivery Date"
                InputLabelProps={{ shrink: true }}
                value={formData.estimatedDeliveryDate}
                onChange={handleChange('estimatedDeliveryDate')}
                disabled={loading}
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Delivery Notes"
                value={formData.deliveryNotes}
                onChange={handleChange('deliveryNotes')}
                disabled={loading}
                placeholder="Additional notes for the shipper..."
              />

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={onCancel} disabled={loading}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={loading || !formData.shipperId || shippers.length === 0}
                >
                  {loading ? <CircularProgress size={24} /> : 'Assign Order'}
                </Button>
              </Box>
            </Stack>
          </form>
        </Card>
      </Stack>
    </DashboardContent>
  );
}

