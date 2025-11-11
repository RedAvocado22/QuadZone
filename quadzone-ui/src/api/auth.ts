import axios from "axios";
import Swal from "sweetalert2";
import API from "./base";

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export const register = async (req: RegisterRequest): Promise<boolean> => {
    try {
        console.log("Sending register request:", req);
        const response = await API.post("/auth/register", req);
        console.log("Register response:", response);
        return true;
    } catch (err) {
        console.error("Register error:", err);
        if (axios.isAxiosError(err)) {
            console.error("Error response status:", err.response?.status);
            console.error("Error response data:", err.response?.data);
            Swal.fire({
                icon: "error",
                title: "Register failed",
                text: err.response?.data?.message || "An error occurred while signing up."
            });
        }
        return false;
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
