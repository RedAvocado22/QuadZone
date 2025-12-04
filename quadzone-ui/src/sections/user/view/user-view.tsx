import { useState, useCallback, useMemo } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import CircularProgress from "@mui/material/CircularProgress";

import { useUsers } from "src/hooks/useUsers";
import { DashboardContent } from "src/layouts/dashboard";
import { useRouter } from "src/routing/hooks";
import { usersApi } from "src/api/users";

import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";

import { TableNoData } from "../table-no-data";
import { UserTableRow } from "../user-table-row";
import { UserTableHead } from "../user-table-head";
import { TableEmptyRows } from "../table-empty-rows";
import { UserTableToolbar } from "../user-table-toolbar";
import { emptyRows } from "../utils";

import type { UserProps } from "../user-table-row";

// ----------------------------------------------------------------------

export function UserView() {
    const table = useTable();
    const router = useRouter();

    const [filterName, setFilterName] = useState("");

    // Fetch users from API
    const { users, loading, error, total, refetch } = useUsers({
        page: table.page,
        pageSize: table.rowsPerPage,
        search: filterName
    });

    const handleCreateUser = useCallback(() => {
        router.push("/admin/user/create");
    }, [router]);

    const handleEditUser = useCallback(
        (id: string) => {
            router.push(`/admin/user/${id}/edit`);
        },
        [router]
    );

    const handleToggleStatus = useCallback(
        async (id: string, currentStatus: string) => {
            const isSuspended = currentStatus === "SUSPENDED";
            const action = isSuspended ? "activate" : "suspend";
            
            if (window.confirm(`Are you sure you want to ${action} this user?`)) {
                try {
                    const newStatus = isSuspended ? "ACTIVE" : "SUSPENDED";
                    await usersApi.update(id, { status: newStatus });
                    await refetch();
                } catch (err) {
                    console.error(`Failed to ${action} user:`, err);
                    alert(`Failed to ${action} user. Please try again.`);
                }
            }
        },
        [refetch]
    );

    // Apply client-side sorting only (filtering and pagination are done in API)
    const dataFiltered: UserProps[] = useMemo(() => {
        const sorted = [...users].sort((a, b) => {
            // Handle "name" sorting specially since API returns firstName/lastName
            let aValue: string | undefined;
            let bValue: string | undefined;
            
            if (table.orderBy === "name") {
                aValue = `${a.firstName} ${a.lastName}`;
                bValue = `${b.firstName} ${b.lastName}`;
            } else {
                aValue = a[table.orderBy as keyof typeof a] as string | undefined;
                bValue = b[table.orderBy as keyof typeof b] as string | undefined;
            }

            if (aValue === undefined || bValue === undefined) return 0;

            const aStr = String(aValue).toLowerCase();
            const bStr = String(bValue).toLowerCase();

            if (table.order === "asc") {
                return aStr.localeCompare(bStr);
            }
            return bStr.localeCompare(aStr);
        });
        // Map User to UserProps format
        return sorted.map((user) => ({
            id: String(user.id),
            name: `${user.firstName} ${user.lastName}`,
            email: user.email || "",
            role: user.role || "",
            status: user.status || "active",
            avatarUrl: user.avatarUrl || "",
            isVerified: user.isVerified ?? true
        }));
    }, [users, table.order, table.orderBy]);

    const notFound = !dataFiltered.length && !!filterName && !loading;

    return (
        <DashboardContent>
            <Box
                sx={{
                    mb: 5,
                    display: "flex",
                    alignItems: "center"
                }}>
                <Typography variant="h4" sx={{ flexGrow: 1 }}>
                    Users
                </Typography>
                <Button
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    onClick={handleCreateUser}>
                    New user
                </Button>
            </Box>

            <Card>
                <UserTableToolbar
                    numSelected={table.selected.length}
                    filterName={filterName}
                    onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setFilterName(event.target.value);
                        table.onResetPage();
                    }}
                />

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Box sx={{ p: 3, textAlign: "center" }}>
                        <Typography color="error">Error loading users: {error.message}</Typography>
                        <Button onClick={refetch} sx={{ mt: 2 }}>
                            Retry
                        </Button>
                    </Box>
                ) : (
                    <>
                        <Scrollbar>
                            <TableContainer sx={{ overflow: "unset" }}>
                                <Table sx={{ minWidth: 800 }}>
                                    <UserTableHead
                                        order={table.order}
                                        orderBy={table.orderBy}
                                        rowCount={dataFiltered.length}
                                        numSelected={table.selected.length}
                                        onSort={table.onSort}
                                        onSelectAllRows={(checked) =>
                                            table.onSelectAllRows(
                                                checked,
                                                dataFiltered.map((user) => user.id)
                                            )
                                        }
                                        headLabel={[
                                            { id: "name", label: "Name" },
                                            { id: "email", label: "Email" },
                                            { id: "role", label: "Role" },
                                            { id: "isVerified", label: "Verified", align: "center" },
                                            { id: "status", label: "Status" },
                                            { id: "" }
                                        ]}
                                    />
                                    <TableBody>
                                        {dataFiltered.map((row) => (
                                            <UserTableRow
                                                key={row.id}
                                                row={row}
                                                selected={table.selected.includes(row.id)}
                                                onSelectRow={() => table.onSelectRow(row.id)}
                                                onEdit={handleEditUser}
                                                onToggleStatus={handleToggleStatus}
                                            />
                                        ))}

                                        {!notFound && (
                                            <TableEmptyRows
                                                height={68}
                                                emptyRows={emptyRows(
                                                    table.page,
                                                    table.rowsPerPage,
                                                    dataFiltered.length
                                                )}
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
                            page={table.page}
                            count={total}
                            rowsPerPage={table.rowsPerPage}
                            onPageChange={table.onChangePage}
                            rowsPerPageOptions={[5, 10, 25]}
                            onRowsPerPageChange={table.onChangeRowsPerPage}
                            sx={{
                                borderTop: "1px solid",
                                borderColor: "divider",
                                overflow: "hidden"
                            }}
                        />
                    </>
                )}
            </Card>
        </DashboardContent>
    );
}

// ----------------------------------------------------------------------

export function useTable() {
    const [page, setPage] = useState(0);
    const [orderBy, setOrderBy] = useState("name");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selected, setSelected] = useState<string[]>([]);
    const [order, setOrder] = useState<"asc" | "desc">("asc");

    const onSort = useCallback(
        (id: string) => {
            const isAsc = orderBy === id && order === "asc";
            setOrder(isAsc ? "desc" : "asc");
            setOrderBy(id);
        },
        [order, orderBy]
    );

    const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
        if (checked) {
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    }, []);

    const onSelectRow = useCallback(
        (inputValue: string) => {
            const newSelected = selected.includes(inputValue)
                ? selected.filter((value) => value !== inputValue)
                : [...selected, inputValue];

            setSelected(newSelected);
        },
        [selected]
    );

    const onResetPage = useCallback(() => {
        setPage(0);
    }, []);

    const onChangePage = useCallback((_event: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    const onChangeRowsPerPage = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            onResetPage();
        },
        [onResetPage]
    );

    return {
        page,
        order,
        onSort,
        orderBy,
        selected,
        rowsPerPage,
        onSelectRow,
        onResetPage,
        onChangePage,
        onSelectAllRows,
        onChangeRowsPerPage
    };
}
