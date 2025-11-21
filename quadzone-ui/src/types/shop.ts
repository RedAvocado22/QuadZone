// Shop Product Types
import type { SubCategoryResponse } from '../api/types';

type SubCategory = SubCategoryResponse;

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  reviews?: number;
  sku?: string;
  features?: string[];
  quantity: number;
  weight: number;
  subCategory: SubCategory;
}

// Shop Category Types
export interface Subcategory {
  name: string;
  count: number;
}

export interface Category {
  name: string;
  count: number;
  subcategories: Subcategory[];
}

// Shop Filter Types
export interface Brand {
  id: string;
  name: string;
  count: number;
  hidden?: boolean;
}

export interface Color {
  id: string;
  name: string;
  count: number;
  hidden?: boolean;
}

export interface PriceRange {
  min: number;
  max: number;
}

// View Mode Types
export type ViewMode = 'grid' | 'grid-details' | 'list' | 'list-small';

// Sort Options
export type SortOption = 'default' | 'popularity' | 'rating' | 'latest' | 'price-low' | 'price-high';
