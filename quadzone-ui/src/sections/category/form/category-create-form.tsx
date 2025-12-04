import { useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

import { DashboardContent } from "src/layouts/dashboard";
import { categoriesApi } from "src/api/categories";
import type { CategoryAdminResponse } from "src/api/types";

// ----------------------------------------------------------------------

interface CategoryCreateFormProps {
    readonly onSuccess?: () => void;
    readonly onCancel?: () => void;
}

export function CategoryCreateForm({ onSuccess, onCancel }: Readonly<CategoryCreateFormProps>) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        active: true,
        imageUrl: ""
    });

    const handleChange =
        (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const value = event.target.value;
            setFormData((prev) => ({
                ...prev,
                [field]: value
            }));
            setError(null);
        };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        if (!formData.name) {
            setError("Name is required");
            return;
        }

        const payload: Omit<CategoryAdminResponse, "id" | "productCount" | "subcategoryCount" | "subcategories"> = {
            name: formData.name,
            active: formData.active,
            imageUrl: formData.imageUrl || ""
        };

        setLoading(true);
        try {
            await categoriesApi.create(payload);
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardContent>
            <Stack spacing={3}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h4">Create Category</Typography>
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
                                label="Name"
                                required
                                value={formData.name}
                                onChange={handleChange("name")}
                            />

                            <TextField
                                fullWidth
                                label="Description"
                                multiline
                                minRows={3}
                                value={formData.description}
                                onChange={handleChange("description")}
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.active}
                                        onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                                    />
                                }
                                label={formData.active ? "Active" : "Inactive"}
                            />

                            <TextField
                                fullWidth
                                label="Image URL"
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                value={formData.imageUrl}
                                onChange={handleChange("imageUrl")}
                                helperText="Optional: Add image URL for category"
                            />

                            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                                <Button variant="outlined" onClick={onCancel} disabled={loading}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" disabled={loading}>
                                    {loading ? <CircularProgress size={24} /> : "Create Category"}
                                </Button>
                            </Box>
                        </Stack>
                    </form>
                </Card>
            </Stack>
        </DashboardContent>
    );
}
