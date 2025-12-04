import { useState, useCallback } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { useAdminBlogs } from "src/hooks/useAdminBlogs";
import { DashboardContent } from "src/layouts/dashboard";
import { useRouter } from "src/routing/hooks";
import { deleteBlog } from "src/api/blog";

import { Iconify } from "src/components/iconify";

import { PostItem } from "../blog-item";
import { PostSearch } from "../blog-search";

import type { IPostItem } from "../blog-item";

// ----------------------------------------------------------------------

export function BlogView() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);

    // Fetch admin blogs from API with status filtering
    const { blogs, loading, error, total, currentStatus, setCurrentStatus, refetch } = useAdminBlogs({
        page,
        size: 12,
        search,
    });


    const handleCreatePost = useCallback(() => {
        router.push("/admin/blog/create");
    }, [router]);

    const handleViewPost = useCallback(
        (id: string) => {
            router.push(`/admin/blog/${id}`);
        },
        [router]
    );

    const handleEditPost = useCallback(
        (id: string) => {
            router.push(`/admin/blog/${id}/edit`);
        },
        [router]
    );

    const handleDeletePost = useCallback(
        async (id: string) => {
            if (!globalThis.confirm("Are you sure you want to delete this post?")) {
                return;
            }
            try {
                await deleteBlog(Number(id));
                refetch();
            } catch (err) {
                console.error("Failed to delete post:", err);
                alert("Failed to delete post");
            }
        },
        [refetch]
    );

    const handleSearch = useCallback((searchValue: string) => {
        setSearch(searchValue);
        setPage(0); // Reset to first page when search changes
    }, []);

    const handleStatusChange = useCallback((newStatus: 'All' | 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') => {
        setCurrentStatus(newStatus);
        setPage(0); // Reset to first page when status changes
    }, [setCurrentStatus]);

    const handlePageChange = useCallback((_event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage - 1); // Pagination is 1-based, API is 0-based
    }, []);

    const totalPages = Math.ceil(total / 12);

    return (
        <DashboardContent>
            <Box
                sx={{
                    mb: 5,
                    display: "flex",
                    alignItems: "center"
                }}>
                <Typography variant="h4" sx={{ flexGrow: 1 }}>
                    Blog
                </Typography>
                <Button
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    onClick={handleCreatePost}>
                    New post
                </Button>
            </Box>

            <Card>
                <Box
                    sx={{
                        mb: 3,
                        p: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2
                    }}>
                    <PostSearch onSearch={handleSearch} />
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={currentStatus}
                            label="Status"
                            onChange={(e) => handleStatusChange(e.target.value as 'All' | 'DRAFT' | 'PUBLISHED' | 'ARCHIVED')}
                        >
                            <MenuItem value="All">All Blogs</MenuItem>
                            <MenuItem value="DRAFT">Draft</MenuItem>
                            <MenuItem value="PUBLISHED">Published</MenuItem>
                            <MenuItem value="ARCHIVED">Archived</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Box sx={{ p: 3, textAlign: "center" }}>
                        <Typography color="error">Error loading blogs: {error.message}</Typography>
                        <Button onClick={refetch} sx={{ mt: 2 }}>
                            Retry
                        </Button>
                    </Box>
                ) : blogs.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: "center" }}>
                        <Typography>No blogs found</Typography>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                {blogs.map((blog, index: number) => {
                                    const latestPostLarge = index === 0;
                                    const latestPost = index === 1 || index === 2;

                                    // Map BlogDetailResponse to IPostItem
                                    const postItem: IPostItem = {
                                        id: String(blog.id),
                                        title: blog.title,
                                        coverUrl: blog.thumbnailUrl || 'default-cover.jpg',
                                        totalViews: 0,
                                        description: blog.content?.substring(0, 150).replaceAll(/<[^>]*>/g, '') || blog.title,
                                        totalShares: 0,
                                        totalComments: blog.comments?.length || 0,
                                        totalFavorites: 0,
                                        postedAt: blog.createdAt,
                                        author: {
                                            name: blog.author?.firstName + ' ' + blog.author?.lastName || 'Unknown',
                                            avatarUrl: ''
                                        }
                                    };

                                    return (
                                        <Grid
                                            key={blog.id}
                                            size={{
                                                xs: 12,
                                                sm: latestPostLarge ? 12 : 6,
                                                md: latestPostLarge ? 6 : 3
                                            }}>
                                            <PostItem
                                                post={postItem}
                                                latestPost={latestPost}
                                                latestPostLarge={latestPostLarge}
                                                onView={handleViewPost}
                                                onEdit={handleEditPost}
                                                onDelete={handleDeletePost}
                                                
                                            />
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Box>

                        <Box sx={{ p: 3, pt: 0, display: "flex", justifyContent: "center" }}>
                            <Pagination
                                count={totalPages}
                                page={page + 1}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                    </>
                )}
            </Card>
        </DashboardContent>
    );
}
