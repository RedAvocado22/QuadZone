import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../api/auth";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as yup from "yup";
import { yupPassword } from "../utils/Validation";

const resetPasswordSchema = yup
    .object({
        password: yupPassword,
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password")], "Passwords must match")
            .required("Confirm password is required")
    })
    .required();

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const { token } = useParams<{ token: string }>();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const resetFormik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: ""
        },
        validationSchema: resetPasswordSchema,
        onSubmit: async (values, { resetForm }) => {
            if (!token) {
                toast.error("Invalid reset link. Please request a new password reset.");
                navigate("/login");
                return;
            }

            try {
                // Decode the token in case it was URL encoded
                const decodedToken = decodeURIComponent(token);

                await resetPassword({
                    token: decodedToken,
                    password: values.password,
                    confirmPassword: values.confirmPassword
                });

                // Show success notification with toast
                toast.success("Password reset successfully! You can now login with your new password.");

                resetForm();
                // Navigate to login after a short delay to show the toast
                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            } catch (err: any) {
                console.error("Password reset error:", err);
                const errorMsg =
                    err.response?.data?.message ||
                    (typeof err.response?.data === 'string' ? err.response.data : null) ||
                    err.message ||
                    "An unexpected error occurred. Please try again or request a new reset link.";

                // Show error notification with toast
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
                                    Reset Password
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
                    <h1 className="text-center">Reset Your Password</h1>
                </div>

                {/* This row centers the content */}
                <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-8 col-xl-6">
                        <div className="tab-content" id="resetPasswordTabContent">
                            <div className="tab-pane fade show active" role="tabpanel">
                                <p className="text-gray-90 mb-4 text-center">
                                    Enter your new password below. Make sure it's strong and secure.
                                </p>
                                <form
                                    noValidate
                                    onSubmit={resetFormik.handleSubmit}>
                                    {/* Password */}
                                    <div className="js-form-message form-group mb-4">
                                        <label className="form-label" htmlFor="resetPassword">
                                            New Password <span className="text-danger">*</span>
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className={`form-control ${resetFormik.touched.password && resetFormik.errors.password ? "is-invalid" : ""}`}
                                                id="resetPassword"
                                                placeholder="New Password"
                                                {...resetFormik.getFieldProps("password")}
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
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                            </button>
                                        </div>
                                        {resetFormik.touched.password && resetFormik.errors.password && (
                                            <div className="invalid-feedback">{resetFormik.errors.password}</div>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="js-form-message form-group mb-5">
                                        <label className="form-label" htmlFor="resetConfirmPassword">
                                            Confirm New Password <span className="text-danger">*</span>
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                className={`form-control ${resetFormik.touched.confirmPassword && resetFormik.errors.confirmPassword ? "is-invalid" : ""}`}
                                                id="resetConfirmPassword"
                                                placeholder="Confirm New Password"
                                                {...resetFormik.getFieldProps("confirmPassword")}
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
                                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                            >
                                                <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                            </button>
                                        </div>
                                        {resetFormik.touched.confirmPassword &&
                                            resetFormik.errors.confirmPassword && (
                                                <div className="invalid-feedback">
                                                    {resetFormik.errors.confirmPassword}
                                                </div>
                                            )}
                                    </div>

                                    {/* Button */}
                                    <div className="mb-3 text-center">
                                        <button
                                            type="submit"
                                            className="btn btn-primary-dark-w px-5"
                                            disabled={resetFormik.isSubmitting}>
                                            {resetFormik.isSubmitting ? "Resetting..." : "Reset Password"}
                                        </button>
                                    </div>

                                    {/* Back to Login */}
                                    <div className="text-center">
                                        <Link to="/login" className="text-blue">
                                            Back to Login
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
