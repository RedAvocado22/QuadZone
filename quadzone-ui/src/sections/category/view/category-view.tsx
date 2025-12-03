import { useState, useCallback, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import { menuItemClasses } from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';

import { useRouter } from 'src/routing/hooks';
import { DashboardContent } from 'src/layouts/dashboard';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { UserTableToolbar } from '../../user/user-table-toolbar';
import { UserTableHead } from '../../user/user-table-head';
import { TableNoData } from '../../user/table-no-data';
import { TableEmptyRows } from '../../user/table-empty-rows';
import { emptyRows } from '../../user/utils';

import { categoriesApi } from 'src/api/categories';

type CategoryRow = {
  id: number;
  name: string;
  active: boolean;
  productCount: number;
  imageUrl: string | null;
};

type SubcategoryRow = {
  id: number;
  name: string;
  categoryName: string;
  active: boolean;
  productCount: number;
};

export function CategoryView() {
  const location = useLocation();
  const router = useRouter();
  const [isCategoryPage, setIsCategoryPage] = useState(location.pathname.includes('categories'));

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [filterName, setFilterName] = useState('');

  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (isCategoryPage) {
        const res = await categoriesApi.getAll({ page, pageSize: rowsPerPage, search: filterName });
        console.log('Fetched categories:', res.data);
        setCategories(res.data);
        setTotal(res.total);
      } else {
        const allCategories = await categoriesApi.getAllCategories();
        let allSub: SubcategoryRow[] = [];
        for (const cat of allCategories) {
          const subs = await categoriesApi.getSubCategoriesByCategoryId(cat.id);
          const mappedSubs: SubcategoryRow[] = subs.map((s) => ({
            id: s.id,
            name: s.name,
            categoryName: cat.name,
            active: s.active,
            productCount: s.productCount ?? 0,
          }));
          allSub = allSub.concat(mappedSubs);
        }
        if (filterName) {
          allSub = allSub.filter((s) => s.name.toLowerCase().includes(filterName.toLowerCase()));
        }
        console.log('Fetched subcategories:', allSub);
        setSubcategories(allSub.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
        setTotal(allSub.length);
      }
    } catch (err: any) {
      setError(err);
    }
    setLoading(false);
  }, [isCategoryPage, page, rowsPerPage, filterName]);

  const refetch = useCallback(() => fetchData(), [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const data = isCategoryPage ? categories : subcategories;

  const sortedData = useMemo(() => {
    if (!data) return [];
    const sorted = [...data].sort((a, b) => {
      let aValue: any;
      let bValue: any;
      switch (orderBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'productCount':
          aValue = a.productCount;
          bValue = b.productCount;
          break;
        case 'active':
          aValue = a.active ? 1 : 0;
          bValue = b.active ? 1 : 0;
          break;
        case 'categoryName':
          if (!isCategoryPage) {
            aValue = (a as SubcategoryRow).categoryName;
            bValue = (b as SubcategoryRow).categoryName;
          }
          break;
        default:
          return 0;
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc' ? aValue.toLowerCase().localeCompare(bValue.toLowerCase()) : bValue.toLowerCase().localeCompare(aValue.toLowerCase());
      }
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    });
    return sorted;
  }, [data, orderBy, order, isCategoryPage]);

const handleCreate = useCallback(
  () =>
    router.push(
      isCategoryPage
        ? '/admin/category/create'
        : '/admin/subcategory/create'
    ),
  [router, isCategoryPage]
);

const handleView = useCallback(
  (id: string | number) =>
    router.push(
      isCategoryPage
        ? `/admin/category/${id}`
        : `/admin/subcategory/${id}`
    ),
  [router, isCategoryPage]
);

const handleEdit = useCallback(
  (id: string | number) =>
    router.push(
      isCategoryPage
        ? `/admin/category/${id}/edit`
        : `/admin/subcategory/${id}/edit`
    ),
  [router, isCategoryPage]
);

  const handleDelete = useCallback(
    async (id: string | number) => {
      if (!window.confirm('Are you sure you want to delete?')) return;
      try {
        if (isCategoryPage) await categoriesApi.delete(id);
        else {
          const allCategories = await categoriesApi.getAllCategories();
          for (const cat of allCategories) {
            const subs = await categoriesApi.getSubCategoriesByCategoryId(cat.id);
            if (subs.find((s) => s.id === id)) {
              await categoriesApi.deleteSubCategory(cat.id, id);
              break;
            }
          }
        }
        refetch();
      } catch (err) {
        console.error('Delete failed', err);
        alert('Delete failed');
      }
    },
    [isCategoryPage, refetch]
  );

  const onSort = useCallback((id: string) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  }, [order, orderBy]);

  const onSelectAllRows = useCallback((checked: boolean) => {
    setSelected(checked ? sortedData.map((item) => item.id.toString()) : []);
  }, [sortedData]);

  const onSelectRow = useCallback((id: string) => {
    setSelected(selected.includes(id) ? selected.filter((v) => v !== id) : [...selected, id]);
  }, [selected]);

  const notFound = !sortedData.length && !!filterName && !loading;

  const headLabel = isCategoryPage
    ? [
        { id: 'name', label: 'Name' },
        { id: 'productCount', label: 'Products', align: 'center' },
        { id: 'active', label: 'Status' },
        { id: '' },
      ]
    : [
        { id: 'name', label: 'Name' },
        { id: 'categoryName', label: 'Category', align: 'center' },
        { id: 'productCount', label: 'Products', align: 'center' },
        { id: 'active', label: 'Status' },
        { id: '' },
      ];

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>{isCategoryPage ? 'Categories' : 'Subcategories'}</Typography>
        <Button variant="outlined" color="inherit" onClick={() => setIsCategoryPage(!isCategoryPage)}>
          {isCategoryPage ? 'Switch to Subcategories' : 'Switch to Categories'}
        </Button>
        <Button variant="contained" color="inherit" startIcon={<Iconify icon="mingcute:add-line" />} onClick={handleCreate}>
          New {isCategoryPage ? 'Category' : 'Subcategory'}
        </Button>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={(event) => { setFilterName(event.target.value); setPage(0); }}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>
        ) : error ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="error">Error loading data: {error.message}</Typography>
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
                    rowCount={sortedData.length}
                    numSelected={selected.length}
                    onSort={onSort}
                    onSelectAllRows={onSelectAllRows}
                    headLabel={headLabel}
                  />
                  <TableBody>
                    {sortedData.map((row) => (
                      <CategoryOrSubcategoryRow
                        key={row.id}
                        row={row}
                        isCategory={isCategoryPage}
                        selected={selected.includes(row.id.toString())}
                        onSelectRow={() => onSelectRow(row.id.toString())}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                    {!notFound && <TableEmptyRows height={68} emptyRows={emptyRows(page, rowsPerPage, sortedData.length)} colSpan={5} />}
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
              onRowsPerPageChange={(event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); }}
              sx={{ borderTop: '1px solid', borderColor: 'divider', overflow: 'hidden' }}
            />
          </>
        )}
      </Card>
    </DashboardContent>
  );
}

function CategoryOrSubcategoryRow({ row, isCategory, selected, onSelectRow, onEdit, onDelete }: {
  row: CategoryRow | SubcategoryRow;
  isCategory: boolean;
  selected: boolean;
  onSelectRow: () => void;
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
}) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => setOpenPopover(event.currentTarget), []);
  const handleClosePopover = useCallback(() => setOpenPopover(null), []);
  const handleEdit = useCallback(() => { handleClosePopover(); onEdit?.(row.id); }, [onEdit, row.id, handleClosePopover]);
  const handleDelete = useCallback(() => { handleClosePopover(); onDelete?.(row.id); }, [onDelete, row.id, handleClosePopover]);

  const getStatusColor = (status: string) => (status.toLowerCase() === 'active' ? 'success' : 'error');

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox"><Checkbox disableRipple checked={selected} onChange={onSelectRow} /></TableCell>
        <TableCell>{row.name}</TableCell>
        {!isCategory && <TableCell align="center">{(row as SubcategoryRow).categoryName}</TableCell>}
        <TableCell align="center">{row.productCount}</TableCell>
        <TableCell><Label color={getStatusColor(row.active ? 'active' : 'inactive')}>{row.active ? 'Active' : 'Inactive'}</Label></TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}><Iconify icon="eva:more-vertical-fill" /></IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList disablePadding sx={{ p: 0.5, gap: 0.5, width: 140, display: 'flex', flexDirection: 'column', [`& .${menuItemClasses.root}`]: { px: 1, gap: 2, borderRadius: 0.75, [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' } } }}>
          <MenuItem onClick={handleEdit}><Iconify icon="solar:pen-bold" />Edit</MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}><Iconify icon="solar:trash-bin-trash-bold" />Delete</MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}

