import API from "./base";

// ----------------------------------------------------------------------

export const uploadApi = {
  // Upload image file
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image');

    const response = await API.post<{ url: string }>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};
