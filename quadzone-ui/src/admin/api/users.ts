import apiClient from './axios';
import { USE_MOCK_DATA } from './config';
import { mockUsers, filterUsers, delay } from '../_mock/mock-data';

// ----------------------------------------------------------------------

// Backend User entity structure
interface BackendUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'STAFF' | 'CUSTOMER' | 'SHIPPER';
  createdAt?: string;
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
}

export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
}

// ----------------------------------------------------------------------

// Map backend user to frontend user format
function mapBackendUserToFrontend(backendUser: BackendUser): User {
  return {
    id: String(backendUser.id),
    name: `${backendUser.firstName} ${backendUser.lastName}`,
    email: backendUser.email,
    role: backendUser.role,
    avatarUrl: '', // Default value - not in backend
    isVerified: true, // Default value - not in backend
    status: 'active', // Default value - not in backend
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
    
    const response = await apiClient.get('/user/admin/get', { params });
    const data = response.data;
    
    let users: BackendUser[] = [];
    
    // Handle different response formats
    // If response is directly an array
    if (Array.isArray(data)) {
      users = data;
    }
    // If response is an object with data property
    else if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
      users = data.data;
    }
    
    // Map backend users to frontend format
    const mappedUsers: User[] = users.map(mapBackendUserToFrontend);
    
    // Apply search filter if provided (client-side filtering)
    let filteredUsers = mappedUsers;
    if (params?.search && params.search.trim() !== '') {
      const searchLower = params.search.toLowerCase();
      filteredUsers = mappedUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.role?.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply pagination (client-side)
    const page = params?.page || 0;
    const pageSize = params?.pageSize || 10;
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    return {
      data: paginatedUsers,
      total: filteredUsers.length,
      page,
      pageSize,
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
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
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
    const response = await apiClient.post('/users', user);
    return response.data;
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
    const response = await apiClient.put(`/users/${id}`, user);
    return response.data;
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
    await apiClient.delete(`/users/${id}`);
  },
};

