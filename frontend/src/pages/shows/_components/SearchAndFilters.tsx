import React from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { PaginationQuery, MediaType, Genre } from "@/types/media";
import { GENRE_LABELS, MEDIA_TYPE_LABELS } from "@/types/media";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchAndFiltersProps {
  query: PaginationQuery;
  onQueryUpdate: (updates: Partial<PaginationQuery>) => void;
  totalCount: number;
  isLoading: boolean;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  query,
  onQueryUpdate,
  totalCount,
  isLoading,
}) => {
  const [searchValue, setSearchValue] = React.useState(query.search || "");
  const [yearValue, setYearValue] = React.useState(
    query.year?.toString() || ""
  );

  // Debounce search and year values
  const debouncedSearchValue = useDebounce(searchValue, 800);
  const debouncedYearValue = useDebounce(yearValue, 800);

  // Handle debounced search updates
  React.useEffect(() => {
    onQueryUpdate({ search: debouncedSearchValue || undefined });
  }, [debouncedSearchValue, onQueryUpdate]);

  // Handle debounced year updates
  React.useEffect(() => {
    onQueryUpdate({
      year:
        debouncedYearValue && !isNaN(Number(debouncedYearValue))
          ? Number(debouncedYearValue)
          : undefined,
    });
  }, [debouncedYearValue, onQueryUpdate]);

  // Sync values when query changes externally
  React.useEffect(() => {
    setSearchValue(query.search || "");
  }, [query.search]);

  React.useEffect(() => {
    setYearValue(query.year?.toString() || "");
  }, [query.year]);

  const handleClearFilters = () => {
    setSearchValue("");
    setYearValue("");
    onQueryUpdate({
      search: undefined,
      type: undefined,
      genre: undefined,
      year: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  const activeFiltersCount = [
    query.search,
    query.type,
    query.genre,
    query.year,
  ].filter(Boolean).length;

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by title, director, or description..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 pr-4 bg-gray-50/50 dark:bg-slate-700/50 border-gray-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20"
              disabled={isLoading}
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {totalCount} {totalCount === 1 ? "item" : "items"} total
            </div>
          </div>

          {/* Expanded Filters */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
            {/* Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={query.type || "all"}
                onValueChange={(value) =>
                  onQueryUpdate({
                    type:
                      value === "all"
                        ? undefined
                        : (value as MediaType | undefined),
                  })
                }
              >
                <SelectTrigger className="bg-gray-50/50 w-full dark:bg-slate-700/50 border-gray-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {Object.entries(MEDIA_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Genre Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Genre</label>
              <Select
                value={query.genre || "all"}
                onValueChange={(value) =>
                  onQueryUpdate({
                    genre:
                      value === "all"
                        ? undefined
                        : (value as Genre | undefined),
                  })
                }
              >
                <SelectTrigger className="bg-gray-50/50 w-full dark:bg-slate-700/50 border-gray-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20">
                  <SelectValue placeholder="All genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All genres</SelectItem>
                  {Object.entries(GENRE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Year</label>
              <Input
                type="number"
                placeholder="e.g. 2024"
                value={yearValue}
                onChange={(e) => setYearValue(e.target.value)}
                min="1888"
                max={new Date().getFullYear() + 10}
                disabled={isLoading}
                className="bg-gray-50/50 w-full dark:bg-slate-700/50 border-gray-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20"
              />
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort by</label>
              <div className="flex gap-2">
                <Select
                  value={query.sortBy || "createdAt"}
                  onValueChange={(value) =>
                    onQueryUpdate({
                      sortBy: value as
                        | "title"
                        | "year"
                        | "rating"
                        | "createdAt"
                        | "updatedAt",
                    })
                  }
                >
                  <SelectTrigger className="flex-1 bg-gray-50/50 w-full dark:bg-slate-700/50 border-gray-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Date Added</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="updatedAt">Last Updated</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={query.sortOrder || "desc"}
                  onValueChange={(value) =>
                    onQueryUpdate({ sortOrder: value as "asc" | "desc" })
                  }
                >
                  <SelectTrigger className=" bg-gray-50/50 w-fit dark:bg-slate-700/50 border-gray-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {query.search && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: "{query.search}"
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => onQueryUpdate({ search: undefined })}
                  />
                </Badge>
              )}
              {query.type && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Type: {MEDIA_TYPE_LABELS[query.type]}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => onQueryUpdate({ type: undefined })}
                  />
                </Badge>
              )}
              {query.genre && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Genre: {GENRE_LABELS[query.genre]}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => onQueryUpdate({ genre: undefined })}
                  />
                </Badge>
              )}
              {query.year && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Year: {query.year}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => onQueryUpdate({ year: undefined })}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchAndFilters;
