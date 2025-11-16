import API from "../../api/base";

// ----------------------------------------------------------------------

export interface Category {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  productCount: number;
  createdAt: string;
  imageUrl?: string | null;
}

export interface CategoriesResponse {
  data: Category[];
  total: number;
  page: number;
  pageSize: number;
}

// ----------------------------------------------------------------------

interface CategoryDto {
  id: number;
  name: string;
  active: boolean;
  productCount: number;
  imageUrl: string | null;
}

function mapCategoryToFrontend(dto: CategoryDto): Category {
  return {
    id: String(dto.id),
    name: dto.name,
    status: dto.active ? 'active' : 'inactive',
    productCount: dto.productCount ?? 0,
    createdAt: '',
    description: '',
    imageUrl: dto.imageUrl ?? null,
  };
}

export const categoriesApi = {
  getAll: async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<CategoriesResponse> => {
    const { page = 0, pageSize = 10, search = '' } = params;
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: pageSize.toString(),
      search,
    });
    
    const response = await API.get<{
      data: CategoryDto[];
      total: number;
      page: number;
      pageSize: number;
    }>(`/categories/admin?${queryParams.toString()}`);

    const payload = response.data;

    return {
      data: (payload.data ?? []).map(mapCategoryToFrontend),
      total: payload.total ?? 0,
      page: payload.page ?? page,
      pageSize: payload.pageSize ?? pageSize,
    };
  },

  getById: async (id: string): Promise<Category> => {
    const response = await API.get<CategoryDto>(`/categories/admin/${id}`);
    return mapCategoryToFrontend(response.data);
  },

  create: async (category: Omit<Category, 'id'>): Promise<Category> => {
    const requestBody = {
      name: category.name,
      active: category.status === 'active',
      imageUrl: category.imageUrl || '',
    };

    const response = await API.post<CategoryDto>('/categories/admin', requestBody);
    return mapCategoryToFrontend(response.data);
  },

  update: async (id: string, category: Partial<Category>): Promise<Category> => {
    const requestBody: any = {};
    if (category.name !== undefined) requestBody.name = category.name;
    if (category.status !== undefined) requestBody.active = category.status === 'active';
    if (category.imageUrl !== undefined) requestBody.imageUrl = category.imageUrl;

    const response = await API.put<CategoryDto>(`/categories/${id}`, requestBody);
    return mapCategoryToFrontend(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await API.delete(`/categories/${id}`);
  },
};
