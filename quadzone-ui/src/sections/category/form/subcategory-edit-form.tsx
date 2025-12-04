import { useState, useEffect } from "react";

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

// ----------------------------------------------------------------------

interface SubcategoryEditFormProps {
    readonly subId: number;
    readonly onSuccess?: () => void;
    readonly onCancel?: () => void;
}

export function SubcategoryEditForm({ subId, onSuccess, onCancel }: SubcategoryEditFormProps) {
    const [loading, setLoading] = useState(false);
    const [loadingSubCategory, setLoadingSubCategory] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categoryId, setCategoryId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        active: true,
        productCount: 0,
        createdAt: new Date().toISOString().slice(0, 10)
    });

    useEffect(() => {
        const loadSubcategory = async () => {
            setLoadingSubCategory(true);
            setError(null);
            try {
                // Get all categories to find the subcategory
                const allCategories = await categoriesApi.getAllCategories();
                let foundSubcategory = null;
                let foundCategoryId = null;

                for (const cat of allCategories) {
                    const subs = await categoriesApi.getSubCategoriesByCategoryId(cat.id);
                    const sub = subs.find((s) => s.id === subId);
                    if (sub) {
                        foundSubcategory = sub;
                        foundCategoryId = cat.id;
                        break;
                    }
                }

                if (!foundSubcategory || !foundCategoryId) {
                    setError("Subcategory not found");
                    return;
                }

                setCategoryId(foundCategoryId);
                setFormData({
                    name: foundSubcategory.name || "",
                    description: "",
                    active: true,
                    productCount: 0,
                    createdAt: new Date().toISOString().slice(0, 10)
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load subcategory");
            } finally {
                setLoadingSubCategory(false);
            }
        };

        loadSubcategory();
    }, [subId]);

    const handleChange =
        (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const value = event.target.value;
            setFormData((prev) => ({
                ...prev,
                [field]: field === "productCount" ? Number(value) : value
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

        if (!categoryId) {
            setError("Category information not loaded");
            return;
        }

        setLoading(true);
        try {
            await categoriesApi.updateSubCategory(categoryId, subId, {
                name: formData.name,
                active: formData.active
            });
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update subcategory");
        } finally {
            setLoading(false);
        }
    };

    if (loadingSubCategory) {
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
                    <Typography variant="h4">Edit SubCategory</Typography>
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
                                        onChange={(e) => setFormData((prev) => ({ ...prev, active: e.target.checked }))}
                                    />
                                }
                                label={formData.active ? "Active" : "Inactive"}
                            />

                            <Box
                                sx={{
                                    display: "grid",
                                    gap: 2,
                                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }
                                }}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Product Count"
                                    value={formData.productCount}
                                    onChange={handleChange("productCount")}
                                    slotProps={{ htmlInput: { min: 0 } }}
                                />

                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Created At"
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    value={formData.createdAt}
                                    onChange={handleChange("createdAt")}
                                />
                            </Box>

                            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                                <Button variant="outlined" onClick={onCancel} disabled={loading}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" disabled={loading}>
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
