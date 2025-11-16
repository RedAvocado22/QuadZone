import { useCurrentUser } from './useCurrentUser';

export type UserRole = 'ADMIN' | 'STAFF' | 'CUSTOMER' | 'SHIPPER';

/**
 * Hook to check user role and permissions
 */
export function useRole() {
  const { user, loading } = useCurrentUser();

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  const isAdmin = hasRole('ADMIN');
  const isStaff = hasRole(['ADMIN', 'STAFF']);
  const isCustomer = hasRole('CUSTOMER');
  const isShipper = hasRole('SHIPPER');

  return {
    user,
    loading,
    hasRole,
    isAdmin,
    isStaff,
    isCustomer,
    isShipper,
    role: user?.role || null,
  };
}

