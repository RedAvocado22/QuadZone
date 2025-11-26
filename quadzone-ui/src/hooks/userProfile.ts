import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { profileApi } from '../api/profile';
import type { UserProfile, UpdateProfileRequest } from '../api/types';
import type { AxiosError } from 'axios';

interface ErrorResponse {
    message: string;
    status?: number;
    timestamp?: string;
}

export const useProfile = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await profileApi.getProfile();
            setProfile(data);
            return data;
        } catch (err) {
            const axiosError = err as AxiosError<ErrorResponse>;
            const message = axiosError.response?.data?.message || 'Failed to load profile';
            setError(message);
            toast.error(message);
            return null;
        } finally {
            setLoading(false);
            setIsInitialLoading(false);
        }
    }, []);

    const updateProfile = async (data: UpdateProfileRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const updated = await profileApi.updateProfile(data);
            setProfile(updated);
            toast.success(' Profile updated successfully!');
            return true;
        } catch (err) {
            const axiosError = err as AxiosError<ErrorResponse>;
            const message = axiosError.response?.data?.message || 'Failed to update profile';
            setError(message);
            toast.error(` ${message}`);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const uploadAvatar = async (file: File): Promise<boolean> => {
        // Validate file size (5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error(' File size exceeds maximum limit of 5MB');
            return false;
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error(' Only JPG, PNG, GIF, WebP files are supported');
            return false;
        }

        setLoading(true);
        setError(null);
        try {
            const updated = await profileApi.uploadAvatar(file);
            setProfile(updated);
            toast.success(' Avatar updated successfully!');
            return true;
        } catch (err) {
            const axiosError = err as AxiosError<ErrorResponse>;
            const message = axiosError.response?.data?.message || 'Failed to upload avatar';
            setError(message);
            toast.error(` ${message}`);
            return false;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return {
        profile,
        loading,
        error,
        isInitialLoading,
        updateProfile,
        uploadAvatar,
        refetchProfile: fetchProfile,
    };
};