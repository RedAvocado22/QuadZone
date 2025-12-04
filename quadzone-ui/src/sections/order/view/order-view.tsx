import { useState, useCallback, useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { useOrders } from 'src/hooks/useOrders';
import { DashboardContent } from 'src/layouts/dashboard';
import { useRouter } from 'src/routing/hooks';
import { ordersApi } from 'src/api/orders';

import { Label } from 'src/components/label';
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

export function OrderView() {
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
    // Remove sortBy and sortOrder from API call, we'll do client-side sorting
  });

  // Apply client-side sorting
  const sortedOrders = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];
    const sorted = [...orders].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      // Map frontend field names to actual order properties
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
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'orderDate':
        case 'createdAt':
          aValue = new Date(a.orderDate).getTime();
          bValue = new Date(b.orderDate).getTime();
          break;
        default:
          return 0;
      }

      if (aValue === undefined || bValue === undefined) return 0;

      // Handle string and number comparisons
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
        return order === 'asc' ? comparison : -comparison;
      }

      // Handle number comparisons
      if (order === 'asc') {
        return (aValue as number) - (bValue as number);
      }
      return (bValue as number) - (aValue as number);
    });
    return sorted;
  }, [orders, orderBy, order]);

  const handleCreateOrder = useCallback(() => {
    router.push('/admin/order/create');
  }, [router]);

  const handleViewOrder = useCallback(
    (id: string | number) => {
      router.push(`/admin/order/${id}`);
    },
    [router]
  );

  const handleEditOrder = useCallback(
    (id: string | number) => {
      router.push(`/admin/order/${id}/edit`);
    },
    [router]
  );

  const handleDeleteOrder = useCallback(
    async (id: string | number) => {
      if (!window.confirm('Are you sure you want to delete this order?')) {
        return;
      }
      try {
        await ordersApi.delete(id);
        refetch();
      } catch (err) {
        console.error('Failed to delete order:', err);
        alert('Failed to delete order');
      }
    },
    [refetch]
  );

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
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Orders
        </Typography>
        <Button variant="contained" color="inherit" startIcon={<Iconify icon="mingcute:add-line" />} onClick={handleCreateOrder}>
          New Order
        </Button>
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
            <Button onClick={refetch} sx={{ mt: 2 }}>Retry</Button>
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
                      { id: 'status', label: 'Status', align: 'center' },
                      { id: 'orderDate', label: 'Created', align: 'center' },
                      { id: '', align: 'center' },
                    ]}
                  />
                  <TableBody>
                    {sortedOrders.map((row) => (
                      <OrderTableRow
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
                        onEdit={handleEditOrder}
                        onDelete={handleDeleteOrder}
                      />
                    ))}

                    {!notFound && (
                      <TableEmptyRows
                        height={68}
                        emptyRows={emptyRows(page, rowsPerPage, sortedOrders.length)}
                        colSpan={9}
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

function OrderTableRow({
  row,
  selected,
  onSelectRow,
  onView,
  onEdit,
  onDelete,
}: {
  row: OrderRow;
  selected: boolean;
  onSelectRow: () => void;
  onView?: (id: string | number) => void;
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
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

  const handleEdit = useCallback(() => {
    handleClosePopover();
    if (onEdit) {
      onEdit(row.id);
    }
  }, [onEdit, row.id, handleClosePopover]);

  const handleDelete = useCallback(() => {
    handleClosePopover();
    if (onDelete) {
      onDelete(row.id);
    }
  }, [onDelete, row.id, handleClosePopover]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'processing':
      case 'confirmed':
        return 'info';
      default:
        return 'default';
    }
  };


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
          <Label color={getStatusColor(row.status)}>{row.status || '-'}</Label>
        </TableCell>

        <TableCell align="center">{row.orderDate ? new Date(row.orderDate).toLocaleDateString() : '-'}</TableCell>

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
            width: 140,
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

          <MenuItem onClick={handleEdit}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
