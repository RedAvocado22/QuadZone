import { useState, useEffect, useCallback, useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import { menuItemClasses } from '@mui/material/MenuItem';

import { DashboardContent } from 'src/layouts/dashboard';
import { useOrders } from 'src/hooks/useOrders';
import { ordersApi } from 'src/api/orders';
import { usersApi, type User } from 'src/api/users';
import { useRouter } from 'src/routing/hooks';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { UserTableToolbar } from '../../user/user-table-toolbar';
import { UserTableHead } from '../../user/user-table-head';
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
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('orderDate');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [filterName, setFilterName] = useState('');

  const { orders, loading, error, total, refetch } = useOrders({
    page,
    pageSize: rowsPerPage,
    search: filterName,
    status: 'CONFIRMED',
  });

  // Apply client-side sorting
  const sortedOrders = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];
    const sorted = [...orders].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (orderBy) {
        case 'orderNumber':
          aValue = a.orderNumber;
          bValue = b.orderNumber;
          break;
        case 'customerName':
          aValue = a.customerName;
          bValue = b.customerName;
          break;
        case 'itemsCount':
          aValue = a.itemsCount;
          bValue = b.itemsCount;
          break;
        case 'totalAmount':
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        case 'orderDate':
          aValue = new Date(a.orderDate).getTime();
          bValue = new Date(b.orderDate).getTime();
          break;
        default:
          return 0;
      }

      if (aValue === undefined || bValue === undefined) return 0;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
        return order === 'asc' ? comparison : -comparison;
      }

      if (order === 'asc') {
        return (aValue as number) - (bValue as number);
      }
      return (bValue as number) - (aValue as number);
    });
    return sorted;
  }, [orders, orderBy, order]);

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

  const handleOpenDialog = useCallback((orderRow: OrderRow) => {
    setSelectedOrder(orderRow);
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
      
      handleCloseDialog();
      refetch();
    } catch (err: any) {
      setAssignError(err.response?.data?.message || err.message || 'Failed to assign order to shipper');
    } finally {
      setAssigning(false);
    }
  }, [selectedOrder, selectedShipperId, refetch, handleCloseDialog]);

  const handleViewOrder = useCallback((id: string | number) => {
    router.push(`/admin/order/${id}`);
  }, [router]);

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean) => {
    if (checked) {
      setSelected(sortedOrders.map((ord) => ord.id.toString()));
      return;
    }
    setSelected([]);
  }, [sortedOrders]);

  const onSelectRow = useCallback(
    (id: string) => {
      const newSelected = selected.includes(id)
        ? selected.filter((value) => value !== id)
        : [...selected, id];
      setSelected(newSelected);
    },
    [selected]
  );

  const notFound = !sortedOrders.length && !!filterName && !loading;

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
          <UserTableToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
              setFilterName(event.target.value);
              setPage(0);
            }}
          />

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
                    <UserTableHead
                      order={order}
                      orderBy={orderBy}
                      rowCount={sortedOrders.length}
                      numSelected={selected.length}
                      onSort={onSort}
                      onSelectAllRows={onSelectAllRows}
                      headLabel={[
                        { id: 'orderNumber', label: 'Order #', align: 'center' },
                        { id: 'customerName', label: 'Customer', align: 'center' },
                        { id: 'itemsCount', label: 'Items', align: 'center' },
                        { id: 'totalAmount', label: 'Total', align: 'center' },
                        { id: 'orderDate', label: 'Order Date', align: 'center' },
                        { id: '', label: '', align: 'center' },
                      ]}
                    />
                    <TableBody>
                      {sortedOrders.map((row) => (
                        <AssignDeliveryTableRow
                          key={row.id}
                          row={{
                            id: row.id,
                            orderNumber: row.orderNumber,
                            customerName: row.customerName,
                            totalAmount: row.totalAmount,
                            status: row.status,
                            orderDate: row.orderDate,
                            itemsCount: row.itemsCount,
                          }}
                          selected={selected.includes(row.id.toString())}
                          onSelectRow={() => onSelectRow(row.id.toString())}
                          onView={handleViewOrder}
                          onAssign={handleOpenDialog}
                        />
                      ))}

                      {!notFound && sortedOrders.length === 0 && !loading && (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                            <Typography variant="body2" color="text.secondary">
                              No confirmed orders available for assignment.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}

                      {!notFound && sortedOrders.length > 0 && (
                        <TableEmptyRows
                          height={68}
                          emptyRows={emptyRows(page, rowsPerPage, total)}
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

// ----------------------------------------------------------------------

function AssignDeliveryTableRow({
  row,
  selected,
  onSelectRow,
  onView,
  onAssign,
}: {
  row: OrderRow;
  selected: boolean;
  onSelectRow: () => void;
  onView?: (id: string | number) => void;
  onAssign?: (row: OrderRow) => void;
}) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleView = useCallback(() => {
    handleClosePopover();
    if (onView) {
      onView(row.id);
    }
  }, [onView, row.id, handleClosePopover]);

  const handleAssign = useCallback(() => {
    handleClosePopover();
    if (onAssign) {
      onAssign(row);
    }
  }, [onAssign, row, handleClosePopover]);

  return (
    <>
      <TableRow
        hover
        tabIndex={-1}
        role="checkbox"
        selected={selected}
        sx={{
          '& .MuiTableCell-root': {
            verticalAlign: 'middle',
          },
        }}
      >
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row" align="center">
          <Button variant="text" color="inherit" onClick={() => onView?.(row.id)} sx={{ p: 0, minWidth: 'auto' }}>
            {row.orderNumber}
          </Button>
        </TableCell>

        <TableCell align="center">{row.customerName || '-'}</TableCell>

        <TableCell align="center">{row.itemsCount ?? 0}</TableCell>

        <TableCell align="center">${(row.totalAmount ?? 0).toFixed(2)}</TableCell>

        <TableCell align="center">
          {row.orderDate ? new Date(row.orderDate).toLocaleDateString() : '-'}
        </TableCell>

        <TableCell align="center">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 160,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleView}>
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>

          <MenuItem onClick={handleAssign} sx={{ color: 'primary.main' }}>
            <Iconify icon={"solar:map-arrow-right-bold" as any} />
            Assign Shipper
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
