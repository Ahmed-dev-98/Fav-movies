import { Media } from '@prisma/client';

// Base media types as string unions (SQLite doesn't support enums)
export type MediaTypeEnum = 'MOVIE' | 'TV_SHOW';
export type GenreEnum =
    | 'ACTION'
    | 'ADVENTURE'
    | 'ANIMATION'
    | 'BIOGRAPHY'
    | 'COMEDY'
    | 'CRIME'
    | 'DOCUMENTARY'
    | 'DRAMA'
    | 'FAMILY'
    | 'FANTASY'
    | 'HISTORY'
    | 'HORROR'
    | 'MUSIC'
    | 'MYSTERY'
    | 'ROMANCE'
    | 'SCIENCE_FICTION'
    | 'THRILLER'
    | 'WAR'
    | 'WESTERN'
    | 'OTHER';

// API Response types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: {
        message: string;
        statusCode: number;
        validationErrors?: ValidationError[];
        stack?: string;
    };
}

export interface ValidationError {
    field: string;
    message: string;
    code: string;
}

export interface ErrorResponse {
    success: false;
    error: {
        message: string;
        statusCode: number;
        validationErrors?: ValidationError[];
        stack?: string;
    };
}

// Pagination types
export interface PaginationQuery {
    page: number;
    limit: number;
    search?: string;
    type?: MediaTypeEnum;
    genre?: GenreEnum;
    year?: number;
    sortBy: 'title' | 'year' | 'rating' | 'createdAt' | 'updatedAt';
    sortOrder: 'asc' | 'desc';
}

export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    limit: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationMeta;
}

// Media CRUD types
export interface CreateMediaInput {
    title: string;
    type: MediaTypeEnum;
    director?: string | null;
    budget?: number | null;
    location?: string | null;
    duration?: number | null;
    year?: number | null;
    genre?: GenreEnum | null;
    rating?: number | null;
    description?: string | null;
    language?: string | null;
    posterUrl?: string | null;
}

export interface UpdateMediaInput {
    title?: string;
    type?: MediaTypeEnum;
    director?: string | null;
    budget?: number | null;
    location?: string | null;
    duration?: number | null;
    year?: number | null;
    genre?: GenreEnum | null;
    rating?: number | null;
    description?: string | null;
    language?: string | null;
    posterUrl?: string | null;
}

// Statistics types
export interface MediaStats {
    totalCount: number;
    movieCount: number;
    tvShowCount: number;
    genreDistribution: GenreDistribution[];
    recentlyAdded: RecentMedia[];
}

export interface GenreDistribution {
    genre: string | null;  // Changed to string to match database schema
    _count: number;
}

export interface RecentMedia {
    id: number;
    title: string;
    type: string;  // Changed to string to match database schema
    year: number | null;
    createdAt: Date;
}

// Export Prisma Media type
export type { Media } from '@prisma/client';