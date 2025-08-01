import type { PaginationQuery } from '@/types/media';

export const mediaKeys = {
    all: ['media'] as const,
    lists: () => [...mediaKeys.all, 'list'] as const,
    list: (filters: PaginationQuery) => [...mediaKeys.lists(), filters] as const,
    details: () => [...mediaKeys.all, 'detail'] as const,
    detail: (id: number) => [...mediaKeys.details(), id] as const,
    stats: () => [...mediaKeys.all, 'stats'] as const,
} as const;