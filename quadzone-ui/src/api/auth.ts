import axios from "axios";
import Swal from "sweetalert2";
import API from "./base";

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    confirmPassword: string;
}

/**
 * Registers a new user.
 * @param req The registration request data.
 * @returns The response data (e.g., { access_token: "..." }) on success, or null on failure.
 */
export const register = async (req: RegisterRequest): Promise<any | null> => {
    try {
        // console.log("Sending register request:", req);
        // The backend expects: firstname, lastname, email, password, confirm_password (with underscore!)
        const payload = {
            firstname: req.firstName,
            lastname: req.lastName,
            email: req.email,
            password: req.password,
            confirm_password: req.confirmPassword
        };
        const response = await API.post("/auth/register", payload);
        // console.log("Register response:", response);
        return response.data;
    } catch (err) {
        // console.error("Register error:", err);
        if (axios.isAxiosError(err)) {
            // console.error("Error response status:", err.response?.status);
            // console.error("Error response data:", err.response?.data);
            Swal.fire({
                icon: "error",
                title: "Register failed",
                text: err.response?.data?.message || err.response?.data || "An error occurred while signing up."
            });
        }
        return null;
    }
};

export const activateAccount = async (token: string): Promise<boolean> => {
    try {
        await API.post("/auth/activate", { token });

        return true;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            Swal.fire({
                icon: "error",
                title: "Activate account failed",
                text: err.response?.data?.message || "An error occurred while activating account."
            });
        }
        console.error(err);
        return false;
    }
};

export const forgotPassword = async (email: string): Promise<boolean> => {
    try {
        await API.post("/auth/forgot-password", { email });
        Swal.fire({
            icon: "success",
            title: "Password Reset",
            text: "If an account with that email exists, a reset link has been sent."
        });
        return true;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            Swal.fire({
                icon: "error",
                title: "Password Reset Failed",
                text: err.response?.data?.message || "An error occurred."
            });
        }
        console.error(err);
        return false;
    }
};
