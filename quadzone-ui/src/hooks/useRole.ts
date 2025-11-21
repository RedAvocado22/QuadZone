import { useUser, type UserRole } from './useUser';

/**
 * Hook to check user role and permissions
 * This is a convenience hook that wraps useUser and provides role-related functionality.
 * You can also use useUser directly which includes all role checking methods.
 */
export function useRole() {
  const { user, loading, hasRole, isAdmin, isStaff, isCustomer, isShipper, role } = useUser();

  return {
    user,
    loading,
    hasRole,
    isAdmin,
    isStaff,
    isCustomer,
    isShipper,
    role,
  };
}

// Re-export UserRole type for convenience
export type { UserRole };
