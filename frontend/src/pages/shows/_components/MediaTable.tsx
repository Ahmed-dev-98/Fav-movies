import React from "react";
import { format } from "date-fns";
import {
  Film,
  Tv,
  Edit,
  Trash2,
  Star,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
} from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Media, MediaType, Genre } from "@/types/media";
import { GENRE_LABELS, MEDIA_TYPE_LABELS } from "@/types/media";
import { cn } from "@/lib/utils";
import MediaImage from "@/pages/shows/_components/MediaImage";
import TableCellContent from "@/pages/shows/_components/TableCellContent";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MediaTableProps {
  media: Media[];
  isLoading: boolean;
  hasNextPage: boolean;
  onEdit: (media: Media) => void;
  onDelete: (media: Media) => void;
  fetchNextPage: () => void;
  className?: string;
}

const MediaTable: React.FC<MediaTableProps> = ({
  media,
  isLoading,
  hasNextPage,
  onEdit,
  onDelete,
  fetchNextPage,
  className,
}) => {
  // Loading component for infinite scroll
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-4">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      <span className="ml-2 text-sm text-muted-foreground">
        Loading more...
      </span>
    </div>
  );

  // End message component
  const EndMessage = () => (
    <div className="text-center text-sm text-muted-foreground py-4">
      No more items to load
    </div>
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(amount));
  };

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Render rating stars
  const renderRating = (rating: number) => (
    <div className="flex items-center gap-1">
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      <span className="text-sm font-medium">{Number(rating).toFixed(1)}</span>
    </div>
  );

  // Mobile card view
  const MobileCard: React.FC<{ item: Media }> = ({ item }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex gap-3 mb-3">
          <MediaImage
            src={item.posterUrl}
            alt={item.title}
            mediaType={item.type}
            size="md"
            variant="rounded"
            className="flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0">
                {item.type === "MOVIE" ? (
                  <Film className="h-5 w-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <Tv className="h-5 w-5 text-green-600 flex-shrink-0" />
                )}
                <div className="min-w-0">
                  <h3 className="font-semibold text-lg leading-tight truncate">
                    {item.title}
                  </h3>
                  {item.director && (
                    <p className="text-sm text-muted-foreground truncate">
                      {item.director}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(item)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(item)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary">{MEDIA_TYPE_LABELS[item.type]}</Badge>
              {item.genre && (
                <Badge variant="outline">{GENRE_LABELS[item.genre]}</Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              {item.year && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{item.year}</span>
                </div>
              )}
              {item.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDuration(item.duration)}</span>
                </div>
              )}
              {item.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{item.location}</span>
                </div>
              )}
              {item.budget && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  <span>{formatCurrency(item.budget)}</span>
                </div>
              )}
            </div>

            {item.rating && (
              <div className="mt-3 flex justify-between items-center">
                {renderRating(item.rating)}
                <span className="text-xs text-muted-foreground">
                  {format(new Date(item.createdAt), "MMM dd, yyyy")}
                </span>
              </div>
            )}

            {item.description && (
              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading && media.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <div
          className="rounded-md border max-h-[600px] overflow-auto"
          id="desktop-scroll-container"
        >
          <Table className="table-fixed">
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <TableHead className="w-12">Poster</TableHead>
                <TableHead className="w-30">Media</TableHead>
                <TableHead className="w-28">Type</TableHead>
                <TableHead className="w-24">Genre</TableHead>
                <TableHead className="w-20">Year</TableHead>
                <TableHead className="w-24">Duration</TableHead>
                <TableHead className="w-20">Rating</TableHead>
                <TableHead className="w-24">Budget</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
          <InfiniteScroll
            dataLength={media.length}
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={<LoadingSpinner />}
            endMessage={<EndMessage />}
            scrollableTarget="desktop-scroll-container"
            style={{ overflow: "visible" }}
          >
            <Table className="table-fixed">
              <TableBody>
                {media.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="w-12">
                      <MediaImage
                        src={item.posterUrl}
                        alt={item.title}
                        mediaType={item.type}
                        size="xs"
                        variant="rounded"
                      />
                    </TableCell>
                    <TableCell className="w-30">
                      <div>
                        <TableCellContent
                          className="font-medium"
                          tooltip={item.title}
                        >
                          {item.title}
                        </TableCellContent>
                        {item.director && (
                          <TableCellContent
                            className="text-sm text-muted-foreground"
                            tooltip={`Director: ${item.director}`}
                          >
                            by {item.director}
                          </TableCellContent>
                        )}
                        {item.location && (
                          <TableCellContent
                            className="text-sm text-muted-foreground flex items-center gap-1"
                            tooltip={`Location: ${item.location}`}
                          >
                            <MapPin
                              color="blue"
                              className="h-3 w-3 flex-shrink-0"
                            />
                            <span className="truncate">
                              {item.location.length > 20
                                ? item.location.slice(0, 20) + "..."
                                : item.location}
                            </span>
                          </TableCellContent>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="w-28">
                      <TableCellContent
                        truncate={false}
                        tooltip={`Type: ${
                          MEDIA_TYPE_LABELS[item.type as MediaType]
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {item.type === "MOVIE" ? (
                            <Film className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Tv className="h-4 w-4 text-green-600" />
                          )}
                          <Badge variant="secondary">
                            {
                              MEDIA_TYPE_LABELS[
                                item.type as MediaType
                              ] as MediaType
                            }
                          </Badge>
                        </div>
                      </TableCellContent>
                    </TableCell>
                    <TableCell className="w-24">
                      <TableCellContent
                        truncate={false}
                        tooltip={
                          item.genre
                            ? `Genre: ${GENRE_LABELS[item.genre]}`
                            : "No genre specified"
                        }
                      >
                        {item.genre ? (
                          <Badge variant="outline">
                            {GENRE_LABELS[item.genre] as Genre}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCellContent>
                    </TableCell>
                    <TableCell className="w-20">
                      <TableCellContent
                        truncate={false}
                        tooltip={
                          item.year ? `Year: ${item.year}` : "No year specified"
                        }
                      >
                        {item.year ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {item.year}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCellContent>
                    </TableCell>
                    <TableCell className="w-24">
                      <TableCellContent
                        truncate={false}
                        tooltip={
                          item.duration
                            ? `Duration: ${formatDuration(item.duration)} (${
                                item.duration
                              } minutes)`
                            : "No duration specified"
                        }
                      >
                        {item.duration ? (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {formatDuration(item.duration)}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCellContent>
                    </TableCell>
                    <TableCell className="w-20">
                      <TableCellContent
                        truncate={false}
                        tooltip={
                          item.rating
                            ? `Rating: ${item.rating}/10`
                            : "No rating specified"
                        }
                      >
                        {item.rating ? (
                          renderRating(item.rating)
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCellContent>
                    </TableCell>
                    <TableCell className="w-24">
                      <TableCellContent
                        tooltip={
                          item.budget
                            ? `Budget: ${formatCurrency(item.budget)}`
                            : "No budget specified"
                        }
                      >
                        {item.budget ? (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-muted-foreground" />
                            {formatCurrency(item.budget)}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCellContent>
                    </TableCell>
                    <TableCell className="w-20">
                      <div className="flex gap-1">
                        <TooltipProvider delayDuration={300}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit {item.title}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider delayDuration={300}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(item)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete {item.title}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </InfiniteScroll>
        </div>
      </div>

      {/* Mobile Card View */}
      <div
        className="lg:hidden max-h-[600px] overflow-auto"
        id="mobile-scroll-container"
      >
        <InfiniteScroll
          dataLength={media.length}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<LoadingSpinner />}
          endMessage={<EndMessage />}
          scrollableTarget="mobile-scroll-container"
          className="space-y-4"
        >
          {media.map((item) => (
            <MobileCard key={item.id} item={item} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default MediaTable;
