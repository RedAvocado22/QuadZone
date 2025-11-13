import { _id, _times, _fullName, _postTitles, _description } from './_mock';
import type { Product, ProductsResponse } from '../api/products';
import type { Post, PostsResponse } from '../api/posts';
import type { User, UsersResponse } from '../api/users';
import type { Order, OrdersResponse } from '../api/orders';
import type { Category, CategoriesResponse } from '../api/categories';
import type { Notification } from '../api/notifications';

// ----------------------------------------------------------------------
// Mock Products Data
// ----------------------------------------------------------------------

export const mockProducts: Product[] = Array.from({ length: 50 }, (_, index) => ({
  id: _id(index),
  name: [
    'Nike Air Max 270',
    'Adidas Ultraboost 22',
    'Puma RS-X',
    'New Balance 990',
    'Converse Chuck Taylor',
    'Vans Old Skool',
    'Jordan 1 Retro',
    'Yeezy Boost 350',
    'Nike Dunk Low',
    'Adidas Stan Smith',
    'Nike Air Force 1',
    'Puma Suede Classic',
    'New Balance 550',
    'Converse One Star',
    'Vans Authentic',
    'Jordan 4 Retro',
    'Yeezy Slide',
    'Nike Blazer',
    'Adidas Superstar',
    'Puma Thunder',
    'Nike Cortez',
    'Adidas Gazelle',
    'New Balance 327',
    'Converse Jack Purcell',
    'Vans Sk8-Hi',
    'Jordan 5 Retro',
    'Yeezy 700',
    'Nike Air Max 90',
    'Adidas Samba',
    'Puma Speedcat',
    'Nike Roshe Run',
    'Adidas NMD',
    'New Balance 997',
    'Converse All Star',
    'Vans Era',
    'Jordan 11 Retro',
    'Yeezy 500',
    'Nike Air Max 97',
    'Adidas Originals',
    'Puma Cali',
    'Nike React',
    'Adidas ZX',
    'New Balance 574',
    'Converse Pro Leather',
    'Vans Slip-On',
    'Jordan 3 Retro',
    'Yeezy Foam Runner',
    'Nike Air Max 1',
    'Adidas Campus',
    'Puma Roma',
  ][index % 50],
  price: Math.floor(Math.random() * 300) + 50,
  priceSale: Math.random() > 0.5 ? Math.floor(Math.random() * 200) + 30 : null,
  coverUrl: `/assets/images/product/product-${(index % 24) + 1}.webp`,
  colors: [
    ['#00AB55', '#000000'],
    ['#FF4842', '#FFFFFF'],
    ['#1890FF', '#000000'],
    ['#FFC107', '#FF4842'],
    ['#94D82D', '#00AB55'],
    ['#000000', '#FFFFFF'],
    ['#FFC0CB', '#1890FF'],
  ][index % 7],
  status: (['sale', 'new', ''] as const)[Math.floor(Math.random() * 3)],
  description: _description(index % 24),
}));

// ----------------------------------------------------------------------
// Mock Posts Data
// ----------------------------------------------------------------------

export const mockPosts: Post[] = Array.from({ length: 23 }, (_, index) => ({
  id: _id(index),
  title: _postTitles(index),
  description: _description(index),
  coverUrl: `/assets/images/cover/cover-${index + 1}.webp`,
  totalViews: Math.floor(Math.random() * 10000) + 1000,
  totalComments: Math.floor(Math.random() * 1000) + 100,
  totalShares: Math.floor(Math.random() * 500) + 50,
  totalFavorites: Math.floor(Math.random() * 500) + 50,
  postedAt: _times(index),
  author: {
    name: _fullName(index),
    avatarUrl: `/assets/images/avatar/avatar-${(index % 24) + 1}.webp`,
  },
}));

// ----------------------------------------------------------------------
// Mock Users Data
// ----------------------------------------------------------------------

export const mockUsers: User[] = Array.from({ length: 30 }, (_, index) => ({
  id: _id(index),
  name: _fullName(index % 24),
  email: `user${index + 1}@example.com`,
  role: (['ADMIN', 'STAFF', 'CUSTOMER', 'SHIPPER'] as const)[index % 4],
  avatarUrl: `/assets/images/avatar/avatar-${(index % 24) + 1}.webp`,
  isVerified: Math.random() > 0.3,
  status: (['active', 'banned'] as const)[Math.random() > 0.9 ? 1 : 0],
}));

// ----------------------------------------------------------------------
// Mock Orders Data
// ----------------------------------------------------------------------

const orderStatuses: Order['status'][] = ['pending', 'processing', 'completed', 'cancelled'];
const paymentStatuses: Order['paymentStatus'][] = ['pending', 'paid', 'failed'];

export const mockOrders: Order[] = Array.from({ length: 40 }, (_, index) => ({
  id: _id(index),
  orderNumber: `ORD-${String(index + 1).padStart(6, '0')}`,
  customerName: _fullName(index % 24),
  total: Math.floor(Math.random() * 1000) + 50,
  status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
  paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
  createdAt: _times(index % 24),
  items: Math.floor(Math.random() * 10) + 1,
}));

// ----------------------------------------------------------------------
// Mock Categories Data
// ----------------------------------------------------------------------

export const mockCategories: Category[] = [
  {
    id: _id(0),
    name: 'Shoes',
    description: 'Footwear for all occasions',
    status: 'active',
    productCount: 25,
    createdAt: '2024-01-01',
  },
  {
    id: _id(1),
    name: 'Apparel',
    description: 'Clothing and accessories',
    status: 'active',
    productCount: 18,
    createdAt: '2024-01-02',
  },
  {
    id: _id(2),
    name: 'Accessories',
    description: 'Fashion accessories',
    status: 'active',
    productCount: 12,
    createdAt: '2024-01-03',
  },
  {
    id: _id(3),
    name: 'Electronics',
    description: 'Electronic devices and gadgets',
    status: 'active',
    productCount: 8,
    createdAt: '2024-01-04',
  },
  {
    id: _id(4),
    name: 'Home & Living',
    description: 'Home decor and furniture',
    status: 'active',
    productCount: 15,
    createdAt: '2024-01-05',
  },
  {
    id: _id(5),
    name: 'Sports',
    description: 'Sports equipment and gear',
    status: 'active',
    productCount: 10,
    createdAt: '2024-01-06',
  },
  {
    id: _id(6),
    name: 'Books',
    description: 'Books and publications',
    status: 'inactive',
    productCount: 5,
    createdAt: '2024-01-07',
  },
];

// ----------------------------------------------------------------------
// Mock Notifications Data
// ----------------------------------------------------------------------

export const mockNotifications: Notification[] = Array.from({ length: 15 }, (_, index) => ({
  id: _id(index),
  type: ['order', 'payment', 'system', 'user'][index % 4],
  title: [
    'New order received',
    'Payment successful',
    'System update',
    'New user registered',
    'Order shipped',
    'Payment failed',
    'Maintenance scheduled',
    'User profile updated',
    'Order cancelled',
    'Payment pending',
    'System backup completed',
    'New message received',
    'Order delivered',
    'Refund processed',
    'Account verified',
  ][index],
  description: _description(index % 24),
  avatarUrl: index % 3 === 0 ? `/assets/images/avatar/avatar-${(index % 24) + 1}.webp` : null,
  postedAt: _times(index % 24),
  isUnRead: index < 5,
}));

// ----------------------------------------------------------------------
// Mock Data Helper Functions
// ----------------------------------------------------------------------

// Simulate API delay
const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Filter products based on params
export const filterProducts = (
  products: Product[],
  params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    category?: string;
    price?: string;
    gender?: string[];
    colors?: string[];
    rating?: string;
  }
): ProductsResponse => {
  let filtered = [...products];

  // Search filter
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchLower));
  }

  // Category filter (mock - just return all if category is provided)
  if (params?.category && params.category !== 'all') {
    // In real implementation, filter by category
    // For mock, we'll just return all products
  }

  // Price filter
  if (params?.price) {
    switch (params.price) {
      case 'below':
        filtered = filtered.filter((p) => p.priceSale || p.price < 25);
        break;
      case 'between':
        filtered = filtered.filter((p) => {
          const price = p.priceSale || p.price;
          return price >= 25 && price <= 75;
        });
        break;
      case 'above':
        filtered = filtered.filter((p) => (p.priceSale || p.price) > 75);
        break;
    }
  }

  // Color filter
  if (params?.colors && params.colors.length > 0) {
    filtered = filtered.filter((p) =>
      p.colors?.some((color) => params.colors?.includes(color))
    );
  }

  // Pagination
  const page = params?.page || 0;
  const pageSize = params?.pageSize || 12;
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const paginated = filtered.slice(startIndex, endIndex);

  return {
    data: paginated,
    total: filtered.length,
    page,
    pageSize,
  };
};

// Filter posts based on params
export const filterPosts = (
  posts: Post[],
  params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: 'latest' | 'popular' | 'oldest';
  }
): PostsResponse => {
  let filtered = [...posts];

  // Search filter
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
    );
  }

  // Sort
  if (params?.sortBy) {
    switch (params.sortBy) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0));
        break;
    }
  }

  // Pagination
  const page = params?.page || 0;
  const pageSize = params?.pageSize || 10;
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const paginated = filtered.slice(startIndex, endIndex);

  return {
    data: paginated,
    total: filtered.length,
    page,
    pageSize,
  };
};

// Filter users based on params
export const filterUsers = (
  users: User[],
  params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }
): UsersResponse => {
  let filtered = [...users];

  // Search filter
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower) ||
        u.role?.toLowerCase().includes(searchLower)
    );
  }

  // Pagination
  const page = params?.page || 0;
  const pageSize = params?.pageSize || 10;
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const paginated = filtered.slice(startIndex, endIndex);

  return {
    data: paginated,
    total: filtered.length,
    page,
    pageSize,
  };
};

// Filter orders based on params
export const filterOrders = (
  orders: Order[],
  params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
): OrdersResponse => {
  let filtered = [...orders];

  // Search filter
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(searchLower) ||
        o.customerName.toLowerCase().includes(searchLower)
    );
  }

  // Sort
  if (params?.sortBy) {
    const sortOrder = params.sortOrder || 'desc';
    filtered.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (params.sortBy) {
        case 'createdAt':
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        case 'total':
          aVal = a.total;
          bVal = b.total;
          break;
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
  }

  // Pagination
  const page = params?.page || 0;
  const pageSize = params?.pageSize || 10;
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const paginated = filtered.slice(startIndex, endIndex);

  return {
    data: paginated,
    total: filtered.length,
    page,
    pageSize,
  };
};

// Filter categories based on params
export const filterCategories = (
  categories: Category[],
  params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
): CategoriesResponse => {
  let filtered = [...categories];

  // Search filter
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(searchLower) ||
        c.description?.toLowerCase().includes(searchLower)
    );
  }

  // Sort
  if (params?.sortBy) {
    const sortOrder = params.sortOrder || 'asc';
    filtered.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (params.sortBy) {
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        case 'productCount':
          aVal = a.productCount;
          bVal = b.productCount;
          break;
        case 'createdAt':
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
  }

  // Pagination
  const page = params?.page || 0;
  const pageSize = params?.pageSize || 10;
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const paginated = filtered.slice(startIndex, endIndex);

  return {
    data: paginated,
    total: filtered.length,
    page,
    pageSize,
  };
};

// Export delay function for use in mock APIs
export { delay };

