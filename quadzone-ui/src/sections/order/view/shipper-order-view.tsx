import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { useShipperOrders } from 'src/hooks/useShipperOrders';
import { DashboardContent } from 'src/layouts/dashboard';
import { ordersApi } from 'src/api/orders';
import type { OrderStatus } from 'src/api/types';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { Iconify } from 'src/components/iconify';
import { toast } from 'react-toastify';

// ----------------------------------------------------------------------

import type { Order } from 'src/api/orders';

export function ShipperOrderView() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterName, setFilterName] = useState('');

  const { orders, loading, error, total, refetch } = useShipperOrders({
    page,
    pageSize: rowsPerPage,
    search: filterName,
  });

  const handleStatusChange = useCallback(
    async (orderId: number, newStatus: OrderStatus) => {
      try {
        await ordersApi.updateOrderStatus(orderId, newStatus);
        toast.success('Order status updated successfully');
        refetch();
      } catch (err: any) {
        console.error('Failed to update order status:', err);
        const errorMsg = err?.response?.data?.message || 'Failed to update order status';
        toast.error(errorMsg);
      }
    },
    [refetch]
  );


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'processing':
        return 'info';
      case 'confirmed':
        return 'info';
      default:
        return 'default';
    }
  };

  const getNextStatuses = (currentStatus: string): OrderStatus[] => {
    switch (currentStatus.toUpperCase()) {
      case 'CONFIRMED':
        return ['PROCESSING', 'CANCELLED'];
      case 'PROCESSING':
        return ['COMPLETED', 'CANCELLED'];
      default:
        return [];
    }
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          My Assigned Orders
        </Typography>
      </Box>

      <Card>
        {/* Search Bar */}
        <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <TextField
            fullWidth
            placeholder="Search orders..."
            value={filterName}
            onChange={(e) => {
              setFilterName(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
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
                  <TableHead>
                    <TableRow>
                      <TableCell>Order #</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell align="center">Items</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.length === 0 && !loading ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                          <Typography variant="body2" color="text.secondary">
                            {filterName ? 'No orders found matching your search' : 'No assigned orders'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((row) => (
                        <ShipperOrderTableRow
                          key={row.id}
                          row={row}
                          onStatusChange={handleStatusChange}
                          getStatusColor={getStatusColor}
                          getNextStatuses={getNextStatuses}
                        />
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              component="div"
              page={page}
              count={total}
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
                overflow: 'hidden',
              }}
            />
          </>
        )}
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function ShipperOrderTableRow({
  row,
  onStatusChange,
  getStatusColor,
  getNextStatuses,
}: {
  row: Order;
  onStatusChange: (orderId: number, status: OrderStatus) => void;
  getStatusColor: (status: string) => 'success' | 'warning' | 'error' | 'info' | 'default';
  getNextStatuses: (status: string) => OrderStatus[];
}) {
  const nextStatuses = getNextStatuses(row.status);

  const handleStatusChange = useCallback(
    (event: any) => {
      const newStatus = event.target.value as OrderStatus;
      onStatusChange(row.id, newStatus);
    },
    [row.id, onStatusChange]
  );

  return (
    <TableRow
      hover
      sx={{
        '& .MuiTableCell-root': {
          verticalAlign: 'middle',
        },
      }}
    >
      <TableCell component="th" scope="row">
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {row.orderNumber}
        </Typography>
      </TableCell>

      <TableCell>{row.customerName}</TableCell>

      <TableCell align="center">{row.itemsCount}</TableCell>

      <TableCell>${row.totalAmount.toFixed(2)}</TableCell>

      <TableCell>
        {nextStatuses.length > 0 ? (
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={row.status}
              onChange={handleStatusChange}
              sx={{
                '& .MuiSelect-select': {
                  py: 0.5,
                },
              }}
            >
              {nextStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Label color={getStatusColor(row.status)}>{row.status}</Label>
        )}
      </TableCell>

      <TableCell>{new Date(row.orderDate).toLocaleDateString()}</TableCell>
    </TableRow>
  );
}
