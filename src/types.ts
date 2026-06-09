// src/types.ts

export interface Promotion {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  imageStoragePath?: string;
  date: string; // ISO string
  active: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  order?: number;
}

export interface PromotionFormData {
  title: string;
  description?: string;
  date: string;
  active: boolean;
  imageFile?: File | null;
  imageUrl?: string;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface PromotionsState {
  promotions: Promotion[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

export interface UploadProgress {
  progress: number;
  isUploading: boolean;
  error: string | null;
}

export type FilterStatus = 'all' | 'active' | 'inactive';
export type SortOrder = 'newest' | 'oldest';
