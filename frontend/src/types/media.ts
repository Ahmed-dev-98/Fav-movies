/* eslint-disable @typescript-eslint/no-explicit-any */
// Enum types matching backend
export type MediaType = 'MOVIE' | 'TV_SHOW';

export type Genre =
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

// Media interface matching backend Prisma model
export interface Media {
    budget: number;
    createdAt: string;
    description: string;
    director: string;
    duration: number;
    genre: Genre;
    id: number;
    language: string;
    location: string;
    posterUrl: string | null;
    rating: number;
    title: string;
    type: MediaType;
    updatedAt: string;
    year: number;
}

// Form types for creating/updating media
export interface CreateMediaInput {
    title: string;
    type: MediaType;
    director?: string;
    budget?: number;
    location?: string;
    duration?: number;
    year?: number;
    genre?: Genre;
    rating?: number;
    description?: string;
    language?: string;
    posterUrl?: string;
}

export interface UpdateMediaInput {
    title?: string;
    type?: MediaType;
    director?: string;
    budget?: number;
    location?: string;
    duration?: number;
    year?: number;
    genre?: Genre;
    rating?: number;
    description?: string;
    language?: string;
    posterUrl?: string;
}

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

// Pagination types
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

export interface PaginationQuery {
    page?: number;
    limit?: number;
    search?: string;
    type?: MediaType;
    genre?: Genre;
    year?: number;
    sortBy?: 'title' | 'year' | 'rating' | 'createdAt' | 'updatedAt';
    sortOrder?: 'asc' | 'desc';
}

// Statistics types
export interface GenreDistribution {
    genre: Genre | null;
    _count: number;
}

export interface RecentMedia {
    id: number;
    title: string;
    type: MediaType;
    year: number | null;
    createdAt: string;
}

export interface MediaStats {
    totalCount: number;
    movieCount: number;
    tvShowCount: number;
    genreDistribution: GenreDistribution[];
    recentlyAdded: RecentMedia[];
}

// Genre display mapping
export const GENRE_LABELS: Record<Genre, string> = {
    ACTION: 'Action',
    ADVENTURE: 'Adventure',
    ANIMATION: 'Animation',
    BIOGRAPHY: 'Biography',
    COMEDY: 'Comedy',
    CRIME: 'Crime',
    DOCUMENTARY: 'Documentary',
    DRAMA: 'Drama',
    FAMILY: 'Family',
    FANTASY: 'Fantasy',
    HISTORY: 'History',
    HORROR: 'Horror',
    MUSIC: 'Music',
    MYSTERY: 'Mystery',
    ROMANCE: 'Romance',
    SCIENCE_FICTION: 'Science Fiction',
    THRILLER: 'Thriller',
    WAR: 'War',
    WESTERN: 'Western',
    OTHER: 'Other'
};

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
    MOVIE: 'Movie',
    TV_SHOW: 'TV Show'
};