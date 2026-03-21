import { useQuery } from '@tanstack/react-query';

import { apiClient } from './client';

export interface Category {
  id: string;
  nameHr: string;
  nameRu: string;
  nameUk: string;
  nameEn: string;
  sortOrder: number;
  isActive: boolean;
}

export interface WordSet {
  id: string;
  categoryId: string;
  nameHr: string;
  nameRu: string;
  nameUk: string;
  nameEn: string;
  sortOrder: number;
  isActive: boolean;
  wordCount: number;
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await apiClient.get('/content/categories');
      return data;
    },
  });
}

export function useWordSets(categoryId: string) {
  return useQuery<WordSet[]>({
    queryKey: ['word-sets', categoryId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/content/categories/${categoryId}/word-sets`);
      return data;
    },
    enabled: !!categoryId,
  });
}
