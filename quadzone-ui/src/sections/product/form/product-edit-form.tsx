import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { Iconify } from "src/components/iconify";
import { DashboardContent } from "src/layouts/dashboard";
import { productsApi } from "src/api/productsAdmin";
import { uploadApi } from "src/api/upload";
import { categoriesApi, type Category, type SubCategory } from "src/api/categories";

// ----------------------------------------------------------------------

interface ProductEditFormProps {
    productId: string | number;
    onSuccess?: () => void;
    onCancel?: () => void;
}

interface FormValues {
    name: string;
    brand: string;
    modelNumber: string;
    description: string;
    stock: number;
    price: number;
    costPrice: number;
    weight: number;
    color: string;
    imageUrl: string;
    categoryId: number | "";
    subCategoryId: number | "";
    imageMethod: "url" | "upload";
    status: string;
}

const productEditSchema = Yup.object({
    name: Yup.string()
        .required("Product name is required")
        .min(3, "Product name must be at least 3 characters")
        .max(255, "Product name cannot exceed 255 characters"),
    brand: Yup.string().required("Brand name is required").max(100, "Brand name cannot exceed 100 characters"),
    modelNumber: Yup.string().nullable(),
    description: Yup.string().max(1000, "Description cannot exceed 1000 characters").nullable(),
    stock: Yup.number()
        .required("Stock quantity is required")
        .min(0, "Stock cannot be negative")
        .integer("Stock must be a whole number"),
    price: Yup.number().required("Price is required").positive("Price must be greater than 0"),
    costPrice: Yup.number().required("Cost price is required").positive("Cost price must be greater than 0"),
    weight: Yup.number().positive("Weight must be greater than 0").nullable(),
    color: Yup.string().nullable(),
    imageUrl: Yup.string().url("Must be a valid URL").nullable(),
    categoryId: Yup.number().required("Category is required"),
    subCategoryId: Yup.number().required("Subcategory is required"),
    imageMethod: Yup.string().oneOf(["url", "upload"]).required(),
    status: Yup.string()
});

export function ProductEditForm({ productId, onSuccess, onCancel }: ProductEditFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingSubCategories, setLoadingSubCategories] = useState(false);

    const formik = useFormik<FormValues>({
        initialValues: {
            name: "",
            brand: "",
            modelNumber: "",
            description: "",
            stock: 0,
            price: 0,
            costPrice: 0,
            weight: 0,
            color: "",
            imageUrl: "",
            categoryId: "",
            subCategoryId: "",
            imageMethod: "url",
            status: ""
        },
        validationSchema: productEditSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting, setStatus }) => {
            try {
                const id = typeof productId === "string" ? Number(productId) : productId;
                if (isNaN(id)) {
                    setStatus("Invalid product ID");
                    setSubmitting(false);
                    return;
                }

                // Only send fields that the backend's update endpoint supports
                const productData: any = {
                    name: values.name,
                    brand: values.brand,
                    price: values.price,
                    quantity: values.stock,
                    description: values.description || "",
                    imageUrl: values.imageUrl && values.imageUrl.trim() ? values.imageUrl.trim() : "",
                    subCategoryId: values.subCategoryId as number,
                    status: values.status === "locked" ? "locked" : "active"
                };

                // Only include optional fields if they have values
                if (values.modelNumber) productData.modelNumber = values.modelNumber;
                if (values.costPrice) productData.costPrice = values.costPrice;
                if (values.weight) productData.weight = values.weight;
                if (values.color) productData.color = values.color;
                await productsApi.update(id, productData);

                if (onSuccess) {
                    onSuccess();
                }
            } catch (error: any) {
                console.error("Update error:", error);
                console.error("Error response:", error?.response);
                console.error("Error config:", error?.config);
                const errorMessage = error?.response?.data?.message || error?.message || "Failed to update product";
                setStatus(errorMessage);
            } finally {
                setSubmitting(false);
            }
        }
    });

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesData = await categoriesApi.getAllCategories();
                setCategories(categoriesData);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                formik.setStatus("Failed to load categories. Please refresh the page.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Load product data
    useEffect(() => {
        const loadProduct = async () => {
            try {
                const id = typeof productId === "string" ? Number(productId) : productId;
                if (isNaN(id)) {
                    formik.setStatus("Invalid product ID");
                    return;
                }
                const product = await productsApi.getById(id);

                const imageMethod = product.imageUrl?.startsWith("data:") ? "upload" : "url";

                formik.setValues({
                    name: product.name || "",
                    brand: product.brand || "",
                    modelNumber: product.modelNumber || "",
                    description: product.description || "",
                    stock: product.quantity || 0,
                    price: product.price || 0,
                    costPrice: product.costPrice || 0,
                    weight: product.weight || 0,
                    color: product.color || "",
                    imageUrl: product.imageUrl || "",
                    categoryId: product.category?.id ?? "",
                    subCategoryId: product.subCategory?.id ?? "",
                    imageMethod,
                    status: product.isActive ? "active" : "locked"
                });
            } catch (error: any) {
                console.error("Failed to load product:", error);
                formik.setStatus(error?.message || "Failed to load product");
            }
        };

        if (productId) {
            loadProduct();
        }
    }, [productId]);

    // Fetch subcategories when category changes
    useEffect(() => {
        const fetchSubCategories = async () => {
            const categoryId = formik.values.categoryId;

            if (!categoryId) {
                setSubCategories([]);
                formik.setFieldValue("subCategoryId", "");
                return;
            }

            setLoadingSubCategories(true);
            try {
                const data = await categoriesApi.getSubCategoriesByCategoryId(Number(categoryId));
                setSubCategories(data);

                // Reset subcategory when category changes
                formik.setFieldValue("subCategoryId", "");
            } catch (error) {
                console.error("Failed to fetch subcategories:", error);
                formik.setStatus("Failed to load subcategories.");
            } finally {
                setLoadingSubCategories(false);
            }
        };

        fetchSubCategories();
    }, [formik.values.categoryId]);

    const handleImageMethodChange = (_event: React.MouseEvent<HTMLElement>, newMethod: "url" | "upload" | null) => {
        if (newMethod !== null) {
            formik.setFieldValue("imageMethod", newMethod);
            formik.setFieldValue("imageUrl", "");
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            formik.setFieldError("imageUrl", "Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            formik.setFieldError("imageUrl", "Image size must be less than 5MB");
            return;
        }

        formik.setSubmitting(true);
        try {
            const result = await uploadApi.uploadImage(file);
            formik.setFieldValue("imageUrl", result.imageUrl);
            formik.setFieldError("imageUrl", undefined);
        } catch (error: any) {
            formik.setFieldError("imageUrl", error?.message || "Failed to upload image");
        } finally {
            formik.setSubmitting(false);
        }
    };

    const handleRemoveImage = () => {
        formik.setFieldValue("imageUrl", "");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const previewUrl = formik.values.imageUrl && formik.values.imageMethod === "upload" ? formik.values.imageUrl : "";

    if (loading || (formik.values.name === "" && !formik.status)) {
        return (
            <DashboardContent>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
                    <CircularProgress />
                </Box>
            </DashboardContent>
        );
    }

    return (
        <DashboardContent>
            <Stack spacing={3}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h4">Edit Product</Typography>
                    <Button variant="outlined" onClick={onCancel}>
                        ← Back
                    </Button>
                </Box>

                <Card sx={{ p: 3 }}>
                    <form onSubmit={formik.handleSubmit}>
                        <Stack spacing={3}>
                            {formik.status && (
                                <Alert severity="error" onClose={() => formik.setStatus(null)}>
                                    {formik.status}
                                </Alert>
                            )}

                            {/* Basic Information */}
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                Basic Information
                            </Typography>

                            <TextField
                                fullWidth
                                label="Product Name"
                                name="name"
                                required
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={!!(formik.touched.name && formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />

                            <Box sx={{ display: "flex", gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Brand"
                                    name="brand"
                                    required
                                    value={formik.values.brand}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={!!(formik.touched.brand && formik.errors.brand)}
                                    helperText={formik.touched.brand && formik.errors.brand}
                                />
                                <TextField
                                    fullWidth
                                    label="Model Number"
                                    name="modelNumber"
                                    value={formik.values.modelNumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={!!(formik.touched.modelNumber && formik.errors.modelNumber)}
                                    helperText={formik.touched.modelNumber && formik.errors.modelNumber}
                                />
                            </Box>

                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                multiline
                                rows={4}
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={!!(formik.touched.description && formik.errors.description)}
                                helperText={formik.touched.description && formik.errors.description}
                            />

                            {/* Category Selection */}
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                Category
                            </Typography>

                            <Box sx={{ display: "flex", gap: 2 }}>
                                <FormControl
                                    fullWidth
                                    required
                                    error={!!(formik.touched.categoryId && formik.errors.categoryId)}>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        name="categoryId"
                                        value={formik.values.categoryId}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        label="Category">
                                        <MenuItem value="">Select Category</MenuItem>
                                        {categories.map((category) => (
                                            <MenuItem key={category.id} value={category.id}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {formik.touched.categoryId && formik.errors.categoryId && (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                                            {formik.errors.categoryId}
                                        </Typography>
                                    )}
                                </FormControl>

                                <FormControl
                                    fullWidth
                                    required
                                    disabled={!formik.values.categoryId || loadingSubCategories}
                                    error={!!(formik.touched.subCategoryId && formik.errors.subCategoryId)}>
                                    <InputLabel>Subcategory</InputLabel>
                                    <Select
                                        name="subCategoryId"
                                        value={formik.values.subCategoryId}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        label="Subcategory"
                                        startAdornment={
                                            loadingSubCategories ? <CircularProgress size={20} sx={{ ml: 1 }} /> : null
                                        }>
                                        <MenuItem value="">
                                            {loadingSubCategories ? "Loading..." : "Select Subcategory"}
                                        </MenuItem>
                                        {subCategories.map((subCategory) => (
                                            <MenuItem key={subCategory.id} value={subCategory.id}>
                                                {subCategory.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {formik.touched.subCategoryId && formik.errors.subCategoryId && (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                                            {formik.errors.subCategoryId}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Box>

                            {/* Pricing & Stock */}
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                Pricing & Stock
                            </Typography>

                            <Box sx={{ display: "flex", gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Price"
                                    name="price"
                                    type="number"
                                    required
                                    value={formik.values.price || ""}
                                    onChange={(e) => formik.setFieldValue("price", parseFloat(e.target.value) || 0)}
                                    onBlur={formik.handleBlur}
                                    error={!!(formik.touched.price && formik.errors.price)}
                                    helperText={formik.touched.price && formik.errors.price}
                                    InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                                />
                                <TextField
                                    fullWidth
                                    label="Cost Price"
                                    name="costPrice"
                                    type="number"
                                    required
                                    value={formik.values.costPrice || ""}
                                    onChange={(e) => formik.setFieldValue("costPrice", parseFloat(e.target.value) || 0)}
                                    onBlur={formik.handleBlur}
                                    error={!!(formik.touched.costPrice && formik.errors.costPrice)}
                                    helperText={formik.touched.costPrice && formik.errors.costPrice}
                                    InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                                />
                            </Box>

                            <TextField
                                fullWidth
                                label="Stock Quantity"
                                name="stock"
                                type="number"
                                required
                                value={formik.values.stock || ""}
                                onChange={(e) => formik.setFieldValue("stock", parseInt(e.target.value) || 0)}
                                onBlur={formik.handleBlur}
                                error={!!(formik.touched.stock && formik.errors.stock)}
                                helperText={formik.touched.stock && formik.errors.stock}
                                InputProps={{ inputProps: { min: 0, step: 1 } }}
                            />

                            {/* Additional Details */}
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                Additional Details
                            </Typography>

                            <Box sx={{ display: "flex", gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Weight (kg)"
                                    name="weight"
                                    type="number"
                                    value={formik.values.weight || ""}
                                    onChange={(e) => formik.setFieldValue("weight", parseFloat(e.target.value) || 0)}
                                    onBlur={formik.handleBlur}
                                    error={!!(formik.touched.weight && formik.errors.weight)}
                                    helperText={formik.touched.weight && formik.errors.weight}
                                    InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                                />
                                <TextField
                                    fullWidth
                                    label="Color"
                                    name="color"
                                    value={formik.values.color}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={!!(formik.touched.color && formik.errors.color)}
                                    helperText={formik.touched.color && formik.errors.color}
                                />
                            </Box>

                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    name="status"
                                    value={formik.values.status}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    label="Status">
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="locked">Locked</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Product Image */}
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                Product Image
                            </Typography>

                            <Box>
                                <ToggleButtonGroup
                                    value={formik.values.imageMethod}
                                    exclusive
                                    onChange={handleImageMethodChange}
                                    aria-label="image method"
                                    sx={{ mb: 2 }}>
                                    <ToggleButton value="url" aria-label="url">
                                        URL
                                    </ToggleButton>
                                    <ToggleButton value="upload" aria-label="upload">
                                        Upload
                                    </ToggleButton>
                                </ToggleButtonGroup>

                                {formik.values.imageMethod === "url" ? (
                                    <TextField
                                        fullWidth
                                        label="Image URL"
                                        name="imageUrl"
                                        value={formik.values.imageUrl}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={!!(formik.touched.imageUrl && formik.errors.imageUrl)}
                                        helperText={formik.touched.imageUrl && formik.errors.imageUrl}
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
                                            disabled={formik.isSubmitting}
                                            sx={{ mr: 2 }}
                                            startIcon={
                                                formik.isSubmitting ? <CircularProgress size={16} /> : undefined
                                            }>
                                            {formik.isSubmitting ? "Uploading..." : "Choose Image"}
                                        </Button>
                                        {formik.values.imageUrl && (
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={handleRemoveImage}
                                                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}>
                                                Remove
                                            </Button>
                                        )}
                                        {formik.errors.imageUrl && (
                                            <Typography
                                                variant="caption"
                                                color="error"
                                                sx={{ display: "block", mt: 1 }}>
                                                {formik.errors.imageUrl}
                                            </Typography>
                                        )}
                                        {previewUrl && (
                                            <Box
                                                component="img"
                                                src={previewUrl}
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

                            {/* Action Buttons */}
                            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}>
                                <Button variant="outlined" onClick={onCancel} disabled={formik.isSubmitting}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={formik.isSubmitting}
                                    startIcon={
                                        formik.isSubmitting ? (
                                            <CircularProgress size={20} />
                                        ) : (
                                            <Iconify icon="solar:check-circle-bold" />
                                        )
                                    }>
                                    {formik.isSubmitting ? "Updating..." : "Update Product"}
                                </Button>
                            </Box>
                        </Stack>
                    </form>
                </Card>
            </Stack>
        </DashboardContent>
    );
}
