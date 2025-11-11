import React from "react";
import { useUser } from "../../hooks/useUser";
import { register } from "../../api/auth";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const AccountSidebar = () => {
    const [activeForm, setActiveForm] = React.useState("login");
    const { login } = useUser();

    type FormValues = {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        confirmPassword: string;
    };

    const schema = yup
        .object({
            firstName: yup.string().notRequired(),
            lastName: yup.string().notRequired(),
            email: yup.string().email("Invalid email").required("Email is required"),
            password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
            confirmPassword: yup
                .string()
                .oneOf([yup.ref("password")], "Passwords must match")
                .required("Confirm password is required")
        })
        .required();

    const {
        register: formRegister,
        handleSubmit: rhfHandleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormValues>({ resolver: yupResolver(schema) });

    const onSubmit = async (data: FormValues) => {
        // Temporary visible alert to confirm submit is firing in the browser
        // and to make the action obvious if console is filtered.
        // Remove these alerts once debugging is finished.
        // eslint-disable-next-line no-alert
        alert("onSubmit fired: " + activeForm);
        console.log("onSubmit fired", { data, activeForm });
        try {
            if (activeForm === "login") {
                const ok = await login({ email: data.email, password: data.password });
                if (ok) {
                    toast.success("Login successful");
                    // reset form
                    reset();
                    // (DEBUG) keep sidebar open so developers can inspect network/console
                } else {
                    toast.error("Login failed");
                }
            } else {
                if (!data.firstName || !data.lastName) {
                    toast.error("First name and last name are required");
                    return;
                }

                console.log("Form data before register:", data);
                const ok = await register({
                    email: data.email,
                    password: data.password,
                    firstName: data.firstName,
                    lastName: data.lastName
                });
                if (ok) {
                    toast.success("Registration successful. Please check your email to activate your account.");
                    setActiveForm("login");
                    reset();
                    // (DEBUG) keep sidebar open so developers can inspect network/console
                } else {
                    toast.error("Registration failed");
                }
            }
        } catch (err) {
            console.error("Auth error:", err);
            toast.error("An unexpected error occurred");
        }
    };

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
                                <form className="js-validate" onSubmit={rhfHandleSubmit(onSubmit)}>
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
                                                            className="form-control"
                                                            id="signinEmail"
                                                            placeholder="Email"
                                                            {...formRegister("email")}
                                                            aria-invalid={errors.email ? "true" : "false"}
                                                        />
                                                        {errors.email && (
                                                            <small className="text-danger">
                                                                {errors.email.message}
                                                            </small>
                                                        )}
                                                    </div>
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
                                                            className="form-control"
                                                            id="signinPassword"
                                                            placeholder="Password"
                                                            {...formRegister("password")}
                                                            aria-invalid={errors.password ? "true" : "false"}
                                                        />
                                                        {errors.password && (
                                                            <small className="text-danger">
                                                                {errors.password.message}
                                                            </small>
                                                        )}
                                                    </div>
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
                                                    disabled={isSubmitting}>
                                                    Login
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
                                                            className="form-control"
                                                            id="signupFirstName"
                                                            placeholder="First name"
                                                            {...formRegister("firstName")}
                                                            aria-invalid={errors.firstName ? "true" : "false"}
                                                        />
                                                        {errors.firstName && (
                                                            <small className="text-danger">
                                                                {errors.firstName.message}
                                                            </small>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

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
                                                            className="form-control"
                                                            id="signupLastName"
                                                            placeholder="Last name"
                                                            {...formRegister("lastName")}
                                                            aria-invalid={errors.lastName ? "true" : "false"}
                                                        />
                                                        {errors.lastName && (
                                                            <small className="text-danger">
                                                                {errors.lastName.message}
                                                            </small>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

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
                                                            className="form-control"
                                                            id="signupEmail"
                                                            placeholder="Email"
                                                            {...formRegister("email")}
                                                            aria-invalid={errors.email ? "true" : "false"}
                                                        />
                                                        {errors.email && (
                                                            <small className="text-danger">
                                                                {errors.email.message}
                                                            </small>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

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
                                                            className="form-control"
                                                            id="signupPassword"
                                                            placeholder="Password"
                                                            {...formRegister("password")}
                                                            aria-invalid={errors.password ? "true" : "false"}
                                                        />
                                                        {errors.password && (
                                                            <small className="text-danger">
                                                                {errors.password.message}
                                                            </small>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

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
                                                            className="form-control"
                                                            id="signupConfirmPassword"
                                                            placeholder="Confirm Password"
                                                            {...formRegister("confirmPassword")}
                                                            aria-invalid={errors.confirmPassword ? "true" : "false"}
                                                        />
                                                        {errors.confirmPassword && (
                                                            <small className="text-danger">
                                                                {errors.confirmPassword.message}
                                                            </small>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-2">
                                                <button
                                                    type="submit"
                                                    className="btn btn-block btn-sm btn-primary transition-3d-hover"
                                                    disabled={isSubmitting}>
                                                    Get Started
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
