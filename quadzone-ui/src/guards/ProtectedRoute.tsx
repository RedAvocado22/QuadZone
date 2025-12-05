import { Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { useRole, type UserRole } from '../hooks/useRole';

// ----------------------------------------------------------------------

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: UserRole | UserRole[];
};

export function ProtectedRoute({
  children,
  allowedRoles
}: ProtectedRouteProps) {
  const { user, loading, hasRole } = useRole();

  // Show loading while fetching user
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if user has required role
  if (allowedRoles) {
    if (!hasRole(allowedRoles)) {
      return <Navigate to="/401" replace />;
    }
  }

  return <>{children}</>;
}
