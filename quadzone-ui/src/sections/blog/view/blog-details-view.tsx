import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRouter } from "src/routing/hooks";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";

import { DashboardContent } from "src/layouts/dashboard";
import { getBlogById } from "src/api/blog";
import { fDate, fShortenNumber, htmlToText } from "src/utils/formatters";
import { defaultImages } from "src/constants/images";

// ----------------------------------------------------------------------

export function PostDetailsView() {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return <div>Invalid ID</div>;
    }

    const blogId = Number(id); // Now blogId is a number
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [blog, setPost] = useState<any>(null);

    useEffect(() => {
        const loadPost = async () => {
            if (!blogId) return;
            setLoading(true);
            setError(null);
            try {
                const data = await getBlogById(blogId);
                setPost(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load post");
            } finally {
                setLoading(false);
            }
        };

        loadPost();
    }, [blogId]);

    const handleEdit = () => {
        if (blogId) {
            router.push(`/admin/blog/${blogId}/edit`);
        }
    };

    const handleBack = () => {
        router.push("/admin/blog");
    };

    

    if (loading) {
        return (
            <DashboardContent>
                <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                    <CircularProgress />
                </Box>
            </DashboardContent>
        );
    }

    if (error || !blog) {
        return (
            <DashboardContent>
                <Alert severity="error">{error || "Post not found"}</Alert>
                <Button onClick={handleBack} sx={{ mt: 2 }}>
                    Back to Blog
                </Button>
            </DashboardContent>
        );
    }

    return (
        <DashboardContent>
            <Stack spacing={3}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h4">Post Details</Typography>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button variant="outlined" onClick={handleBack}>
                            Back
                        </Button>
                        <Button variant="contained" onClick={handleEdit}>
                            Edit
                        </Button>
                    </Box>
                </Box>

                <Card sx={{ p: 3 }}>
                    <Stack spacing={3}>
                        {blog.thumbnailUrl && (
                            <Box
                                component="img"
                                src={blog.thumbnailUrl}
                                alt={blog.title}
                                sx={{
                                    width: "100%",
                                    height: 360,
                                    borderRadius: 2,
                                    objectFit: "cover"
                                }}
                            />
                        )}

                        <Box>
                            <Typography variant="h5" gutterBottom>
                                {blog.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {fDate(blog.createdAt)}
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar src={blog.author?.avatarUrl || defaultImages} alt={blog.author?.name} />
                            <Typography variant="subtitle1">{blog.author?.name}</Typography>
                        </Box>

                        {blog.excerpt && (
                            <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 1 }}>
                                <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                                    {blog.excerpt}
                                </Typography>
                            </Box>
                        )}

                        <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                            {htmlToText(blog.content)}
                        </Typography>

                        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                            <Typography variant="body2" color="text.secondary">
                                Comments: {fShortenNumber(blog.comments?.length || 0)}
                            </Typography>
                        </Box>
                    </Stack>
                </Card>
            </Stack>
        </DashboardContent>
    );
}
