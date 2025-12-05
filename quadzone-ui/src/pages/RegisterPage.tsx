import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as yup from "yup";
import { yupEmail, yupFirstName, yupLastName, yupPassword } from "../utils/Validation";

// --- Schemas ---
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

export default function RegisterPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const registerFormik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
        validationSchema: registerSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                await register({
                    email: values.email,
                    password: values.password,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    confirmPassword: values.confirmPassword
                });

                toast.success("Registration successful! Please check your email to active the account.");
                resetForm();
                navigate("/login");
            } catch (err: any) {
                const errorMsg =
                    err.response?.data?.message ||
                    err.response?.data ||
                    "An unexpected error occurred during registration.";
                toast.error(errorMsg);
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
                                <Link
                                    className="nav-link font-size-26 p-3"
                                    to="/login" // Navigate to the login page
                                    role="tab"
                                    aria-selected={false}>
                                    Login
                                </Link>
                            </li>
                            <li className="nav-item" role="presentation">
                                <a
                                    className="nav-link font-size-26 p-3 active" // This tab is always active
                                    href="#"
                                    onClick={(e) => e.preventDefault()}
                                    role="tab"
                                    aria-selected={true}>
                                    Register
                                </a>
                            </li>
                        </ul>

                        {/* --- Tab Content --- */}
                        <div className="tab-content" id="loginRegisterTabContent">
                            {/* --- Register Tab Pane (always active) --- */}
                            <div className="tab-pane fade show active" role="tabpanel">
                                <p className="text-gray-90 mb-4 text-center">Create a new account today.</p>
                                <form className="js-validate" noValidate onSubmit={registerFormik.handleSubmit}>
                                    {/* First Name */}
                                    <div className="js-form-message form-group mb-4">
                                        <label className="form-label" htmlFor="regFirstName">
                                            First Name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${registerFormik.touched.firstName && registerFormik.errors.firstName ? "is-invalid" : ""}`}
                                            id="regFirstName"
                                            placeholder="First Name"
                                            {...registerFormik.getFieldProps("firstName")}
                                        />
                                        {registerFormik.touched.firstName && registerFormik.errors.firstName && (
                                            <div className="invalid-feedback">{registerFormik.errors.firstName}</div>
                                        )}
                                    </div>

                                    {/* Last Name */}
                                    <div className="js-form-message form-group mb-4">
                                        <label className="form-label" htmlFor="regLastName">
                                            Last Name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${registerFormik.touched.lastName && registerFormik.errors.lastName ? "is-invalid" : ""}`}
                                            id="regLastName"
                                            placeholder="Last Name"
                                            {...registerFormik.getFieldProps("lastName")}
                                        />
                                        {registerFormik.touched.lastName && registerFormik.errors.lastName && (
                                            <div className="invalid-feedback">{registerFormik.errors.lastName}</div>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="js-form-message form-group mb-4">
                                        <label className="form-label" htmlFor="RegisterSrEmailExample3">
                                            Email address <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            className={`form-control ${registerFormik.touched.email && registerFormik.errors.email ? "is-invalid" : ""}`}
                                            id="RegisterSrEmailExample3"
                                            placeholder="Email address"
                                            {...registerFormik.getFieldProps("email")}
                                        />
                                        {registerFormik.touched.email && registerFormik.errors.email && (
                                            <div className="invalid-feedback">{registerFormik.errors.email}</div>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div className="js-form-message form-group mb-4">
                                        <label className="form-label" htmlFor="regPassword">
                                            Password <span className="text-danger">*</span>
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className={`form-control ${registerFormik.touched.password && registerFormik.errors.password ? "is-invalid" : ""}`}
                                                id="regPassword"
                                                placeholder="Password"
                                                {...registerFormik.getFieldProps("password")}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-link position-absolute"
                                                style={{
                                                    right: "10px",
                                                    top: "50%",
                                                    transform: "translateY(-50%)",
                                                    padding: "0",
                                                    border: "none",
                                                    background: "none",
                                                    color: "#6c757d",
                                                    zIndex: 10
                                                }}
                                                onClick={() => setShowPassword(!showPassword)}
                                                aria-label={showPassword ? "Hide password" : "Show password"}>
                                                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                            </button>
                                        </div>
                                        {registerFormik.touched.password && registerFormik.errors.password && (
                                            <div className="invalid-feedback">{registerFormik.errors.password}</div>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="js-form-message form-group mb-5">
                                        <label className="form-label" htmlFor="regConfirmPassword">
                                            Confirm Password <span className="text-danger">*</span>
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                className={`form-control ${registerFormik.touched.confirmPassword && registerFormik.errors.confirmPassword ? "is-invalid" : ""}`}
                                                id="regConfirmPassword"
                                                placeholder="Confirm Password"
                                                {...registerFormik.getFieldProps("confirmPassword")}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-link position-absolute"
                                                style={{
                                                    right: "10px",
                                                    top: "50%",
                                                    transform: "translateY(-50%)",
                                                    padding: "0",
                                                    border: "none",
                                                    background: "none",
                                                    color: "#6c757d",
                                                    zIndex: 10
                                                }}
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
                                                <i
                                                    className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                            </button>
                                        </div>
                                        {registerFormik.touched.confirmPassword &&
                                            registerFormik.errors.confirmPassword && (
                                                <div className="invalid-feedback">
                                                    {registerFormik.errors.confirmPassword}
                                                </div>
                                            )}
                                    </div>

                                    <p className="text-gray-90 mb-4 small">
                                        Your personal data will be used to support your experience throughout this
                                        website, to manage your account, and for other purposes described in our{" "}
                                        <a href="#" className="text-blue">
                                            privacy policy.
                                        </a>
                                    </p>

                                    {/* Button */}
                                    <div className="mb-3 text-center">
                                        <button
                                            type="submit"
                                            className="btn btn-primary-dark-w px-5"
                                            disabled={registerFormik.isSubmitting}>
                                            {registerFormik.isSubmitting ? "Registering..." : "Register"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* The "Sign up today" benefits section */}
                <div className="row justify-content-center mt-6 mb-8">
                    <div className="col-md-10 col-lg-8 col-xl-6">
                        <h3 className="font-size-18 mb-3">Sign up today and you will be able to :</h3>
                        <ul className="list-group list-group-borderless">
                            <li className="list-group-item px-0">
                                <i className="fas fa-check mr-2 text-green font-size-16"></i> Speed your way through
                                checkout
                            </li>
                            <li className="list-group-item px-0">
                                <i className="fas fa-check mr-2 text-green font-size-16"></i> Track your orders easily
                            </li>
                            <li className="list-group-item px-0">
                                <i className="fas fa-check mr-2 text-green font-size-16"></i> Keep a record of all your
                                purchases
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
}
