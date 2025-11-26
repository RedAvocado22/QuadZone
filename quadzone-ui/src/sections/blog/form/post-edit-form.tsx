import { useState, useEffect, useRef } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { DashboardContent } from "src/layouts/dashboard";
import { postsApi, type Post } from "src/api/posts";
import { uploadApi } from "src/api/upload";

// ----------------------------------------------------------------------

interface PostEditFormProps {
    postId: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function PostEditForm({ postId, onSuccess, onCancel }: PostEditFormProps) {
    const [loading, setLoading] = useState(false);
    const [loadingPost, setLoadingPost] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageMethod, setImageMethod] = useState<"url" | "upload">("url");
    const [previewUrl, setPreviewUrl] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        coverUrl: "",
        postedAt: new Date().toISOString().slice(0, 10),
        authorName: "",
        authorAvatarUrl: "",
        totalViews: 0,
        totalComments: 0,
        totalShares: 0,
        totalFavorites: 0
    });

    useEffect(() => {
        const loadPost = async () => {
            setLoadingPost(true);
            setError(null);
            try {
                const post = await postsApi.getById(postId);
                setFormData({
                    title: post.title || "",
                    description: post.description || "",
                    coverUrl: post.coverUrl || "",
                    postedAt: post.postedAt
                        ? new Date(post.postedAt).toISOString().slice(0, 10)
                        : new Date().toISOString().slice(0, 10),
                    authorName: post.author?.name || "",
                    authorAvatarUrl: post.author?.avatarUrl || "",
                    totalViews: post.totalViews ?? 0,
                    totalComments: post.totalComments ?? 0,
                    totalShares: post.totalShares ?? 0,
                    totalFavorites: post.totalFavorites ?? 0
                });
                if (post.coverUrl) {
                    setPreviewUrl(post.coverUrl);
                    setImageMethod(post.coverUrl.startsWith("data:") ? "upload" : "url");
                } else {
                    setPreviewUrl("");
                    setImageMethod("url");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load post");
            } finally {
                setLoadingPost(false);
            }
        };

        loadPost();
    }, [postId]);

    const handleChange =
        (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const value = event.target.value;
            setFormData((prev) => ({
                ...prev,
                [field]: ["totalViews", "totalComments", "totalShares", "totalFavorites"].includes(field)
                    ? Number(value)
                    : value
            }));
            setError(null);
        };

    const handleImageMethodChange = (_event: React.MouseEvent<HTMLElement>, newMethod: "url" | "upload" | null) => {
        if (newMethod !== null) {
            setImageMethod(newMethod);
            setPreviewUrl(newMethod === "url" ? formData.coverUrl : "");
            if (newMethod === "upload") {
                setFormData((prev) => ({ ...prev, coverUrl: "" }));
            }
            setError(null);
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image size should be less than 5MB");
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);

            const uploadResult = await uploadApi.uploadImage(file);
            setFormData((prev) => ({ ...prev, coverUrl: uploadResult.imageUrl }));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setPreviewUrl("");
        setFormData((prev) => ({ ...prev, coverUrl: "" }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        if (!formData.title || !formData.description || !formData.authorName) {
            setError("Please fill in all required fields");
            return;
        }

        const payload: Partial<Post> = {
            title: formData.title,
            description: formData.description,
            coverUrl: formData.coverUrl,
            postedAt: new Date(formData.postedAt).toISOString(),
            author: {
                name: formData.authorName,
                avatarUrl: formData.authorAvatarUrl
            },
            totalViews: Number(formData.totalViews) || 0,
            totalComments: Number(formData.totalComments) || 0,
            totalShares: Number(formData.totalShares) || 0,
            totalFavorites: Number(formData.totalFavorites) || 0
        };

        setLoading(true);
        try {
            await postsApi.update(postId, payload);
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update post");
        } finally {
            setLoading(false);
        }
    };

    if (loadingPost) {
        return (
            <DashboardContent>
                <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                    <CircularProgress />
                </Box>
            </DashboardContent>
        );
    }

    return (
        <DashboardContent>
            <Stack spacing={3}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h4">Edit Post</Typography>
                    <Button variant="outlined" onClick={onCancel}>
                        ← Back
                    </Button>
                </Box>

                <Card sx={{ p: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            {error && <Alert severity="error">{error}</Alert>}

                            <TextField
                                fullWidth
                                label="Title"
                                required
                                value={formData.title}
                                onChange={handleChange("title")}
                            />

                            <TextField
                                fullWidth
                                label="Description"
                                required
                                multiline
                                minRows={4}
                                value={formData.description}
                                onChange={handleChange("description")}
                            />

                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                                    Cover Image
                                </Typography>
                                <ToggleButtonGroup
                                    value={imageMethod}
                                    exclusive
                                    onChange={handleImageMethodChange}
                                    aria-label="image method"
                                    sx={{ mb: 2 }}>
                                    <ToggleButton value="url" aria-label="url">
                                        Use URL
                                    </ToggleButton>
                                    <ToggleButton value="upload" aria-label="upload">
                                        Upload
                                    </ToggleButton>
                                </ToggleButtonGroup>

                                {imageMethod === "url" ? (
                                    <TextField
                                        fullWidth
                                        label="Image URL"
                                        value={formData.coverUrl}
                                        onChange={handleChange("coverUrl")}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                ) : (
                                    <Box>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            style={{ display: "none" }}
                                        />
                                        <Button
                                            variant="outlined"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploading}
                                            sx={{ mr: 2 }}>
                                            {uploading ? "Uploading..." : "Choose Image"}
                                        </Button>
                                        {previewUrl && (
                                            <Button variant="outlined" color="error" onClick={handleRemoveImage}>
                                                Remove
                                            </Button>
                                        )}
                                        {(previewUrl || formData.coverUrl) && (
                                            <Box
                                                component="img"
                                                src={previewUrl || formData.coverUrl}
                                                alt="Preview"
                                                sx={{
                                                    mt: 2,
                                                    maxWidth: 200,
                                                    maxHeight: 200,
                                                    borderRadius: 1
                                                }}
                                            />
                                        )}
                                    </Box>
                                )}
                            </Box>

                            <Box
                                sx={{
                                    display: "grid",
                                    gap: 2,
                                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }
                                }}>
                                <TextField
                                    fullWidth
                                    label="Posted At"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.postedAt}
                                    onChange={handleChange("postedAt")}
                                />

                                <TextField
                                    fullWidth
                                    label="Author Name"
                                    required
                                    value={formData.authorName}
                                    onChange={handleChange("authorName")}
                                />
                            </Box>

                            <TextField
                                fullWidth
                                label="Author Avatar URL"
                                value={formData.authorAvatarUrl}
                                onChange={handleChange("authorAvatarUrl")}
                                placeholder="https://example.com/avatar.jpg"
                            />

                            <Box
                                sx={{
                                    display: "grid",
                                    gap: 2,
                                    gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" }
                                }}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Total Views"
                                    value={formData.totalViews}
                                    onChange={handleChange("totalViews")}
                                />
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Total Comments"
                                    value={formData.totalComments}
                                    onChange={handleChange("totalComments")}
                                />
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Total Shares"
                                    value={formData.totalShares}
                                    onChange={handleChange("totalShares")}
                                />
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Total Favorites"
                                    value={formData.totalFavorites}
                                    onChange={handleChange("totalFavorites")}
                                />
                            </Box>

                            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                                <Button variant="outlined" onClick={onCancel} disabled={loading}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" disabled={loading || uploading}>
                                    {loading ? <CircularProgress size={24} /> : "Save Changes"}
                                </Button>
                            </Box>
                        </Stack>
                    </form>
                </Card>
            </Stack>
        </DashboardContent>
    );
}
