import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/User";
import API from "../api/base";

export interface LoginRequest {
    email: string;
    password: string;
}

interface UserContextType {
    user: User | null;
    login: (payload: LoginRequest) => Promise<boolean>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

type UserProviderProps = {
    children: ReactNode;
};

const UserProvider = ({ children }: UserProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [ready, setReady] = useState(false);
    const navigate = useNavigate();

    const fetchCurrentUser = async () => {
        try {
            const resp = await API.get("/users/me");
            setUser(resp.data);
        } catch {
            setUser(null);
            localStorage.removeItem("access_token");
        }
    };

    const login = async (payload: LoginRequest): Promise<boolean> => {
        try {
            const resp = await API.post("/auth/authenticate", payload);
            if (resp.status === 202) {
                toast.warn("Your account is un-activated. Check your email.");
                return false;
            }

            const token = resp.data.access_token;
            if (!token) {
                toast.error("Login failed. No token received from server.");
                return false;
            }

            localStorage.setItem("access_token", token);
            await fetchCurrentUser();
            toast.success("Login successful!");
            return true;
        } catch (err) {
            let msg = "Please check your email and password.";
            if (isAxiosError(err)) {
                switch (err.response?.status) {
                    case 401: // Unauthorized
                        msg = "Incorrect email or password.";
                        break;
                    case 404: // Not Found
                        msg = "Account does not exist.";
                        break;
                    default:
                        msg = err.response?.data?.message || msg;
                }
            } else {
                console.error((err as Error).message);
            }
            toast.error(msg);
            return false;
        }
    };

    const logout = async () => {
        localStorage.removeItem("access_token");
        setUser(null);
        toast.success("Logout successful!");
        navigate("/", { replace: true });

        API.get("/auth/logout").catch((err: unknown) => {
            console.error("Server logout failed, but user is logged out locally:", err);
        });
    };

    useEffect(() => {
        const checkAuthStatus = async () => {
            const accessToken = localStorage.getItem("access_token");

            if (!accessToken) {
                setUser(null);
                setReady(true);
                return;
            }

            try {
                const resp = await API.get("/users/me");
                setUser(resp.data);
                setReady(true);
            } catch {
                setUser(null);
                setReady(true);
                localStorage.removeItem("access_token");
            }
        };

        checkAuthStatus();
    }, []);

    const value = {
        user,
        login,
        logout,
        refreshUser: fetchCurrentUser
    };

    return <UserContext.Provider value={value}>{ready ? children : null}</UserContext.Provider>;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

export default UserProvider;
