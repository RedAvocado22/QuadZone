import apiClient from './axios';
import { USE_MOCK_DATA } from './config';
import { mockUsers, filterUsers, delay } from '../_mock/mock-data';

// ----------------------------------------------------------------------

interface AdminUserDto {
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

// ----------------------------------------------------------------------

function mapAdminUserToFrontend(user: AdminUserDto): User {
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: '',
    isVerified: true,
    status: 'active',
    createdAt: user.createdAt,
  };
}

// ----------------------------------------------------------------------

export const usersApi = {
  // Get all users
  getAll: async (params?: { page?: number; pageSize?: number; search?: string }): Promise<UsersResponse> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return filterUsers(mockUsers, params);
    }

    const page = params?.page ?? 0;
    const pageSize = params?.pageSize ?? 10;
    const search = params?.search ?? '';

    const response = await apiClient.get('/admin/users', {
      params: { page, size: pageSize, search },
    });

    const payload = response.data as {
      data: AdminUserDto[];
      total: number;
      page: number;
      pageSize: number;
    };

    return {
      data: (payload.data ?? []).map(mapAdminUserToFrontend),
      total: payload.total ?? 0,
      page: payload.page ?? page,
      pageSize: payload.pageSize ?? pageSize,
    };
  },

  // Get user by ID
  getById: async (id: string): Promise<User> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      const user = mockUsers.find((u) => u.id === id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    }
    const response = await apiClient.get(`/admin/users/${id}`);
    const data = response.data as AdminUserDto;
    return mapAdminUserToFrontend(data);
  },

  // Create user
  create: async (user: Omit<User, 'id'>): Promise<User> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const newUser: User = {
        ...user,
        id: `user-${Date.now()}`,
      };
      mockUsers.unshift(newUser);
      return newUser;
    }
    throw new Error('User creation API is not implemented yet');
  },

  // Update user
  update: async (id: string, user: Partial<User>): Promise<User> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const index = mockUsers.findIndex((u) => u.id === id);
      if (index === -1) {
        throw new Error('User not found');
      }
      mockUsers[index] = { ...mockUsers[index], ...user };
      return mockUsers[index];
    }
    throw new Error('User update API is not implemented yet');
  },

  // Delete user
  delete: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      const index = mockUsers.findIndex((u) => u.id === id);
      if (index === -1) {
        throw new Error('User not found');
      }
      mockUsers.splice(index, 1);
      return;
    }
    throw new Error('User delete API is not implemented yet');
  },
};

