import React, { useState } from "react";
import { Image as ImageIcon, Film, Tv } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MediaType } from "@/types/media";

interface MediaImageProps {
  src?: string | null;
  alt: string;
  mediaType?: MediaType;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "rounded" | "square";
}

const MediaImage: React.FC<MediaImageProps> = ({
  src,
  alt,
  mediaType,
  className,
  size = "md",
  variant = "rounded",
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const sizeClasses = {
    xs: "w-12 h-12",
    sm: "w-16 h-16",
    md: "w-20 h-20",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
  };

  const iconSizes = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
  };

  const shouldShowImage = src && !imageError;

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const PlaceholderContent = () => {
    const IconComponent =
      mediaType === "MOVIE" ? Film : mediaType === "TV_SHOW" ? Tv : ImageIcon;
    const iconColor =
      mediaType === "MOVIE"
        ? "text-blue-400"
        : mediaType === "TV_SHOW"
        ? "text-green-400"
        : "text-gray-400";

    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <IconComponent size={iconSizes[size]} className={iconColor} />
      </div>
    );
  };

  return (
    <div
      className={cn(
        "relative bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden",
        sizeClasses[size],
        variant === "rounded" ? "rounded-full" : "rounded",
        className
      )}
    >
      {shouldShowImage ? (
        <>
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
            </div>
          )}
          <img
            src={src}
            alt={alt}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-200",
              imageLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        </>
      ) : (
        <PlaceholderContent />
      )}
    </div>
  );
};

export default MediaImage;
