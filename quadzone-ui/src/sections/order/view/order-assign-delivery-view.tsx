import { useState, useEffect, useCallback, useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';

import { DashboardContent } from 'src/layouts/dashboard';
import { useOrders } from 'src/hooks/useOrders';
import { ordersApi } from 'src/api/orders';
import { usersApi, type User } from 'src/api/users';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from '../../user/table-no-data';
import { TableEmptyRows } from '../../user/table-empty-rows';
import { emptyRows } from '../../user/utils';

// ----------------------------------------------------------------------

type OrderRow = {
  id: number;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  orderDate: string;
  itemsCount: number;
};

export function OrderAssignDeliveryView() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterName, setFilterName] = useState('');

  const { orders, loading, error, refetch } = useOrders({
    page,
    pageSize: rowsPerPage,
    search: filterName,
  });

  // Filter only CONFIRMED orders (case-insensitive)
  const confirmedOrders = useMemo(() => {
    const filtered = orders.filter(order => {
      const status = order.status;
      if (!status) {
        return false;
      }
      // Handle both string and enum formats
      const statusStr = typeof status === 'string' ? status : String(status);
      return statusStr.toUpperCase() === 'CONFIRMED';
    });
    
    return filtered;
  }, [orders]);

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [shippers, setShippers] = useState<User[]>([]);
  const [loadingShippers, setLoadingShippers] = useState(false);
  const [selectedShipperId, setSelectedShipperId] = useState<string>('');
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);

  // Load shippers when dialog opens
  useEffect(() => {
    if (openDialog) {
      setLoadingShippers(true);
      setAssignError(null);
      usersApi.getShippers()
        .then(data => {
          setShippers(data);
        })
        .catch(err => {
          console.error('Failed to load shippers:', err);
          setAssignError('Failed to load shippers');
        })
        .finally(() => {
          setLoadingShippers(false);
        });
    }
  }, [openDialog]);

  const handleOpenDialog = useCallback((order: OrderRow) => {
    setSelectedOrder(order);
    setSelectedShipperId('');
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setSelectedOrder(null);
    setSelectedShipperId('');
    setAssignError(null);
  }, []);

  const handleAssign = useCallback(async () => {
    if (!selectedOrder || !selectedShipperId) {
      setAssignError('Please select a shipper');
      return;
    }

    setAssigning(true);
    setAssignError(null);

    try {
      await ordersApi.assignToShipper(selectedOrder.id, {
        shipperId: Number(selectedShipperId),
      });
      
      // Success - close dialog and refresh orders
      handleCloseDialog();
      refetch();
    } catch (err: any) {
      setAssignError(err.response?.data?.message || err.message || 'Failed to assign order to shipper');
    } finally {
      setAssigning(false);
    }
  }, [selectedOrder, selectedShipperId, refetch, handleCloseDialog]);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      case 'PROCESSING':
        return 'info';
      case 'CONFIRMED':
        return 'info';
      default:
        return 'default';
    }
  };

  const notFound = !confirmedOrders.length && !!filterName && !loading;

  return (
    <>
      <DashboardContent>
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4">
            Assign Delivery - Confirmed Orders
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Select a confirmed order and assign it to a shipper for delivery
          </Typography>
        </Box>

        <Card>
          <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
            <TextField
              fullWidth
              placeholder="Search orders..."
              value={filterName}
              onChange={(e) => {
                setFilterName(e.target.value);
                setPage(0);
              }}
              sx={{ maxWidth: 400 }}
            />
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="error">Error loading orders: {error.message}</Typography>
              <Button onClick={refetch} sx={{ mt: 2 }}>
                Retry
              </Button>
            </Box>
          ) : (
            <>
              <Scrollbar>
                <TableContainer sx={{ overflow: 'unset' }}>
                  <Table sx={{ minWidth: 800 }}>
                    <thead>
                      <TableRow>
                        <TableCell>Order #</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell align="center">Items</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Order Date</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </thead>
                    <TableBody>
                      {confirmedOrders.map((order) => (
                        <TableRow key={order.id} hover>
                          <TableCell>
                            <Typography variant="subtitle2">{order.orderNumber}</Typography>
                          </TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell align="center">{order.itemsCount}</TableCell>
                          <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Label color={getStatusColor(order.status)}>
                              {order.status}
                            </Label>
                          </TableCell>
                          <TableCell>
                            {new Date(order.orderDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleOpenDialog({
                                id: order.id,
                                orderNumber: order.orderNumber,
                                customerName: order.customerName,
                                totalAmount: order.totalAmount,
                                status: order.status,
                                orderDate: order.orderDate,
                                itemsCount: order.itemsCount,
                              })}
                            >
                              Assign Shipper
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}

                      {!notFound && confirmedOrders.length === 0 && !loading && (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                            <Typography variant="body2" color="text.secondary">
                              No confirmed orders available. Only orders with CONFIRMED status can be assigned to shippers.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}

                      {!notFound && confirmedOrders.length > 0 && (
                        <TableEmptyRows
                          height={68}
                          emptyRows={emptyRows(page, rowsPerPage, confirmedOrders.length)}
                          colSpan={7}
                        />
                      )}

                      {notFound && <TableNoData searchQuery={filterName} />}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>

              <TablePagination
                component="div"
                page={page}
                count={confirmedOrders.length}
                rowsPerPage={rowsPerPage}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setPage(0);
                }}
                sx={{
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              />
            </>
          )}
        </Card>
      </DashboardContent>

      {/* Assign Shipper Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Order to Shipper</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Order Details
              </Typography>
              <Typography variant="body1">
                <strong>Order Number:</strong> {selectedOrder.orderNumber}
              </Typography>
              <Typography variant="body1">
                <strong>Customer:</strong> {selectedOrder.customerName}
              </Typography>
            </Box>
          )}

          {assignError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {assignError}
            </Alert>
          )}

          {loadingShippers ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <TextField
              select
              fullWidth
              label="Select Shipper"
              value={selectedShipperId}
              onChange={(e) => {
                setSelectedShipperId(e.target.value);
                setAssignError(null);
              }}
              disabled={assigning || shippers.length === 0}
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
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={assigning}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            variant="contained"
            disabled={assigning || !selectedShipperId || shippers.length === 0}
          >
            {assigning ? <CircularProgress size={24} /> : 'Assign'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

