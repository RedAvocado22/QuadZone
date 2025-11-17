import API from "./base";

// ----------------------------------------------------------------------

interface UserDto {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

// Frontend User interface
export interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  role?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  status?: 'active' | 'banned';
  createdAt?: string;
}

export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
}

// Current User interface (from /users/me endpoint)
export interface CurrentUser {
  firstname: string;
  lastname: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'STAFF' | 'CUSTOMER' | 'SHIPPER';
  createdAt: string;
}

// ----------------------------------------------------------------------

function mapUserToFrontend(dto: UserDto): User {
  return {
    id: String(dto.id),
    name: dto.name,
    email: dto.email,
    role: dto.role,
    avatarUrl: '',
    isVerified: true,
    status: 'active',
    createdAt: dto.createdAt,
  };
}

export const usersApi = {
  // Get current user
  getCurrentUser: async (): Promise<CurrentUser | null> => {
    try {
      const response = await API.get<CurrentUser>('/users/me');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      return null;
    }
  },

  // Get all users
  getAll: async (params?: { page?: number; pageSize?: number; search?: string }): Promise<UsersResponse> => {
    const page = params?.page ?? 0;
    const pageSize = params?.pageSize ?? 10;
    const search = params?.search ?? '';

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: pageSize.toString(),
      search,
    });

    const response = await API.get<{
      data: UserDto[];
      total: number;
      page: number;
      pageSize: number;
    }>(`/users/admin?${queryParams.toString()}`);

    const payload = response.data;

    return {
      data: (payload.data ?? []).map(mapUserToFrontend),
      total: payload.total ?? 0,
      page: payload.page ?? page,
      pageSize: payload.pageSize ?? pageSize,
    };
  },

  // Get user by ID
  getById: async (id: string): Promise<User> => {
    const response = await API.get<UserDto>(`/users/admin/${id}`);
    return mapUserToFrontend(response.data);
  },

  // Create user
  create: async (user: Omit<User, 'id'>): Promise<User> => {
    // Split name into firstName and lastName
    const nameParts = (user.name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    const requestBody = {
      firstName,
      lastName,
      email: user.email,
      password: 'defaultPassword123', // This should come from the form
      role: user.role || 'USER',
    };

    const response = await API.post<UserDto>('/users/admin', requestBody);
    return mapUserToFrontend(response.data);
  },

  // Update user
  update: async (id: string, user: Partial<User>): Promise<User> => {
    const requestBody: any = {};
    if (user.name !== undefined) {
      const nameParts = user.name.split(' ');
      requestBody.firstName = nameParts[0] || '';
      requestBody.lastName = nameParts.slice(1).join(' ') || '';
    }
    if (user.email !== undefined) requestBody.email = user.email;
    if (user.role !== undefined) requestBody.role = user.role;

    const response = await API.put<UserDto>(`/users/${id}`, requestBody);
    return mapUserToFrontend(response.data);
  },

  // Delete user
  delete: async (id: string): Promise<void> => {
    await API.delete(`/users/${id}`);
  },
};
