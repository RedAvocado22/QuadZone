import API from "./base";

// ----------------------------------------------------------------------

export interface UploadResponse {
  id: number;
  fileName: string;
  imageUrl: string;
  thumbnailUrl: string;
  description?: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export interface UploadListResponse {
  data: UploadResponse[];
  total: number;
  page: number;
  pageSize: number;
}

export const uploadApi = {
  // Upload image file (Admin only)
  uploadImage: async (file: File, description?: string): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    if (description) {
      formData.append('description', description);
    }

    const response = await API.post<UploadResponse>('/admin/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Get all uploaded images (Admin only)
  getAllUploads: async (page: number = 0, size: number = 10, search: string = ''): Promise<UploadListResponse> => {
    const response = await API.get<UploadListResponse>('/admin/upload', {
      params: { page, size, search },
    });
    return response.data;
  },

  // Get upload by ID (Admin only)
  getUploadById: async (id: number): Promise<UploadResponse> => {
    const response = await API.get<UploadResponse>(`/admin/upload/${id}`);
    return response.data;
  },

  // Update upload metadata (Admin only)
  updateUpload: async (id: number, description: string): Promise<UploadResponse> => {
    const response = await API.put<UploadResponse>(`/admin/upload/${id}`, {
      description,
    });
    return response.data;
  },

  // Delete upload (Admin only)
  deleteUpload: async (id: number): Promise<void> => {
    await API.delete(`/admin/upload/${id}`);
  },
};
