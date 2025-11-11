import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import type { UserRole } from "../types/User";

interface ProtectedRouteProps {
    roles?: UserRole[];
}

export default function ProtectedRoute({ roles }: ProtectedRouteProps) {
    const { user } = useUser();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }
    return <Outlet />;
}
