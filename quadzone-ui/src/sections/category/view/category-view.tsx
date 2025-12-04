import { useState, useCallback, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem, { menuItemClasses } from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Popover from "@mui/material/Popover";

import { useRouter } from "src/routing/hooks";
import { DashboardContent } from "src/layouts/dashboard";
import { Label } from "src/components/label";
import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { UserTableToolbar } from "../../user/user-table-toolbar";
import { UserTableHead } from "../../user/user-table-head";
import { TableNoData } from "../../user/table-no-data";
import { TableEmptyRows } from "../../user/table-empty-rows";
import { emptyRows } from "../../user/utils";
import { categoriesApi } from "src/api/categories";

type CategoryRow = {
  id: number;
  name: string;
  active: boolean;
  imageUrl?: string | null;
};

type SubcategoryRow = {
  id: number;
  name: string;
  categoryName?: string;
  active: boolean;
};

export function CategoryView() {
  const location = useLocation();
  const router = useRouter();

  const [isCategoryPage, setIsCategoryPage] = useState(location.pathname.includes("categories"));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [filterName, setFilterName] = useState("");
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
        const categoryData = Array.isArray(res.data) ? res.data : [];
        const mapped = categoryData.map((c: any) => ({
          id: c.id,
          name: c.name,
          active: c.active ?? true
        }));
        setCategories(mapped);
        const totalCount = res.total ?? mapped.length ?? 0;
        setTotal(totalCount);
      } else {
        await fetchSubcategories();
      }
    } catch (err: any) {
      handleFetchError(err);
    }
    setLoading(false);
  }, [isCategoryPage, page, rowsPerPage, filterName]);

  const fetchSubcategories = async () => {
    const allCategories = await categoriesApi.getAllCategories();
    if (!Array.isArray(allCategories)) {
      throw new TypeError("Invalid response format: expected array of categories");
    }
    if (allCategories.length === 0) {
      setSubcategories([]);
      setTotal(0);
      return;
    }

    let allSub: SubcategoryRow[] = [];
    for (const cat of allCategories) {
      try {
        const subs = await categoriesApi.getSubCategoriesByCategoryId(cat.id);
        if (Array.isArray(subs)) {
          const mapped: SubcategoryRow[] = subs.map((s: any) => ({
            id: s.id,
            name: s.name,
            categoryName: cat.name,
            active: s.active ?? s.enabled ?? s.isActive ?? true
          }));
          allSub = allSub.concat(mapped);
        }
      } catch {}
    }

    if (filterName) {
      allSub = allSub.filter((s) => s.name.toLowerCase().includes(filterName.toLowerCase()));
    }

    const paginatedSubs = allSub.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
    setSubcategories(paginatedSubs);
    setTotal(allSub.length);
  };

  const handleFetchError = (err: any) => {
    const errorMessage = err.response?.data?.message || err.message || "Failed to fetch data";
    if (err.response?.status === 403) {
      setError(new Error("Unauthorized - Please login with admin account"));
    } else if (err.response?.status === 401) {
      setError(new Error("Session expired - Please login again"));
    } else {
      setError(new Error(errorMessage));
    }
  };

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
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "active":
          aValue = a.active ? 1 : 0;
          bValue = b.active ? 1 : 0;
          break;
        case "categoryName":
          if (!isCategoryPage) {
            aValue = (a as SubcategoryRow).categoryName;
            bValue = (b as SubcategoryRow).categoryName;
          }
          break;
        default:
          return 0;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return order === "asc"
          ? aValue.toLowerCase().localeCompare(bValue.toLowerCase())
          : bValue.toLowerCase().localeCompare(aValue.toLowerCase());
      }
      return order === "asc" ? aValue - bValue : bValue - aValue;
    });
    return sorted;
  }, [data, orderBy, order, isCategoryPage]);

  const handleCreate = useCallback(
    () => router.push(isCategoryPage ? "/admin/category/create" : "/admin/subcategory/create"),
    [router, isCategoryPage]
  );

  const handleEdit = useCallback(
    (id: number) => router.push(isCategoryPage ? `/admin/category/${id}/edit` : `/admin/subcategory/${id}/edit`),
    [router, isCategoryPage]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      if (!globalThis.confirm("Are you sure you want to delete?")) return;
      try {
        if (isCategoryPage) await categoriesApi.delete(id);
        else {
          const allCategories = await categoriesApi.getAllCategories();
          for (const cat of allCategories) {
            const subs = await categoriesApi.getSubCategoriesByCategoryId(cat.id);
            if (subs.some((s: any) => s.id === id)) {
              await categoriesApi.deleteSubCategory(cat.id, id);
              break;
            }
          }
        }
        refetch();
      } catch {
        alert("Delete failed");
      }
    },
    [isCategoryPage, refetch]
  );

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback(
    (checked: boolean) => {
      setSelected(checked ? sortedData.map((item) => item.id.toString()) : []);
    },
    [sortedData]
  );

  const onSelectRow = useCallback(
    (id: string) => {
      setSelected(selected.includes(id) ? selected.filter((v) => v !== id) : [...selected, id]);
    },
    [selected]
  );

  const notFound = !sortedData.length && !!filterName && !loading;

  const headLabel = isCategoryPage
    ? [
        { id: "name", label: "Name" },
        { id: "active", label: "Status" },
        { id: "" }
      ]
    : [
        { id: "name", label: "Name" },
        { id: "categoryName", label: "Category", align: "center" },
        { id: "active", label: "Status" },
        { id: "" }
      ];

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          {isCategoryPage ? "Categories" : "Subcategories"}
        </Typography>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<Iconify icon="mdi:swap-horizontal" />}
          onClick={() => setIsCategoryPage(!isCategoryPage)}
          sx={{ mr: 2 }}
        >
          {isCategoryPage ? "Switch to Subcategories" : "Switch to Categories"}
        </Button>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleCreate}
        >
          New {isCategoryPage ? "Category" : "Subcategory"}
        </Button>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={(event) => {
            setFilterName(event.target.value);
            setPage(0);
          }}
        />

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={5}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box p={3} textAlign="center">
            <Typography color="error" gutterBottom>
              Error loading data: {error.message}
            </Typography>
            <Button variant="outlined" onClick={refetch}>
              Retry
            </Button>
          </Box>
        ) : (
          <>
            <Scrollbar>
              <TableContainer sx={{ overflow: "unset" }}>
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
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}

                    {!notFound && (
                      <TableEmptyRows
                        height={68}
                        emptyRows={emptyRows(page, rowsPerPage, sortedData.length)}
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
                setRowsPerPage(Number.parseInt(event.target.value, 10));
                setPage(0);
              }}
              sx={{ borderTop: "1px solid", borderColor: "divider", overflow: "hidden" }}
            />
          </>
        )}
      </Card>
    </DashboardContent>
  );
}

function CategoryOrSubcategoryRow({
  row,
  isCategory,
  selected,
  onSelectRow,
  onEdit,
  onDelete
}: {
  readonly row: CategoryRow | SubcategoryRow;
  readonly isCategory: boolean;
  readonly selected: boolean;
  readonly onSelectRow: () => void;
  readonly onEdit?: (id: number) => void;
  readonly onDelete?: (id: number) => void;
}) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => setOpenPopover(event.currentTarget),
    []
  );

  const handleClosePopover = useCallback(() => setOpenPopover(null), []);

  const handleEdit = useCallback(() => {
    handleClosePopover();
    onEdit?.(row.id);
  }, [onEdit, row.id, handleClosePopover]);

  const handleToggleStatus = useCallback(() => {
    handleClosePopover();
    onDelete?.(row.id);
  }, [onDelete, row.id, handleClosePopover]);

  const getStatusColor = (status: string) => (status.toLowerCase() === "active" ? "success" : "error");

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Typography variant="subtitle2" noWrap>
            {row.name}
          </Typography>
        </TableCell>

        {!isCategory && <TableCell align="center">{(row as SubcategoryRow).categoryName}</TableCell>}

        <TableCell align="center">
          <Label color={getStatusColor(row.active ? "Active" : "Inactive")}>
            {row.active ? "Active" : "Inactive"}
          </Label>
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
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: "flex",
            flexDirection: "column",
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: "action.selected" }
            }
          }}
        >
          <MenuItem onClick={handleEdit}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}