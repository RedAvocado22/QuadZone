import * as yup from "yup";

export const yupPassword = yup
    .string()
    .min(6, "Password must have at least 6 characters")
    .matches(/[A-Z]/, "Password must have at least 1 capital letter")
    .matches(/\d/, "Password must have at least 1 digit")
    .matches(/[^a-zA-Z0-9]/, "Password must have at least 1 special character")
    .required("Password is required");

export const yupEmail = yup.string().email("Email must be a valid email address").required("Email is required");

export const yupFirstName = yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .required("First name is required");

export const yupLastName = yup
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters")
    .required("Last name is required");

export const yupName = yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .required("Name is required");

export const yupPrice = yup
    .number()
    .min(0, "Price must be greater than or equal to 0")
    .required("Price is required");

export const yupQuantity = yup
    .number()
    .integer("Quantity must be an integer")
    .min(0, "Quantity must be greater than or equal to 0")
    .required("Quantity is required");

export const yupUrl = yup
    .string()
    .test('is-valid-image-path', 'Must be a valid URL or local image path', (value: string | null | undefined) => {
        if (!value) return true; // Allow empty
        // Allow http/https URLs
        if (value.startsWith('http://') || value.startsWith('https://')) return true;
        // Allow local paths from /src/assets/img or @img
        if (value.startsWith('/src/assets/img') || value.startsWith('@img')) return true;
        return false;
    })
    .nullable();

export const yupOptionalString = yup.string().nullable();

export const yupOptionalNumber = yup.number().nullable();
