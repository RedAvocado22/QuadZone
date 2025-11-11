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
