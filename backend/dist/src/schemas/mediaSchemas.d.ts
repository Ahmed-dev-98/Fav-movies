import { z } from 'zod';
import type { MediaTypeEnum, GenreEnum } from '../types/media';
declare const MediaTypeEnum: z.ZodEnum<["MOVIE", "TV_SHOW"]>;
declare const GenreEnum: z.ZodEnum<["ACTION", "ADVENTURE", "ANIMATION", "BIOGRAPHY", "COMEDY", "CRIME", "DOCUMENTARY", "DRAMA", "FAMILY", "FANTASY", "HISTORY", "HORROR", "MUSIC", "MYSTERY", "ROMANCE", "SCIENCE_FICTION", "THRILLER", "WAR", "WESTERN", "OTHER"]>;
declare const createMediaSchema: z.ZodObject<{
    title: z.ZodString;
    type: z.ZodEnum<["MOVIE", "TV_SHOW"]>;
    director: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    budget: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    location: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    duration: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    year: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    genre: z.ZodNullable<z.ZodOptional<z.ZodEnum<["ACTION", "ADVENTURE", "ANIMATION", "BIOGRAPHY", "COMEDY", "CRIME", "DOCUMENTARY", "DRAMA", "FAMILY", "FANTASY", "HISTORY", "HORROR", "MUSIC", "MYSTERY", "ROMANCE", "SCIENCE_FICTION", "THRILLER", "WAR", "WESTERN", "OTHER"]>>>;
    rating: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    language: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    posterUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    type: "MOVIE" | "TV_SHOW";
    year?: number | null | undefined;
    rating?: number | null | undefined;
    director?: string | null | undefined;
    budget?: number | null | undefined;
    location?: string | null | undefined;
    duration?: number | null | undefined;
    genre?: "ACTION" | "ADVENTURE" | "ANIMATION" | "BIOGRAPHY" | "COMEDY" | "CRIME" | "DOCUMENTARY" | "DRAMA" | "FAMILY" | "FANTASY" | "HISTORY" | "HORROR" | "MUSIC" | "MYSTERY" | "ROMANCE" | "SCIENCE_FICTION" | "THRILLER" | "WAR" | "WESTERN" | "OTHER" | null | undefined;
    description?: string | null | undefined;
    language?: string | null | undefined;
    posterUrl?: string | null | undefined;
}, {
    title: string;
    type: "MOVIE" | "TV_SHOW";
    year?: number | null | undefined;
    rating?: number | null | undefined;
    director?: string | null | undefined;
    budget?: number | null | undefined;
    location?: string | null | undefined;
    duration?: number | null | undefined;
    genre?: "ACTION" | "ADVENTURE" | "ANIMATION" | "BIOGRAPHY" | "COMEDY" | "CRIME" | "DOCUMENTARY" | "DRAMA" | "FAMILY" | "FANTASY" | "HISTORY" | "HORROR" | "MUSIC" | "MYSTERY" | "ROMANCE" | "SCIENCE_FICTION" | "THRILLER" | "WAR" | "WESTERN" | "OTHER" | null | undefined;
    description?: string | null | undefined;
    language?: string | null | undefined;
    posterUrl?: string | null | undefined;
}>;
declare const updateMediaSchema: z.ZodObject<{
    [k: string]: z.ZodOptional<z.ZodString> | z.ZodOptional<z.ZodEnum<["MOVIE", "TV_SHOW"]>> | z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>> | z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNumber>>> | z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodEnum<["ACTION", "ADVENTURE", "ANIMATION", "BIOGRAPHY", "COMEDY", "CRIME", "DOCUMENTARY", "DRAMA", "FAMILY", "FANTASY", "HISTORY", "HORROR", "MUSIC", "MYSTERY", "ROMANCE", "SCIENCE_FICTION", "THRILLER", "WAR", "WESTERN", "OTHER"]>>>>;
}, "strip", z.ZodTypeAny, {
    [x: string]: string | number | null | undefined;
}, {
    [x: string]: string | number | null | undefined;
}>;
declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>>;
    limit: z.ZodDefault<z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>>;
    search: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<["MOVIE", "TV_SHOW"]>>;
    genre: z.ZodOptional<z.ZodEnum<["ACTION", "ADVENTURE", "ANIMATION", "BIOGRAPHY", "COMEDY", "CRIME", "DOCUMENTARY", "DRAMA", "FAMILY", "FANTASY", "HISTORY", "HORROR", "MUSIC", "MYSTERY", "ROMANCE", "SCIENCE_FICTION", "THRILLER", "WAR", "WESTERN", "OTHER"]>>;
    year: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
    sortBy: z.ZodDefault<z.ZodEnum<["title", "year", "rating", "createdAt", "updatedAt"]>>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortBy: "title" | "year" | "rating" | "createdAt" | "updatedAt";
    sortOrder: "asc" | "desc";
    year?: number | undefined;
    type?: "MOVIE" | "TV_SHOW" | undefined;
    genre?: "ACTION" | "ADVENTURE" | "ANIMATION" | "BIOGRAPHY" | "COMEDY" | "CRIME" | "DOCUMENTARY" | "DRAMA" | "FAMILY" | "FANTASY" | "HISTORY" | "HORROR" | "MUSIC" | "MYSTERY" | "ROMANCE" | "SCIENCE_FICTION" | "THRILLER" | "WAR" | "WESTERN" | "OTHER" | undefined;
    search?: string | undefined;
}, {
    year?: string | undefined;
    type?: "MOVIE" | "TV_SHOW" | undefined;
    genre?: "ACTION" | "ADVENTURE" | "ANIMATION" | "BIOGRAPHY" | "COMEDY" | "CRIME" | "DOCUMENTARY" | "DRAMA" | "FAMILY" | "FANTASY" | "HISTORY" | "HORROR" | "MUSIC" | "MYSTERY" | "ROMANCE" | "SCIENCE_FICTION" | "THRILLER" | "WAR" | "WESTERN" | "OTHER" | undefined;
    page?: string | undefined;
    limit?: string | undefined;
    search?: string | undefined;
    sortBy?: "title" | "year" | "rating" | "createdAt" | "updatedAt" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
declare const mediaIdSchema: z.ZodObject<{
    id: z.ZodEffects<z.ZodString, number, string>;
}, "strip", z.ZodTypeAny, {
    id: number;
}, {
    id: string;
}>;
export { createMediaSchema, updateMediaSchema, paginationSchema, mediaIdSchema, MediaTypeEnum, GenreEnum, };
//# sourceMappingURL=mediaSchemas.d.ts.map