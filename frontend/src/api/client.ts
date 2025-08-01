import axios, { type AxiosResponse } from 'axios';
import type {
    Media,
    CreateMediaInput,
    UpdateMediaInput,
    ApiResponse,
    PaginatedResponse,
    PaginationQuery,
    MediaStats
} from '@/types/media';
import { EAPI } from '@/constants/EAPI';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for logging
api.interceptors.request.use(
    (config) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('❌ API Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// API Client class
export class MediaApiClient {
    // Get all media with pagination and filtering
    static async getMedia(params: PaginationQuery = {}): Promise<PaginatedResponse<Media>> {
        const response: AxiosResponse<ApiResponse<PaginatedResponse<Media>>> = await api.get(EAPI.MEDIA.GET, {
            params: {
                page: params.page || 1,
                limit: params.limit || 10,
                ...(params.search && { search: params.search }),
                ...(params.type && { type: params.type }),
                ...(params.genre && { genre: params.genre }),
                ...(params.year && { year: params.year }),
                ...(params.sortBy && { sortBy: params.sortBy }),
                ...(params.sortOrder && { sortOrder: params.sortOrder }),
            },
        });

        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.error?.message || 'Failed to fetch media');
        }

        return response.data.data;
    }

    // Get single media by ID
    static async getMediaById(id: number): Promise<Media> {
        const response: AxiosResponse<ApiResponse<Media>> = await api.get(EAPI.MEDIA.GET_BY_ID.replace(':id', id.toString()));

        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.error?.message || 'Failed to fetch media');
        }

        return response.data.data;
    }

    // Create new media
    static async createMedia(data: CreateMediaInput): Promise<Media> {
        const response: AxiosResponse<ApiResponse<Media>> = await api.post(EAPI.MEDIA.CREATE, data);

        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.error?.message || 'Failed to create media');
        }

        return response.data.data;
    }

    // Update existing media
    static async updateMedia(id: number, data: UpdateMediaInput): Promise<Media> {
        const response: AxiosResponse<ApiResponse<Media>> = await api.put(EAPI.MEDIA.UPDATE.replace(':id', id.toString()), data);

        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.error?.message || 'Failed to update media');
        }

        return response.data.data;
    }

    // Delete media
    static async deleteMedia(id: number): Promise<void> {
        const response: AxiosResponse<ApiResponse<{ id: number }>> = await api.delete(EAPI.MEDIA.DELETE.replace(':id', id.toString()));

        if (!response.data.success) {
            throw new Error(response.data.error?.message || 'Failed to delete media');
        }
    }

    // Get statistics
    static async getStats(): Promise<MediaStats> {
        const response: AxiosResponse<ApiResponse<MediaStats>> = await api.get(EAPI.MEDIA.STATS);

        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.error?.message || 'Failed to fetch statistics');
        }

        return response.data.data;
    }

    // Health check
    static async healthCheck(): Promise<{ status: string; timestamp: string; environment: string }> {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/health`
        );
        return response.data;
    }
}

export default MediaApiClient;