import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUpload from "@/pages/shows/_components/ImageUpload";
import type { Media, Genre } from "@/types/media";
import { GENRE_LABELS, MEDIA_TYPE_LABELS } from "@/types/media";
import { useMediaMutations } from "@/hooks/useMediaMutations";
import { toast } from "sonner";

// Dropdown options
const LANGUAGE_OPTIONS = {
  ENGLISH: "English",
  SPANISH: "Spanish",
  FRENCH: "French",
  GERMAN: "German",
  ITALIAN: "Italian",
  PORTUGUESE: "Portuguese",
  RUSSIAN: "Russian",
  CHINESE: "Chinese",
  JAPANESE: "Japanese",
  KOREAN: "Korean",
  HINDI: "Hindi",
  ARABIC: "Arabic",
  OTHER: "Other",
} as const;

const LOCATION_OPTIONS = {
  LOS_ANGELES: "Los Angeles, USA",
  NEW_YORK: "New York, USA",
  LONDON: "London, UK",
  PARIS: "Paris, France",
  TOKYO: "Tokyo, Japan",
  MUMBAI: "Mumbai, India",
  SYDNEY: "Sydney, Australia",
  VANCOUVER: "Vancouver, Canada",
  BERLIN: "Berlin, Germany",
  ROME: "Rome, Italy",
  MADRID: "Madrid, Spain",
  MOSCOW: "Moscow, Russia",
  BEIJING: "Beijing, China",
  SEOUL: "Seoul, South Korea",
  OTHER: "Other",
} as const;

// Simplified validation schema
const mediaSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  type: z.enum(["MOVIE", "TV_SHOW"]),
  director: z.string(),
  budget: z.number().min(1, "Budget is required"),
  location: z.enum(Object.keys(LOCATION_OPTIONS) as [string, ...string[]]),
  duration: z.number(),
  year: z
    .number()
    .min(1900, "Year must be greater than 1900")
    .max(2025, "Year must be less than 2025"),
  genre: z.enum([
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
  ]),
  rating: z.number().min(0).max(10),
  description: z.string(),
  language: z.enum(Object.keys(LANGUAGE_OPTIONS) as [string, ...string[]]),
  posterUrl: z.string(),
});

type MediaFormData = z.infer<typeof mediaSchema>;

interface MediaFormProps {
  initialData?: Media | null;
  onCancel: () => void;
  mode: "create" | "edit";
}

const MediaFormSimple: React.FC<MediaFormProps> = ({
  initialData,
  onCancel,
  mode,
}) => {
  const { createMedia, updateMedia } = useMediaMutations({
    onCreateSuccess: () => {
      onCancel();
      toast.success("Media added successfully!");
    },
    onUpdateSuccess: () => {
      onCancel();
      toast.success("Media updated successfully!");
    },
    onError: (error, action) => {
      const message = error.response.data.error.validationErrors[0].message;

      if (action === "create") {
        toast.error(`Failed to create media: ${message}`);
      } else if (action === "update") {
        toast.error(`Failed to update media: ${message}`);
      }
    },
  });
  const form = useForm<MediaFormData>({
    resolver: zodResolver(mediaSchema),
    defaultValues: {
      title: initialData?.title || "",
      type: initialData?.type || "MOVIE",
      director: initialData?.director || "",
      budget: initialData?.budget || 0,
      location: initialData?.location || undefined,
      duration: initialData?.duration || undefined,
      year: initialData?.year || undefined,
      genre: initialData?.genre || undefined,
      rating: initialData?.rating
        ? parseFloat(Number(initialData.rating).toFixed(1))
        : 0,
      description: initialData?.description || "",
      language: initialData?.language || undefined,
      posterUrl: initialData?.posterUrl || "",
    },
  });

  const handleSubmit = async (data: MediaFormData) => {
    // Clean up empty strings to undefined for optional fields
    const cleanedData = {
      ...data,
      director: data.director || undefined,
      location: data.location || undefined,
      description: data.description || undefined,
      language: data.language || undefined,
      posterUrl: data.posterUrl === "" ? undefined : data.posterUrl,
    };

    const api =
      mode === "edit" && initialData && initialData.id
        ? updateMedia.mutateAsync(initialData?.id, cleanedData)
        : createMedia.mutateAsync(cleanedData);
    await api;
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              className="bg-gray-50/50 w-full dark:bg-slate-700/50 border-gray-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20"
              id="title"
              placeholder="Enter title"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="director">Director</Label>
            <Input
              className="bg-gray-50/50 w-full dark:bg-slate-700/50 border-gray-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20"
              id="director"
              placeholder="Enter director name"
              {...form.register("director")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="budget">Budget ($)</Label>
            <Input
              className="bg-gray-50/50 w-full dark:bg-slate-700/50 border-gray-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20"
              id="budget"
              type="number"
              placeholder="1000000"
              {...form.register("budget", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              className="bg-gray-50/50 w-full dark:bg-slate-700/50 border-gray-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20"
              id="year"
              type="number"
              placeholder="2024"
              {...form.register("year", { valueAsNumber: true })}
            />
          </div>
        </div>
        {/* Details */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              className="bg-gray-50/50 w-full dark:bg-slate-700/50 border-gray-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20"
              id="duration"
              type="number"
              placeholder="120"
              {...form.register("duration", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Rating (0-10)</Label>
            <Input
              className="bg-gray-50/50 w-full dark:bg-slate-700/50 border-gray-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20"
              id="rating"
              type="number"
              step="0.1"
              min="0"
              max="10"
              placeholder="8.5"
              {...form.register("rating", { valueAsNumber: true })}
            />
          </div>
        </div>

        {/* Location and Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="location">Filming Location</Label>
            <Select
              onValueChange={(value) => form.setValue("location", value)}
              defaultValue={form.getValues("location")}
            >
              <SelectTrigger className="bg-gray-50/50 w-full dark:bg-slate-700/50 border-gray-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LOCATION_OPTIONS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <Select
              onValueChange={(value) => form.setValue("genre", value as Genre)}
              defaultValue={form.getValues("genre")}
            >
              <SelectTrigger className="bg-gray-50/50 w-full dark:bg-slate-700/50 border-gray-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(GENRE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
              onValueChange={(value) => form.setValue("language", value)}
              defaultValue={form.getValues("language")?.toUpperCase()}
            >
              <SelectTrigger className="bg-gray-50/50 w-full dark:bg-slate-700/50 border-gray-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LANGUAGE_OPTIONS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select
              onValueChange={(value) =>
                form.setValue("type", value as "MOVIE" | "TV_SHOW")
              }
              defaultValue={form.getValues("type")}
            >
              <SelectTrigger className="bg-gray-50/50 w-full dark:bg-slate-700/50 border-gray-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(MEDIA_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Poster Image Upload */}
        <div className="grid grid-cols-1 gap-6">
          <ImageUpload
            onUploadComplete={(url) => form.setValue("posterUrl", url)}
            currentImageUrl={form.watch("posterUrl")}
            disabled={
              !initialData ? createMedia.isPending : updateMedia.isPending
            }
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            className="flex min-h-[80px] bg-gray-50/50 w-full border-gray-400 dark:bg-slate-700/50  dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 rounded-md border  px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter description or plot summary"
            {...form.register("description")}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={
              !initialData ? createMedia.isPending : updateMedia.isPending
            }
          >
            Cancel
          </Button>
          <Button
            className="bg-indigo-500 text-white hover:bg-indigo-600"
            type="submit"
            disabled={
              !initialData ? createMedia.isPending : updateMedia.isPending
            }
          >
            {createMedia.isPending || updateMedia.isPending
              ? "Saving..."
              : mode === "create"
              ? "Add Media"
              : "Update Media"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MediaFormSimple;
