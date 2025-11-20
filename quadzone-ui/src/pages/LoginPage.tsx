import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { activateAccount, forgotPassword } from "../api/auth";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as yup from "yup";
import { yupEmail, yupPassword } from "../utils/Validation";
import Swal from "sweetalert2";

const loginSchema = yup
    .object({
        email: yupEmail,
        password: yupPassword
    })
    .required();

const forgotPasswordSchema = yup
    .object({
        email: yupEmail
    })
    .required();

export default function LoginPage() {
    const { login } = useUser();
    const { token } = useParams();
    const [loginView, setLoginView] = useState<"login" | "forgot">("login");
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            activateAccount(token)
                .then((success) => {
                    if (success) {
                        Swal.fire({
                            icon: "success",
                            title: "Account activated",
                            text: "Activate account successfully. Please login."
                        }).then(() => {
                            navigate("/login", { replace: true });
                        });
                    } else {
                        navigate("/login", { replace: true });
                    }
                })
                .catch(() => {
                    navigate("/login", { replace: true });
                });
        }
    }, [token, navigate]);

    const loginFormik = useFormik({
        initialValues: {
            email: "",
            password: "",
            rememberMe: false
        },
        validationSchema: loginSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const ok = await login({
                    email: values.email,
                    password: values.password
                });
                if (ok) {
                    resetForm();
                    navigate("/");
                }
            } catch {
                // console.error("Login error:", err);
                toast.error("Login failed. Please check your credentials.");
            }
        }
    });

    const forgotFormik = useFormik({
        initialValues: {
            email: ""
        },
        validationSchema: forgotPasswordSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const ok = await forgotPassword(values.email);
                if (ok) {
                    toast.success("Password reset link sent. Please check your email.");
                    resetForm();
                    setLoginView("login");
                } else {
                    toast.error("Failed to send reset link. Please try again.");
                }
            } catch (err) {
                toast.error("Failed to send reset link. Please try again.");
            }
        }
    });

    return (
        <main id="content" role="main">
            <div className="bg-gray-13 bg-md-transparent">
                <div className="container">
                    {/* breadcrumb */}
                    <div className="my-md-3">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-3 flex-nowrap flex-xl-wrap overflow-auto overflow-xl-visble">
                                <li className="breadcrumb-item flex-shrink-0 flex-xl-shrink-1">
                                    <a href="/">Home</a>
                                </li>
                                <li
                                    className="breadcrumb-item flex-shrink-0 flex-xl-shrink-1 active"
                                    aria-current="page">
                                    My Account
                                </li>
                            </ol>
                        </nav>
                    </div>
                    {/* End breadcrumb */}
                </div>
            </div>
            {/* End breadcrumb */}

            <div className="container">
                <div className="mb-4">
                    <h1 className="text-center">My Account</h1>
                </div>

                {/* This row centers the content */}
                <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-8 col-xl-6">
                        {/* --- Tab Navigation --- */}
                        <ul className="nav nav-tabs nav-justified mb-4" id="loginRegisterTab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <a
                                    className="nav-link font-size-26 p-3 active"
                                    href="#"
                                    onClick={(e) => e.preventDefault()}
                                    role="tab"
                                    aria-selected={true}>
                                    Login
                                </a>
                            </li>
                            <li className="nav-item" role="presentation">
                                <Link
                                    className="nav-link font-size-26 p-3"
                                    to="/register"
                                    role="tab"
                                    aria-selected={false}>
                                    Register
                                </Link>
                            </li>
                        </ul>

                        {/* --- Tab Content --- */}
                        <div className="tab-content" id="loginRegisterTabContent">
                            {/* --- Login Tab Pane (always active) --- */}
                            <div className="tab-pane fade show active" role="tabpanel">
                                {/* --- CONDITIONAL: LOGIN FORM --- */}
                                {loginView === "login" && (
                                    <div>
                                        <p className="text-gray-90 mb-4 text-center">
                                            Welcome back! Sign in to your account.
                                        </p>
                                        <form className="js-validate" noValidate onSubmit={loginFormik.handleSubmit}>
                                            {/* Email */}
                                            <div className="js-form-message form-group mb-4">
                                                <label className="form-label" htmlFor="signinSrEmailExample3">
                                                    Username or Email address <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    className={`form-control ${loginFormik.touched.email && loginFormik.errors.email ? "is-invalid" : ""}`}
                                                    id="signinSrEmailExample3"
                                                    placeholder="Username or Email address"
                                                    {...loginFormik.getFieldProps("email")}
                                                />
                                                {loginFormik.touched.email && loginFormik.errors.email && (
                                                    <div className="invalid-feedback">{loginFormik.errors.email}</div>
                                                )}
                                            </div>

                                            {/* Password */}
                                            <div className="js-form-message form-group mb-4">
                                                <label className="form-label" htmlFor="signinSrPasswordExample2">
                                                    Password <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="password"
                                                    className={`form-control ${loginFormik.touched.password && loginFormik.errors.password ? "is-invalid" : ""}`}
                                                    id="signinSrPasswordExample2"
                                                    placeholder="Password"
                                                    {...loginFormik.getFieldProps("password")}
                                                />
                                                {loginFormik.touched.password && loginFormik.errors.password && (
                                                    <div className="invalid-feedback">
                                                        {loginFormik.errors.password}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Remember/Forgot */}
                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <div className="custom-control custom-checkbox d-flex align-items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="custom-control-input"
                                                        id="rememberCheckbox"
                                                        {...loginFormik.getFieldProps("rememberMe")}
                                                        checked={loginFormik.values.rememberMe}
                                                    />
                                                    <label
                                                        className="custom-control-label form-label"
                                                        htmlFor="rememberCheckbox">
                                                        Remember me
                                                    </label>
                                                </div>
                                                <a
                                                    className="text-blue"
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setLoginView("forgot");
                                                    }}>
                                                    Lost your password?
                                                </a>
                                            </div>

                                            {/* Button */}
                                            <div className="mb-3 text-center">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary-dark-w px-5"
                                                    disabled={loginFormik.isSubmitting}>
                                                    {loginFormik.isSubmitting ? "Logging in..." : "Login"}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* --- CONDITIONAL: FORGOT PASSWORD FORM --- */}
                                {loginView === "forgot" && (
                                    <div>
                                        <p className="text-gray-90 mb-4 text-center">
                                            Enter your email to receive a reset link.
                                        </p>
                                        <form className="js-validate" noValidate onSubmit={forgotFormik.handleSubmit}>
                                            {/* Email */}
                                            <div className="js-form-message form-group mb-4">
                                                <label className="form-label" htmlFor="forgotEmail">
                                                    Email address <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    className={`form-control ${forgotFormik.touched.email && forgotFormik.errors.email ? "is-invalid" : ""}`}
                                                    id="forgotEmail"
                                                    placeholder="Email address"
                                                    {...forgotFormik.getFieldProps("email")}
                                                />
                                                {forgotFormik.touched.email && forgotFormik.errors.email && (
                                                    <div className="invalid-feedback">{forgotFormik.errors.email}</div>
                                                )}
                                            </div>

                                            {/* Buttons */}
                                            <div className="mb-1 text-center">
                                                <div className="mb-3">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary-dark-w px-5"
                                                        disabled={forgotFormik.isSubmitting}>
                                                        {forgotFormik.isSubmitting ? "Sending..." : "Send Reset Link"}
                                                    </button>
                                                </div>
                                                <div className="mb-2">
                                                    <a
                                                        className="text-blue"
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setLoginView("login");
                                                        }}>
                                                        Back to Login
                                                    </a>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
