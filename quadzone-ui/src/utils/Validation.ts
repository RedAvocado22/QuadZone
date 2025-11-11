import * as yup from "yup";

export const password = yup
    .string()
    .min(6, "Password must have at least 6 characters")
    .matches(/[A-Z]/, "Password must have at least 1 capital letter")
    .matches(/\d/, "Password must have at least 1 digit")
    .matches(/[^a-zA-Z0-9]/, "Password must have at least 1 special character");

export const phone = yup
    .string()
    .matches(/^\d+$/, "Phone must contains only numbers")
    .min(10, "Phone must be at least 10 digits")
    .max(11, "Phone must be at most 11 digits");

export const email = yup.string().email("Email must be a valid email address").required("Email is required");

export const firstName = yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .required("Name is required");

export const lastName = yup
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters")
    .required("Last name is required");

export const address = yup
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(100, "Address must be at most 100 characters")
    .required("Address is required");
