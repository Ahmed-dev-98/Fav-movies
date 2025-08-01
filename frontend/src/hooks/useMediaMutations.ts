import { useMutation, useQueryClient } from '@tanstack/react-query';
import MediaApiClient from '@/api/client';
import { mediaKeys } from '@/lib/queryKeys';
import type { Media, CreateMediaInput, UpdateMediaInput } from '@/types/media';
// error.response.data.error.validationErrors[0].message
interface prismaError {
    response: {
        data: {
            error: {
                validationErrors: { message: string }[]
            }
        }
    }
}
interface UseMediaMutationsOptions {

    onCreateSuccess?: (data: Media) => void;
    onUpdateSuccess?: (data: Media) => void;
    onDeleteSuccess?: (id: number) => void;
    onError?: (error: prismaError, action: 'create' | 'update' | 'delete') => void;
}

export const useMediaMutations = (options: UseMediaMutationsOptions = {}) => {
    const queryClient = useQueryClient();
    const { onCreateSuccess, onUpdateSuccess, onDeleteSuccess, onError } = options;

    // Create media mutation
    const createMediaMutation = useMutation({
        mutationFn: (data: CreateMediaInput) => MediaApiClient.createMedia(data),
        onSuccess: (data) => {
            // Invalidate and refetch media lists
            queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
            onCreateSuccess?.(data);
        },
        onError: (error: prismaError) => {
            onError?.(error, 'create');
        },
    });

    // Update media mutation
    const updateMediaMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateMediaInput }) =>
            MediaApiClient.updateMedia(id, data),
        onSuccess: (data) => {
            // Invalidate and refetch media lists and the specific item
            queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
            queryClient.invalidateQueries({ queryKey: mediaKeys.detail(data.id) });
            onUpdateSuccess?.(data);
        },
        onError: (error: prismaError) => {
            onError?.(error, 'update');
        },
    });

    // Delete media mutation
    const deleteMediaMutation = useMutation({
        mutationFn: (id: number) => MediaApiClient.deleteMedia(id),
        onSuccess: (_, id) => {
            // Remove from cache and invalidate lists
            queryClient.removeQueries({ queryKey: mediaKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
            onDeleteSuccess?.(id);
        },
        onError: (error: prismaError) => {
            onError?.(error, 'delete');
        },
    });

    return {
        createMedia: {
            mutate: createMediaMutation.mutate,
            mutateAsync: createMediaMutation.mutateAsync,
            isPending: createMediaMutation.isPending,
            isError: createMediaMutation.isError,
            error: createMediaMutation.error,
            data: createMediaMutation.data,
            reset: createMediaMutation.reset,
        },
        updateMedia: {
            mutate: (id: number, data: UpdateMediaInput) =>
                updateMediaMutation.mutate({ id, data }),
            mutateAsync: (id: number, data: UpdateMediaInput) =>
                updateMediaMutation.mutateAsync({ id, data }),
            isPending: updateMediaMutation.isPending,
            isError: updateMediaMutation.isError,
            error: updateMediaMutation.error,
            data: updateMediaMutation.data,
            reset: updateMediaMutation.reset,
        },
        deleteMedia: {
            mutate: deleteMediaMutation.mutate,
            mutateAsync: deleteMediaMutation.mutateAsync,
            isPending: deleteMediaMutation.isPending,
            isError: deleteMediaMutation.isError,
            error: deleteMediaMutation.error,
            data: deleteMediaMutation.data,
            reset: deleteMediaMutation.reset,
        },
    };
};