import API from "./base";
import type { UserResponse, CurrentUserResponse, PagedResponse } from "./types";

// Re-export for convenience
export type { UserResponse as User } from "./types";
export type { CurrentUserResponse as CurrentUser } from "./types";
export type { PagedResponse as UsersResponse } from "./types";

export const usersApi = {
  // Get current user
  getCurrentUser: async (): Promise<CurrentUserResponse | null> => {
    try {
      const response = await API.get<CurrentUserResponse>('/users/me');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      return null;
    }
  },

  // Get all users
  getAll: async (params?: { page?: number; pageSize?: number; search?: string }): Promise<PagedResponse<UserResponse>> => {
    const page = params?.page ?? 0;
    const pageSize = params?.pageSize ?? 10;
    const search = params?.search ?? '';

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: pageSize.toString(),
      search,
    });

    const response = await API.get<PagedResponse<UserResponse>>(`/users/admin?${queryParams.toString()}`);
    return response.data;
  },

  // Get user by ID
  getById: async (id: string | number): Promise<UserResponse> => {
    const response = await API.get<UserResponse>(`/users/admin/${id}`);
    return response.data;
  },

  // Create user
  create: async (user: { firstName: string; lastName: string; email: string; password: string; role: string }): Promise<UserResponse> => {
    const requestBody = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      role: user.role,
    };

    const response = await API.post<UserResponse>('/users/admin', requestBody);
    return response.data;
  },

  // Update user
  update: async (id: string | number, user: { firstName?: string; lastName?: string; email?: string; role?: string }): Promise<UserResponse> => {
    const requestBody: any = {};
    if (user.firstName !== undefined) requestBody.firstName = user.firstName;
    if (user.lastName !== undefined) requestBody.lastName = user.lastName;
    if (user.email !== undefined) requestBody.email = user.email;
    if (user.role !== undefined) requestBody.role = user.role;

    const response = await API.put<UserResponse>(`/users/${id}`, requestBody);
    return response.data;
  },

  // Delete user
  delete: async (id: string | number): Promise<void> => {
    await API.delete(`/users/${id}`);
  },
};
