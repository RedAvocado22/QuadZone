import API from './base'
import type { UserProfile, UpdateProfileRequest } from './types';

export const profileApi = {
    // Lấy thông tin profile
    getProfile: async (): Promise<UserProfile> => {
        const response = await API.get('/profile');
        return response.data;
    },

    // Cập nhật profile
    updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
        const response = await API.put('/profile', data);
        return response.data;
    },

    // Upload avatar
    uploadAvatar: async (file: File): Promise<UserProfile> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await API.post('/profile/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};