import apiClient from './axios';
import { USE_MOCK_DATA } from './config';
import { delay } from '../_mock/mock-data';

// ----------------------------------------------------------------------

export const uploadApi = {
  // Upload image file
  uploadImage: async (file: File): Promise<{ url: string }> => {
    if (USE_MOCK_DATA) {
      // Simulate upload delay
      await delay(1000);
      
      // Create a mock URL using FileReader to create data URL
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // In real implementation, this would be a server URL
          // For mock, we return a data URL
          resolve({
            url: reader.result as string,
          });
        };
        reader.readAsDataURL(file);
      });
    }

    // Real API call
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image');

    const response = await apiClient.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};

