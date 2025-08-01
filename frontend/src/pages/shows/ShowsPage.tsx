import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Film,
  Tv,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SkeletonCard, SkeletonTable } from "@/components/ui/skeleton";
import MediaTable from "@/pages/shows/_components/MediaTable";
import MediaDialog from "@/pages/shows/_components/MediaDialog";
import DeleteConfirmDialog from "@/pages/shows/_components/DeleteConfirmDialog";
import SearchAndFilters from "@/pages/shows/_components/SearchAndFilters";
import AppHeader from "@/layout/header/AppHeader";
import PageTransition from "@/layout/PageTransition";
import { useMedia } from "@/hooks/useMedia";
import { useMediaMutations } from "@/hooks/useMediaMutations";
import type { Media } from "@/types/media";
import { toast } from "sonner";

function ShowsPage() {
  // State for modals
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  // Media data and infinite scroll
  const {
    media,
    isLoading,
    isError,
    error,
    hasNextPage,
    totalCount,
    refetch,
    fetchNextPage,
    updateQuery,
    query,
  } = useMedia({
    initialQuery: {
      limit: 10,
    },
  });

  // Mutations with TanStack Query
  const { deleteMedia } = useMediaMutations({
    onDeleteSuccess: () => {
      toast.success("Media deleted successfully!");
    },
    onError: (error, action) => {
      if (action === "delete")
        toast.error(
          `Failed to delete media: ${error.response.data.error.validationErrors[0].message}`
        );
    },
  });

  const handleDeleteMedia = async () => {
    if (!selectedMedia) return;

    try {
      await deleteMedia.mutateAsync(selectedMedia.id);
      setIsDeleteDialogOpen(false);
      setSelectedMedia(null);
    } catch {
      // Error handling is done in the mutation's onError callback
    }
  };

  const handleEditClick = (media: Media) => {
    setSelectedMedia(media);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (media: Media) => {
    setSelectedMedia(media);
    setIsDeleteDialogOpen(true);
  };

  // Stats calculations
  const movieCount = media.filter((m) => m.type === "MOVIE").length;
  const tvShowCount = media.filter((m) => m.type === "TV_SHOW").length;
  const averageRating =
    media.length > 0
      ? media.reduce((sum, m) => sum + Number(m.rating || 0), 0) /
        media.filter((m) => m.rating).length
      : 0;

  return (
    <PageTransition className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
      <AppHeader />

      {/* Add Media Button Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-white/60 dark:bg-slate-800/60 backdrop-blur border-gray-200/50 dark:border-slate-700/50"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Your Collection
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Manage your cinematic universe
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-shadow duration-200"
                size="lg"
              >
                <Plus className="h-5 w-5" />
                Add New Media
                <Sparkles className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200/50 hover:shadow-xl transition-shadow duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    Total Items
                  </CardTitle>
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold text-indigo-600">
                    {totalCount}
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <Sparkles className="h-3 w-3" />
                    {media.length} loaded
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/50 hover:shadow-xl transition-shadow duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -translate-y-16 translate-x-16"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    Movies
                  </CardTitle>
                  <Film className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold text-blue-600">
                    {movieCount}
                  </div>
                  <p className="text-xs text-gray-500">in your collection</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200/50 hover:shadow-xl transition-shadow duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full -translate-y-16 translate-x-16"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    TV Shows
                  </CardTitle>
                  <Tv className="h-5 w-5 text-emerald-600" />
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold text-emerald-600">
                    {tvShowCount}
                  </div>
                  <p className="text-xs text-gray-500">in your collection</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/50 hover:shadow-xl transition-shadow duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full -translate-y-16 translate-x-16"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    Avg Rating
                  </CardTitle>
                  <Star className="h-5 w-5 text-amber-500 fill-current" />
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold text-amber-600">
                    {averageRating > 0 ? averageRating.toFixed(1) : "—"}
                  </div>
                  <p className="text-xs text-gray-500">out of 10 stars</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <SearchAndFilters
            query={query}
            onQueryUpdate={updateQuery}
            totalCount={totalCount}
            isLoading={isLoading}
          />
        </motion.div>

        {/* Error State */}
        {isError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-800 dark:text-red-300">
                      Error loading media
                    </h3>
                    <p className="text-sm mt-1 text-red-600 dark:text-red-400">
                      {error?.message}
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-3"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetch()}
                        className="border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20"
                      >
                        Try Again
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Media Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border-gray-200/50 dark:border-slate-700/50 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                    Your Media Collection
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {totalCount > 0
                      ? `Showing ${media.length} of ${totalCount} items`
                      : "No media items found"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {media.length === 0 && !isLoading ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
                    <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                      <Film className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                    No media found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                    {query.search || query.type || query.genre || query.year
                      ? "Try adjusting your search filters to find what you're looking for"
                      : "Start building your cinematic universe by adding your first movie or TV show"}
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => setIsCreateDialogOpen(true)}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Media
                      <Sparkles className="h-4 w-4 ml-2" />
                    </Button>
                  </motion.div>
                </motion.div>
              ) : isLoading ? (
                <SkeletonTable rows={5} />
              ) : (
                <MediaTable
                  media={media}
                  isLoading={isLoading}
                  hasNextPage={hasNextPage}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  fetchNextPage={fetchNextPage}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Modals */}
      <MediaDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        mode="create"
      />

      <MediaDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedMedia(null);
        }}
        media={selectedMedia}
        mode="edit"
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedMedia(null);
        }}
        onConfirm={handleDeleteMedia}
        media={selectedMedia}
        isLoading={deleteMedia.isPending}
      />
    </PageTransition>
  );
}

export default ShowsPage;
