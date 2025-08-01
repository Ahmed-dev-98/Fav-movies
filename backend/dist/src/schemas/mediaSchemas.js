"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenreEnum = exports.MediaTypeEnum = exports.mediaIdSchema = exports.paginationSchema = exports.updateMediaSchema = exports.createMediaSchema = void 0;
const zod_1 = require("zod");
const MediaTypeEnum = zod_1.z.enum(["MOVIE", "TV_SHOW"]);
exports.MediaTypeEnum = MediaTypeEnum;
const GenreEnum = zod_1.z.enum([
    "ACTION",
    "ADVENTURE",
    "ANIMATION",
    "BIOGRAPHY",
    "COMEDY",
    "CRIME",
    "DOCUMENTARY",
    "DRAMA",
    "FAMILY",
    "FANTASY",
    "HISTORY",
    "HORROR",
    "MUSIC",
    "MYSTERY",
    "ROMANCE",
    "SCIENCE_FICTION",
    "THRILLER",
    "WAR",
    "WESTERN",
    "OTHER",
]);
exports.GenreEnum = GenreEnum;
const baseMediaSchema = {
    title: zod_1.z
        .string()
        .min(1, "Title is required")
        .max(255, "Title must be less than 255 characters")
        .trim(),
    type: MediaTypeEnum,
    director: zod_1.z
        .string()
        .max(255, "Director name must be less than 255 characters")
        .trim()
        .optional()
        .nullable(),
    budget: zod_1.z
        .number()
        .positive("Budget must be a positive number")
        .max(999999999999999, "Budget is too large")
        .optional()
        .nullable(),
    location: zod_1.z
        .string()
        .max(255, "Location must be less than 255 characters")
        .trim()
        .optional()
        .nullable(),
    duration: zod_1.z
        .number()
        .int("Duration must be an integer")
        .positive("Duration must be positive")
        .max(10000, "Duration seems unrealistic")
        .optional()
        .nullable(),
    year: zod_1.z
        .number()
        .int("Year must be an integer")
        .min(1888, "Year must be after 1888 (first movie)")
        .max(new Date().getFullYear() + 10, "Year cannot be too far in the future")
        .optional()
        .nullable(),
    genre: GenreEnum.optional().nullable(),
    rating: zod_1.z
        .number()
        .min(0, "Rating must be at least 0")
        .max(10, "Rating must be at most 10")
        .optional()
        .nullable(),
    description: zod_1.z
        .string()
        .max(2000, "Description must be less than 2000 characters")
        .trim()
        .optional()
        .nullable(),
    language: zod_1.z
        .string()
        .max(100, "Language must be less than 100 characters")
        .trim()
        .optional()
        .nullable(),
    posterUrl: zod_1.z
        .string()
        .url("Poster URL must be a valid URL")
        .max(500, "Poster URL must be less than 500 characters")
        .optional()
        .nullable(),
};
const createMediaSchema = zod_1.z.object({
    ...baseMediaSchema,
    title: baseMediaSchema.title,
    type: baseMediaSchema.type,
});
exports.createMediaSchema = createMediaSchema;
const updateMediaSchema = zod_1.z.object({
    ...Object.fromEntries(Object.entries(baseMediaSchema).map(([key, value]) => [
        key,
        value.optional(),
    ])),
});
exports.updateMediaSchema = updateMediaSchema;
const paginationSchema = zod_1.z.object({
    page: zod_1.z
        .string()
        .regex(/^\d+$/, "Page must be a positive integer")
        .transform(Number)
        .refine((val) => val > 0, "Page must be greater than 0")
        .default("1"),
    limit: zod_1.z
        .string()
        .regex(/^\d+$/, "Limit must be a positive integer")
        .transform(Number)
        .refine((val) => val > 0 && val <= 100, "Limit must be between 1 and 100")
        .default("10"),
    search: zod_1.z
        .string()
        .max(255, "Search term must be less than 255 characters")
        .trim()
        .optional(),
    type: MediaTypeEnum.optional(),
    genre: GenreEnum.optional(),
    year: zod_1.z
        .string()
        .regex(/^\d{4}$/, "Year must be 4 digits")
        .transform(Number)
        .optional(),
    sortBy: zod_1.z
        .enum(["title", "year", "rating", "createdAt", "updatedAt"])
        .default("createdAt"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).default("desc"),
});
exports.paginationSchema = paginationSchema;
const mediaIdSchema = zod_1.z.object({
    id: zod_1.z
        .string()
        .regex(/^\d+$/, "ID must be a positive integer")
        .transform(Number),
});
exports.mediaIdSchema = mediaIdSchema;
//# sourceMappingURL=mediaSchemas.js.map