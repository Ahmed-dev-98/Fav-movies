import { useState, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import MediaApiClient from '@/api/client';
import { mediaKeys } from '@/lib/queryKeys';
import type { Media, PaginationQuery, PaginatedResponse } from '@/types/media';

interface UseMediaOptions {
    initialQuery?: PaginationQuery;
    enabled?: boolean;
}

interface UseMediaReturn {
    media: Media[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    hasNextPage: boolean;
    isLoadingMore: boolean;
    totalCount: number;
    refetch: () => Promise<void>;
    fetchNextPage: () => Promise<void>;
    updateQuery: (newQuery: Partial<PaginationQuery>) => void;
    query: PaginationQuery;
}

export const useMedia = (options: UseMediaOptions = {}): UseMediaReturn => {
    const { initialQuery = {}, enabled = true } = options;

    // Query state
    const [query, setQuery] = useState<PaginationQuery>({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        ...initialQuery,
    });

    // Use TanStack Query's useInfiniteQuery
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        refetch,
    } = useInfiniteQuery({
        queryKey: mediaKeys.list(query),
        queryFn: async ({ pageParam = 1 }) => {
            return await MediaApiClient.getMedia({
                ...query,
                page: pageParam,
            });
        },
        getNextPageParam: (lastPage: PaginatedResponse<Media>) => {
            return lastPage.pagination.hasNextPage
                ? lastPage.pagination.currentPage + 1
                : undefined;
        },
        initialPageParam: 1,
        enabled,
    });

    // Flatten all pages into a single array
    const media = data?.pages.flatMap(page => page.data) ?? [];

    // Get total count from the first page
    const totalCount = data?.pages[0]?.pagination.totalCount ?? 0;

    // Update query and invalidate cache
    const updateQuery = useCallback((newQuery: Partial<PaginationQuery>) => {
        setQuery(prev => ({ ...prev, ...newQuery, page: 1 }));
    }, []);

    // Wrapper for fetchNextPage to match original interface
    const handleFetchNextPage = useCallback(async (): Promise<void> => {
        await fetchNextPage();
    }, [fetchNextPage]);

    // Wrapper for refetch to match original interface
    const handleRefetch = useCallback(async (): Promise<void> => {
        await refetch();
    }, [refetch]);

    return {
        media,
        isLoading,
        isError,
        error,
        hasNextPage: hasNextPage ?? false,
        isLoadingMore: isFetchingNextPage,
        totalCount,
        refetch: handleRefetch,
        fetchNextPage: handleFetchNextPage,
        updateQuery,
        query,
    };
};

