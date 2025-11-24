import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { CurrentUser } from "../api/users";
import API from "../api/base";

// ----------------------------------------------------------------------

export type UserRole = 'ADMIN' | 'STAFF' | 'CUSTOMER' | 'SHIPPER';

export interface LoginRequest {
    email: string;
    password: string;
}

interface UserContextType {
    user: CurrentUser | null;
    loading: boolean;
    error: Error | null;
    login: (payload: LoginRequest) => Promise<boolean>;
    logout: () => void;
    refreshUser: () => Promise<void>;
    // Role checking helpers
    hasRole: (role: UserRole | UserRole[]) => boolean;
    isAdmin: boolean;
    isStaff: boolean;
    isCustomer: boolean;
    isShipper: boolean;
    role: UserRole | null;
}

const UserContext = createContext<UserContextType | null>(null);

type UserProviderProps = {
    children: ReactNode;
};

const UserProvider = ({ children }: UserProviderProps) => {
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [ready, setReady] = useState(false);
    const navigate = useNavigate();

    const fetchCurrentUser = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const resp = await API.get<CurrentUser>("/users/me");
            setUser(resp.data);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to fetch current user');
            setError(error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (payload: LoginRequest): Promise<boolean> => {
        try {
            const resp = await API.post("/auth/authenticate", payload);
            const { access_token, refresh_token } = resp.data;

            if (!access_token) {
                toast.error("Login failed. No token received.");
                return false;
            }

            localStorage.setItem("access_token", access_token);
            // Store refresh token if provided
            if (refresh_token) {
                localStorage.setItem("refresh_token", refresh_token);
            }

            await fetchCurrentUser();

            toast.success("Login successful!");
            return true;
        } catch (err: any) {
            let msg = "Please check your email and password.";
            switch (err.response?.status) {
                case 401:
                    msg = "Incorrect email or password.";
                    break;
                case 404:
                    msg = "Account does not exist.";
                    break;
                case 403:
                    msg = "Account not active! Check your email for the activation link.";
                    break;
                default:
                    msg = err.response?.data?.message || msg;
            }
            toast.error(msg);
            return false;
        }
    };

    const logout = useCallback(async () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);

        try {
            await API.post("/auth/logout");
            toast.success("Logout successful!");
        } catch (err) {
            console.error("Logout error", err);
        }

        navigate("/", { replace: true });
    }, [navigate]);

    useEffect(() => {
        let isMounted = true;

        const initAuth = async () => {
            if (localStorage.getItem("access_token")) {
                await fetchCurrentUser();
            } else {
                // If no token, set loading to false immediately
                setLoading(false);
            }

            if (isMounted) {
                setReady(true);
            }
        };

        initAuth();

        return () => {
            isMounted = false;
        };
    }, [fetchCurrentUser]);

    // Role checking helpers
    const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
        if (!user) return false;
        if (Array.isArray(role)) {
            return role.includes(user.role as UserRole);
        }
        return user.role === role;
    }, [user]);

    const isAdmin = hasRole('ADMIN');
    const isStaff = hasRole(['ADMIN', 'STAFF']);
    const isCustomer = hasRole('CUSTOMER');
    const isShipper = hasRole('SHIPPER');

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        refreshUser: fetchCurrentUser,
        hasRole,
        isAdmin,
        isStaff,
        isCustomer,
        isShipper,
        role: (user?.role as UserRole) || null,
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
