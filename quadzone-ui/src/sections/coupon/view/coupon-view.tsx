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

import { useCoupons } from 'src/hooks/useCoupons';
import { DashboardContent } from 'src/layouts/dashboard';
import { useRouter } from 'src/routing/hooks';
import { couponsApi, type Coupon } from 'src/api/coupons';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { UserTableToolbar } from '../../user/user-table-toolbar';
import { UserTableHead } from '../../user/user-table-head';
import { TableNoData } from '../../user/table-no-data';
import { TableEmptyRows } from '../../user/table-empty-rows';
import { emptyRows } from '../../user/utils';

// ----------------------------------------------------------------------

export function CouponView() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('id');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [filterName, setFilterName] = useState('');

  const { coupons, loading, error, total, refetch } = useCoupons({
    page,
    pageSize: rowsPerPage,
    search: filterName,
  });

  // Apply client-side sorting
  const sortedCoupons = useMemo(() => {
    const sorted = [...coupons].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (orderBy) {
        case 'code':
          aValue = a.code;
          bValue = b.code;
          break;
        case 'discountType':
          aValue = a.discountType;
          bValue = b.discountType;
          break;
        case 'couponValue':
          aValue = a.couponValue;
          bValue = b.couponValue;
          break;
        case 'usageCount':
          aValue = a.usageCount;
          bValue = b.usageCount;
          break;
        case 'active':
          aValue = a.active ? 1 : 0;
          bValue = b.active ? 1 : 0;
          break;
        case 'endDate':
          aValue = new Date(a.endDate).getTime();
          bValue = new Date(b.endDate).getTime();
          break;
        case 'id':
        default:
          aValue = a.id;
          bValue = b.id;
          break;
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
  }, [coupons, orderBy, order]);

  const handleCreateCoupon = useCallback(() => {
    router.push('/admin/coupon/create');
  }, [router]);

  const handleViewCoupon = useCallback(
    (id: string | number) => {
      router.push(`/admin/coupon/${id}`);
    },
    [router]
  );

  const handleEditCoupon = useCallback(
    (id: string | number) => {
      router.push(`/admin/coupon/${id}/edit`);
    },
    [router]
  );

  const handleDeleteCoupon = useCallback(
    async (id: string | number) => {
      if (!window.confirm('Are you sure you want to delete this coupon?')) {
        return;
      }
      try {
        await couponsApi.delete(id);
        refetch();
      } catch (err) {
        console.error('Failed to delete coupon:', err);
        alert('Failed to delete coupon');
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
      setSelected(sortedCoupons.map((c) => c.id.toString()));
      return;
    }
    setSelected([]);
  }, [sortedCoupons]);

  const onSelectRow = useCallback(
    (id: string) => {
      const newSelected = selected.includes(id)
        ? selected.filter((value) => value !== id)
        : [...selected, id];
      setSelected(newSelected);
    },
    [selected]
  );

  const notFound = !sortedCoupons.length && !!filterName && !loading;

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Coupons
        </Typography>
        <Button variant="contained" color="inherit" startIcon={<Iconify icon="mingcute:add-line" />} onClick={handleCreateCoupon}>
          New Coupon
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
            <Typography color="error">Error loading coupons: {error.message}</Typography>
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
                    rowCount={sortedCoupons.length}
                    numSelected={selected.length}
                    onSort={onSort}
                    onSelectAllRows={onSelectAllRows}
                    headLabel={[
                      { id: 'code', label: 'Code', align: 'center' },
                      { id: 'discountType', label: 'Type', align: 'center' },
                      { id: 'couponValue', label: 'Value', align: 'center' },
                      { id: 'usageCount', label: 'Usage', align: 'center' },
                      { id: 'active', label: 'Status', align: 'center' },
                      { id: 'endDate', label: 'Expires', align: 'center' },
                      { id: '', align: 'center' },
                    ]}
                  />
                  <TableBody>
                    {sortedCoupons.map((row) => (
                      <CouponTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id.toString())}
                        onSelectRow={() => onSelectRow(row.id.toString())}
                        onView={handleViewCoupon}
                        onEdit={handleEditCoupon}
                        onDelete={handleDeleteCoupon}
                      />
                    ))}

                    {!notFound && (
                      <TableEmptyRows
                        height={68}
                        emptyRows={emptyRows(page, rowsPerPage, sortedCoupons.length)}
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

function CouponTableRow({
  row,
  selected,
  onSelectRow,
  onView,
  onEdit,
  onDelete,
}: {
  row: Coupon;
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

  const formatValue = (type: string, value: number) => {
    if (type === 'PERCENTAGE') {
      return `${value}%`;
    }
    return `$${value.toFixed(2)}`;
  };

  const isExpired = new Date(row.endDate) < new Date();

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
          <Button variant="text" color="inherit" onClick={() => onView?.(row.id)} sx={{ p: 0, minWidth: 'auto', fontWeight: 'bold' }}>
            {row.code}
          </Button>
        </TableCell>

        <TableCell align="center">
          <Label color={row.discountType === 'PERCENTAGE' ? 'info' : 'warning'}>
            {row.discountType === 'PERCENTAGE' ? 'Percentage' : 'Fixed'}
          </Label>
        </TableCell>

        <TableCell align="center">{formatValue(row.discountType, row.couponValue)}</TableCell>

        <TableCell align="center">
          {row.usageCount} / {row.maxUsage}
        </TableCell>

        <TableCell align="center">
          <Label color={row.active && !isExpired ? 'success' : 'error'}>
            {!row.active ? 'Inactive' : isExpired ? 'Expired' : 'Active'}
          </Label>
        </TableCell>

        <TableCell align="center">{new Date(row.endDate).toLocaleDateString()}</TableCell>

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

