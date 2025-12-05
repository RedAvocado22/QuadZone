import { useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { Iconify } from "src/components/iconify";
import { DashboardContent } from "src/layouts/dashboard";
import { usersApi, type User } from "src/api/users";
import { uploadApi } from "src/api/upload";
import { yupEmail, yupFirstName, yupLastName, yupUrl } from "src/utils/Validation";

// ----------------------------------------------------------------------

interface UserEditFormProps {
    userId: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    avatarUrl: string;
    isVerified: boolean;
    status: "ACTIVE" | "SUSPENDED" | "UNACTIVE";
    avatarMethod: "url" | "upload";
}

const userEditSchema = yup.object({
    firstName: yupFirstName,
    lastName: yupLastName,
    email: yupEmail,
    role: yup.string().required("Role is required"),
    avatarUrl: yupUrl,
    isVerified: yup.boolean(),
    status: yup.string().oneOf(["ACTIVE", "SUSPENDED", "UNACTIVE"]).required(),
    avatarMethod: yup.string().oneOf(["url", "upload"]).required()
});

export function UserEditForm({ userId, onSuccess, onCancel }: UserEditFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formik = useFormik<FormValues>({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            role: "CUSTOMER",
            avatarUrl: "",
            isVerified: false,
            status: "ACTIVE",
            avatarMethod: "url"
        },
        validationSchema: userEditSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting, setFieldError, setStatus }) => {
            try {
                const userData: Partial<User> = {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    role: values.role as User["role"],
                    avatarUrl: values.avatarUrl || "",
                    isVerified: values.isVerified,
                    status: values.status
                };
                await usersApi.update(userId, userData);

                if (onSuccess) {
                    onSuccess();
                }
            } catch (error: any) {
                const errorMessage = error?.response?.data?.message || error?.message || "Failed to update user";
                setStatus(errorMessage);
                setFieldError("email", errorMessage);
            } finally {
                setSubmitting(false);
            }
        }
    });

    // Load user data
    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await usersApi.getById(userId);
                const avatarMethod = user.avatarUrl?.startsWith("data:") ? "upload" : "url";

                formik.setValues({
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    email: user.email || "",
                    role: user.role || "CUSTOMER",
                    avatarUrl: user.avatarUrl || "",
                    isVerified: user.isVerified ?? false,
                    status: user.status,
                    avatarMethod
                });
            } catch (error: any) {
                formik.setStatus(error?.message || "Failed to load user");
            }
        };

        if (userId) {
            loadUser();
        }
    }, [userId]);

    const handleAvatarMethodChange = (_event: React.MouseEvent<HTMLElement>, newMethod: "url" | "upload" | null) => {
        if (newMethod !== null) {
            formik.setFieldValue("avatarMethod", newMethod);
            if (newMethod === "upload" && formik.values.avatarUrl && !formik.values.avatarUrl.startsWith("data:")) {
                formik.setFieldValue("avatarUrl", "");
            }
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            formik.setFieldError("avatarUrl", "Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            formik.setFieldError("avatarUrl", "Image size must be less than 5MB");
            return;
        }

        formik.setSubmitting(true);
        try {
            const result = await uploadApi.uploadImage(file);
            formik.setFieldValue("avatarUrl", result.imageUrl);
            formik.setFieldError("avatarUrl", undefined);
        } catch (error: any) {
            formik.setFieldError("avatarUrl", error?.message || "Failed to upload image");
        } finally {
            formik.setSubmitting(false);
        }
    };

    const handleRemoveImage = () => {
        formik.setFieldValue("avatarUrl", "");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const previewUrl =
        formik.values.avatarUrl && formik.values.avatarMethod === "upload" ? formik.values.avatarUrl : "";

    if (formik.values.firstName === "" && !formik.status) {
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
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2
                    }}>
                    <Button variant="text" onClick={onCancel} sx={{ minWidth: "auto" }}>
                        ← Back
                    </Button>
                    <Typography variant="h4">Edit User</Typography>
                </Box>

                <Card sx={{ p: 3 }}>
                    <form onSubmit={formik.handleSubmit}>
                        <Stack spacing={3}>
                            {formik.status && (
                                <Alert severity="error" onClose={() => formik.setStatus(null)}>
                                    {formik.status}
                                </Alert>
                            )}

                            {/* Avatar Section */}
                            <Stack spacing={2}>
                                <Typography variant="h6">Avatar</Typography>

                                <ToggleButtonGroup
                                    value={formik.values.avatarMethod}
                                    exclusive
                                    onChange={handleAvatarMethodChange}
                                    aria-label="avatar method"
                                    fullWidth>
                                    <ToggleButton value="url" aria-label="url">
                                        URL
                                    </ToggleButton>
                                    <ToggleButton value="upload" aria-label="upload">
                                        Upload
                                    </ToggleButton>
                                </ToggleButtonGroup>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2
                                    }}>
                                    <Avatar
                                        src={previewUrl || formik.values.avatarUrl || undefined}
                                        alt={formik.values.firstName || "User"}
                                        sx={{ width: 80, height: 80 }}>
                                        {formik.values.firstName
                                            ? formik.values.firstName.charAt(0).toUpperCase()
                                            : "U"}
                                    </Avatar>

                                    <Box sx={{ flex: 1 }}>
                                        {formik.values.avatarMethod === "url" ? (
                                            <TextField
                                                fullWidth
                                                label="Avatar URL"
                                                name="avatarUrl"
                                                value={formik.values.avatarUrl}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={!!(formik.touched.avatarUrl && formik.errors.avatarUrl)}
                                                helperText={formik.touched.avatarUrl && formik.errors.avatarUrl}
                                                placeholder="https://example.com/avatar.jpg"
                                            />
                                        ) : (
                                            <Stack spacing={1}>
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
                                                    startIcon={
                                                        formik.isSubmitting ? <CircularProgress size={16} /> : undefined
                                                    }
                                                    disabled={formik.isSubmitting}
                                                    fullWidth>
                                                    {formik.isSubmitting ? "Uploading..." : "Choose Image"}
                                                </Button>
                                                {formik.values.avatarUrl && (
                                                    <Button
                                                        variant="text"
                                                        color="error"
                                                        size="small"
                                                        onClick={handleRemoveImage}
                                                        startIcon={
                                                            <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                                                        }>
                                                        Remove
                                                    </Button>
                                                )}
                                                {formik.errors.avatarUrl && (
                                                    <Typography variant="caption" color="error">
                                                        {formik.errors.avatarUrl}
                                                    </Typography>
                                                )}
                                                <Typography variant="caption" color="text.secondary">
                                                    Max file size: 5MB. Supported formats: JPG, PNG, GIF
                                                </Typography>
                                            </Stack>
                                        )}
                                    </Box>
                                </Box>
                            </Stack>

                            <Divider />

                            {/* Basic Information */}
                            <Stack spacing={2}>
                                <Typography variant="h6">Basic Information</Typography>

                                <TextField
                                    fullWidth
                                    label="First Name"
                                    name="firstName"
                                    required
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={!!(formik.touched.firstName && formik.errors.firstName)}
                                    helperText={formik.touched.firstName && formik.errors.firstName}
                                />
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    name="lastName"
                                    required
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={!!(formik.touched.lastName && formik.errors.lastName)}
                                    helperText={formik.touched.lastName && formik.errors.lastName}
                                />

                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={!!(formik.touched.email && formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                            </Stack>

                            <Divider />

                            {/* Role and Status */}
                            <Stack spacing={2}>
                                <Typography variant="h6">Role & Status</Typography>

                                <FormControl fullWidth error={!!(formik.touched.role && formik.errors.role)}>
                                    <InputLabel>Role</InputLabel>
                                    <Select
                                        name="role"
                                        value={formik.values.role}
                                        label="Role"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}>
                                        <MenuItem value="ADMIN">Admin</MenuItem>
                                        <MenuItem value="STAFF">Staff</MenuItem>
                                        <MenuItem value="CUSTOMER">Customer</MenuItem>
                                        <MenuItem value="SHIPPER">Shipper</MenuItem>
                                    </Select>
                                    {formik.touched.role && formik.errors.role && (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                                            {formik.errors.role}
                                        </Typography>
                                    )}
                                </FormControl>

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formik.values.status === "ACTIVE"}
                                            onChange={(e) =>
                                                formik.setFieldValue(
                                                    "status",
                                                    e.target.checked ? "ACTIVE" : "SUSPENDED"
                                                )
                                            }
                                        />
                                    }
                                    label={formik.values.status === "ACTIVE" ? "Active" : "SUSPENDED"}
                                />

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formik.values.isVerified}
                                            onChange={(e) => formik.setFieldValue("isVerified", e.target.checked)}
                                        />
                                    }
                                    label="Verified"
                                />
                            </Stack>

                            <Divider />

                            {/* Actions */}
                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    onClick={onCancel}
                                    disabled={formik.isSubmitting}>
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
                                    {formik.isSubmitting ? "Updating..." : "Update User"}
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                </Card>
            </Stack>
        </DashboardContent>
    );
}
