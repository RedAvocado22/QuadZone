import { Navigate, Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { useRole } from '../hooks/useRole';

// ----------------------------------------------------------------------

type GuestRouteProps = {
  children?: React.ReactNode;
  redirectTo?: string;
};

export function GuestRoute({ children, redirectTo = '/' }: GuestRouteProps) {
  const { user, loading } = useRole();

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

  // If user is logged in, redirect to home
  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  // If children provided, render them, otherwise use Outlet for nested routes
  return children ? <>{children}</> : <Outlet />;
}
