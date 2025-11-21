import API from "./base";

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    confirmPassword: string;
}

export const register = async (req: RegisterRequest) => {
    const payload = {
        firstname: req.firstName,
        lastname: req.lastName,
        email: req.email,
        password: req.password,
        confirm_password: req.confirmPassword
    };
    const response = await API.post("/auth/register", payload);
    return response.data;
};

export const activateAccount = async (token: string) => {
    const response = await API.post("/auth/activate", { token });
    return response.data;
};

export const forgotPassword = async (email: string) => {
    const response = await API.post("/auth/forgot-password", { email });
    return response.data;
};

export interface ResetPasswordRequest {
    token: string;
    password: string;
    confirmPassword: string;
}

export const resetPassword = async (req: ResetPasswordRequest) => {
    const response = await API.post("/auth/reset-password", {
        token: req.token,
        password: req.password,
        confirmPassword: req.confirmPassword
    });
    return response.data;
};
