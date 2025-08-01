import { z } from 'zod';
import type { MediaTypeEnum, GenreEnum } from '../types/media';

// Enum validations
const MediaTypeEnum = z.enum(["MOVIE", "TV_SHOW"]);
const GenreEnum = z.enum([
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

// Base media schema for common validations
const baseMediaSchema = {
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters")
    .trim(),

  type: MediaTypeEnum,

  director: z
    .string()
    .max(255, "Director name must be less than 255 characters")
    .trim()
    .optional()
    .nullable(),

  budget: z
    .number()
    .positive("Budget must be a positive number")
    .max(999999999999999, "Budget is too large")
    .optional()
    .nullable(),

  location: z
    .string()
    .max(255, "Location must be less than 255 characters")
    .trim()
    .optional()
    .nullable(),

  duration: z
    .number()
    .int("Duration must be an integer")
    .positive("Duration must be positive")
    .max(10000, "Duration seems unrealistic")
    .optional()
    .nullable(),

  year: z
    .number()
    .int("Year must be an integer")
    .min(1888, "Year must be after 1888 (first movie)")
    .max(new Date().getFullYear() + 10, "Year cannot be too far in the future")
    .optional()
    .nullable(),

  genre: GenreEnum.optional().nullable(),

  rating: z
    .number()
    .min(0, "Rating must be at least 0")
    .max(10, "Rating must be at most 10")
    .optional()
    .nullable(),

  description: z
    .string()
    .max(2000, "Description must be less than 2000 characters")
    .trim()
    .optional()
    .nullable(),

  language: z
    .string()
    .max(100, "Language must be less than 100 characters")
    .trim()
    .optional()
    .nullable(),
  posterUrl: z
    .string()
    .url("Poster URL must be a valid URL")
    .max(500, "Poster URL must be less than 500 characters")
    .optional()
    .nullable(),
};

// Schema for creating new media
const createMediaSchema = z.object({
  ...baseMediaSchema,
  title: baseMediaSchema.title, // Required for creation
  type: baseMediaSchema.type, // Required for creation
});

// Schema for updating media (all fields optional except id)
const updateMediaSchema = z.object({
  ...Object.fromEntries(
    Object.entries(baseMediaSchema).map(([key, value]) => [
      key,
      value.optional(),
    ])
  ),
});

// Schema for pagination query parameters
const paginationSchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, "Page must be a positive integer")
    .transform(Number)
    .refine((val) => val > 0, "Page must be greater than 0")
    .default("1"),

  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a positive integer")
    .transform(Number)
    .refine((val) => val > 0 && val <= 100, "Limit must be between 1 and 100")
    .default("10"),

  search: z
    .string()
    .max(255, "Search term must be less than 255 characters")
    .trim()
    .optional(),

  type: MediaTypeEnum.optional(),

  genre: GenreEnum.optional(),

  year: z
    .string()
    .regex(/^\d{4}$/, "Year must be 4 digits")
    .transform(Number)
    .optional(),

  sortBy: z
    .enum(["title", "year", "rating", "createdAt", "updatedAt"])
    .default("createdAt"),

  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Schema for media ID parameter
const mediaIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID must be a positive integer")
    .transform(Number),
});

// Export the schemas and types
export {
  createMediaSchema,
  updateMediaSchema,
  paginationSchema,
  mediaIdSchema,
  MediaTypeEnum,
  GenreEnum,
};
