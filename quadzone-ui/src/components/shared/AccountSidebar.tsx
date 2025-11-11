import { useMemo, useEffect, useState } from "react";
import { useUser } from "../../hooks/useUser";
import { register, forgotPassword } from "../../api/auth";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as yup from "yup";
import { yupEmail, yupFirstName, yupLastName, yupPassword } from "../../utils/Validation";

const loginSchema = yup
    .object({
        email: yupEmail,
        password: yupPassword
    })
    .required();

const registerSchema = yup
    .object({
        firstName: yupFirstName,
        lastName: yupLastName,
        email: yupEmail,
        password: yupPassword,
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password")], "Passwords must match")
            .required("Confirm password is required")
    })
    .required();

const forgotPasswordSchema = yup
    .object({
        email: yupEmail
    })
    .required();

type FormValues = {
    firstName?: string;
    lastName?: string;
    email: string;
    password?: string;
    confirmPassword?: string;
};

const schemas: Record<string, FormValues> = {
    login: loginSchema,
    signup: registerSchema,
    forgot: forgotPasswordSchema
};

const AccountSidebar = () => {
    const [activeForm, setActiveForm] = useState("login");
    const { login, refreshUser } = useUser();

    const currentSchema = useMemo(() => schemas[activeForm], [activeForm]);

    const initialValues: FormValues = {
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: ""
    };

    const formik = useFormik<FormValues>({
        initialValues: initialValues,
        validationSchema: currentSchema,
        onSubmit: async (values, { resetForm }) => {
            if (activeForm === "login") {
                if (!values.email || !values.password) return;
                try {
                    const ok = await login({
                        email: values.email,
                        password: values.password
                    });
                    if (ok) {
                        toast.success("Login successful");
                        resetForm();
                    } else {
                        toast.error("Login failed. Please check your credentials.");
                    }
                } catch (err) {
                    console.error("Login error:", err);
                    toast.error("Login failed. Please check your credentials.");
                }
            } else if (activeForm === "signup") {
                const { email, password, firstName, lastName, confirmPassword } = values;
                if (!email || !password || !firstName || !lastName || !confirmPassword) return;

                try {
                    const respData = await register({
                        email,
                        password,
                        firstName,
                        lastName,
                        confirmPassword
                    });

                    if (respData) {
                        const token = respData.access_token || respData.token || respData.jwtToken;

                        if (typeof token === "string") {
                            localStorage.setItem("access_token", token);
                            await refreshUser();
                            toast.success("Registration successful!");
                            setActiveForm("login");
                        } else {
                            toast.error("Registration succeeded but no token was received.");
                        }
                    } else {
                        console.error("Registration failed, respData is null");
                    }
                } catch (err) {
                    console.error("Registration error:", err);
                    toast.error("An unexpected error occurred during registration.");
                }
            } else if (activeForm === "forgot") {
                if (!values.email) return;

                const ok = await forgotPassword(values.email);
                if (ok) {
                    setActiveForm("login");
                }
            }
        }
    });

    const { errors, touched, isSubmitting, handleSubmit, getFieldProps, resetForm } = formik;

    useEffect(() => {
        resetForm();
    }, [activeForm, resetForm]);

    return (
        <aside
            id="sidebarContent"
            className="u-sidebar u-sidebar__lg u-unfold--hidden u-unfold--css-animation animated"
            aria-labelledby="sidebarNavToggler">
            <div className="u-sidebar__scroller">
                <div className="u-sidebar__container">
                    <div className="js-scrollbar u-header-sidebar__footer-offset pb-3">
                        {/* Toggle Button */}
                        <div className="d-flex align-items-center pt-4 px-7">
                            <button type="button" className="close ml-auto" data-unfold-target="#sidebarContent">
                                <i className="ec ec-close-remove"></i>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="js-scrollbar u-sidebar__body">
                            <div className="u-sidebar__content u-header-sidebar__content">
                                {/* Use formik.handleSubmit */}
                                <form className="js-validate" onSubmit={handleSubmit} noValidate>
                                    {/* Login Form */}
                                    {activeForm === "login" && (
                                        <div id="login">
                                            <header className="text-center mb-7">
                                                <h2 className="h4 mb-0">Welcome Back!</h2>
                                                <p>Login to manage your account.</p>
                                            </header>

                                            <div className="form-group">
                                                <div className="js-form-message js-focus-state">
                                                    <label className="sr-only" htmlFor="signinEmail">
                                                        Email
                                                    </label>
                                                    <div className="input-group">
                                                        <div className="input-group-prepend">
                                                            <span className="input-group-text">
                                                                <span className="fas fa-user"></span>
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="email"
                                                            // Use touched.email to only show error after blur
                                                            className={`form-control ${
                                                                touched.email && errors.email ? "is-invalid" : ""
                                                            }`}
                                                            id="signinEmail"
                                                            placeholder="Email"
                                                            // Use getFieldProps
                                                            {...getFieldProps("email")}
                                                            aria-invalid={
                                                                touched.email && errors.email ? "true" : "false"
                                                            }
                                                        />
                                                    </div>
                                                    {/* Update error logic */}
                                                    {touched.email && errors.email && (
                                                        <small className="text-danger mt-1 d-block">
                                                            {/* Formik error is just a string */}
                                                            {errors.email}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <div className="js-form-message js-focus-state">
                                                    <label className="sr-only" htmlFor="signinPassword">
                                                        Password
                                                    </label>
                                                    <div className="input-group">
                                                        <div className="input-group-prepend">
                                                            <span className="input-group-text">
                                                                <span className="fas fa-lock"></span>
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="password"
                                                            className={`form-control ${
                                                                touched.password && errors.password ? "is-invalid" : ""
                                                            }`}
                                                            id="signinPassword"
                                                            placeholder="Password"
                                                            // Use getFieldProps
                                                            {...getFieldProps("password")}
                                                            aria-invalid={
                                                                touched.password && errors.password ? "true" : "false"
                                                            }
                                                        />
                                                    </div>
                                                    {/* Update error logic */}
                                                    {touched.password && errors.password && (
                                                        <small className="text-danger mt-1 d-block">
                                                            {errors.password}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-end mb-4">
                                                <a
                                                    className="js-animation-link small link-muted"
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setActiveForm("forgot");
                                                    }}>
                                                    Forgot Password?
                                                </a>
                                            </div>

                                            <div className="mb-2">
                                                <button
                                                    type="submit"
                                                    className="btn btn-block btn-sm btn-primary transition-3d-hover"
                                                    // 'isSubmitting' comes from formik
                                                    disabled={isSubmitting}>
                                                    {isSubmitting ? "Logging in..." : "Login"}
                                                </button>
                                            </div>

                                            <div className="text-center mb-4">
                                                <span className="small text-muted">Do not have an account?</span>
                                                <a
                                                    className="js-animation-link small text-dark"
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setActiveForm("signup");
                                                    }}>
                                                    Signup
                                                </a>
                                            </div>

                                            {/* Social login buttons (optional) */}
                                            <div className="text-center">
                                                <span className="u-divider u-divider--xs u-divider--text mb-4">OR</span>
                                            </div>
                                            <div className="d-flex">
                                                <a
                                                    className="btn btn-block btn-sm btn-soft-facebook transition-3d-hover mr-1"
                                                    href="#">
                                                    <span className="fab fa-facebook-square mr-1"></span>
                                                    Facebook
                                                </a>
                                                <a
                                                    className="btn btn-block btn-sm btn-soft-google transition-3d-hover ml-1 mt-0"
                                                    href="#">
                                                    <span className="fab fa-google mr-1"></span>
                                                    Google
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {/* Signup Form */}
                                    {activeForm === "signup" && (
                                        <div id="signup">
                                            <header className="text-center mb-7">
                                                <h2 className="h4 mb-0">Welcome to Electro.</h2>
                                                <p>Fill out the form to get started.</p>
                                            </header>

                                            {/* First Name */}
                                            <div className="form-group">
                                                <div className="js-form-message js-focus-state">
                                                    <label className="sr-only" htmlFor="signupFirstName">
                                                        First name
                                                    </label>
                                                    <div className="input-group">
                                                        <div className="input-group-prepend">
                                                            <span className="input-group-text">
                                                                <span className="fas fa-user"></span>
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            className={`form-control ${
                                                                touched.firstName && errors.firstName
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            id="signupFirstName"
                                                            placeholder="First name"
                                                            {...getFieldProps("firstName")}
                                                            aria-invalid={
                                                                touched.firstName && errors.firstName ? "true" : "false"
                                                            }
                                                        />
                                                    </div>
                                                    {touched.firstName && errors.firstName && (
                                                        <small className="text-danger mt-1 d-block">
                                                            {errors.firstName}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Last Name */}
                                            <div className="form-group">
                                                <div className="js-form-message js-focus-state">
                                                    <label className="sr-only" htmlFor="signupLastName">
                                                        Last name
                                                    </label>
                                                    <div className="input-group">
                                                        <div className="input-group-prepend">
                                                            <span className="input-group-text">
                                                                <span className="fas fa-user"></span>
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            className={`form-control ${
                                                                touched.lastName && errors.lastName ? "is-invalid" : ""
                                                            }`}
                                                            id="signupLastName"
                                                            placeholder="Last name"
                                                            {...getFieldProps("lastName")}
                                                            aria-invalid={
                                                                touched.lastName && errors.lastName ? "true" : "false"
                                                            }
                                                        />
                                                    </div>
                                                    {touched.lastName && errors.lastName && (
                                                        <small className="text-danger mt-1 d-block">
                                                            {errors.lastName}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Email */}
                                            <div className="form-group">
                                                <div className="js-form-message js-focus-state">
                                                    <label className="sr-only" htmlFor="signupEmail">
                                                        Email
                                                    </label>
                                                    <div className="input-group">
                                                        <div className="input-group-prepend">
                                                            <span className="input-group-text">
                                                                <span className="fas fa-envelope"></span>
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="email"
                                                            className={`form-control ${
                                                                touched.email && errors.email ? "is-invalid" : ""
                                                            }`}
                                                            id="signupEmail"
                                                            placeholder="Email"
                                                            {...getFieldProps("email")}
                                                            aria-invalid={
                                                                touched.email && errors.email ? "true" : "false"
                                                            }
                                                        />
                                                    </div>
                                                    {touched.email && errors.email && (
                                                        <small className="text-danger mt-1 d-block">
                                                            {errors.email}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Password */}
                                            <div className="form-group">
                                                <div className="js-form-message js-focus-state">
                                                    <label className="sr-only" htmlFor="signupPassword">
                                                        Password
                                                    </label>
                                                    <div className="input-group">
                                                        <div className="input-group-prepend">
                                                            <span className="input-group-text">
                                                                <span className="fas fa-lock"></span>
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="password"
                                                            className={`form-control ${
                                                                touched.password && errors.password ? "is-invalid" : ""
                                                            }`}
                                                            id="signupPassword"
                                                            placeholder="Password"
                                                            {...getFieldProps("password")}
                                                            aria-invalid={
                                                                touched.password && errors.password ? "true" : "false"
                                                            }
                                                        />
                                                    </div>
                                                    {touched.password && errors.password && (
                                                        <small className="text-danger mt-1 d-block">
                                                            {errors.password}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Confirm Password */}
                                            <div className="form-group">
                                                <div className="js-form-message js-focus-state">
                                                    <label className="sr-only" htmlFor="signupConfirmPassword">
                                                        Confirm Password
                                                    </label>
                                                    <div className="input-group">
                                                        <div className="input-group-prepend">
                                                            <span className="input-group-text">
                                                                <span className="fas fa-key"></span>
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="password"
                                                            className={`form-control ${
                                                                touched.confirmPassword && errors.confirmPassword
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            id="signupConfirmPassword"
                                                            placeholder="Confirm Password"
                                                            {...getFieldProps("confirmPassword")}
                                                            aria-invalid={
                                                                touched.confirmPassword && errors.confirmPassword
                                                                    ? "true"
                                                                    : "false"
                                                            }
                                                        />
                                                    </div>
                                                    {touched.confirmPassword && errors.confirmPassword && (
                                                        <small className="text-danger mt-1 d-block">
                                                            {errors.confirmPassword}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mb-2">
                                                <button
                                                    type="submit"
                                                    className="btn btn-block btn-sm btn-primary transition-3d-hover"
                                                    disabled={isSubmitting}>
                                                    {isSubmitting ? "Signing up..." : "Get Started"}
                                                </button>
                                            </div>

                                            <div className="text-center mb-4">
                                                <span className="small text-muted">Already have an account?</span>
                                                <a
                                                    className="js-animation-link small text-dark"
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setActiveForm("login");
                                                    }}>
                                                    Login
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {/* Forgot Password Form */}
                                    {activeForm === "forgot" && (
                                        <div id="forgotPassword">
                                            <header className="text-center mb-7">
                                                <h2 className="h4 mb-0">Forgot Password?</h2>
                                                <p>Enter your email to reset your password.</p>
                                            </header>

                                            <div className="form-group">
                                                <div className="js-form-message js-focus-state">
                                                    <label className="sr-only" htmlFor="forgotEmail">
                                                        Email
                                                    </label>
                                                    <div className="input-group">
                                                        <div className="input-group-prepend">
                                                            <span className="input-group-text">
                                                                <span className="fas fa-envelope"></span>
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="email"
                                                            className={`form-control ${
                                                                touched.email && errors.email ? "is-invalid" : ""
                                                            }`}
                                                            id="forgotEmail"
                                                            placeholder="Email"
                                                            {...getFieldProps("email")}
                                                            aria-invalid={
                                                                touched.email && errors.email ? "true" : "false"
                                                            }
                                                        />
                                                    </div>
                                                    {touched.email && errors.email && (
                                                        <small className="text-danger mt-1 d-block">
                                                            {errors.email}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mb-2">
                                                <button
                                                    type="submit"
                                                    className="btn btn-block btn-sm btn-primary transition-3d-hover"
                                                    disabled={isSubmitting}>
                                                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                                                </button>
                                            </div>

                                            <div className="text-center mb-4">
                                                <span className="small text-muted">Remembered your password?</span>
                                                <a
                                                    className="js-animation-link small text-dark"
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setActiveForm("login");
                                                    }}>
                                                    Login
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default AccountSidebar;
