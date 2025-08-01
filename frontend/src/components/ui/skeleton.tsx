import React from "react";
import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  variant?: "default" | "rounded" | "circular";
  animate?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "default",
  animate = true,
}) => {
  const baseClasses = "bg-gray-200 dark:bg-slate-700";
  const variantClasses = {
    default: "rounded-md",
    rounded: "rounded-lg",
    circular: "rounded-full",
  };

  const Component = animate ? motion.div : "div";

  return (
    <Component
      className={`${baseClasses} ${variantClasses[variant]} ${className} shimmer`}
      {...(animate && {
        animate: { opacity: [0.5, 1, 0.5] },
        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
      })}
    />
  );
};

// Predefined skeleton components
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className = "",
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={`h-4 ${i === lines - 1 ? "w-3/4" : "w-full"}`}
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div
    className={`p-6 border border-gray-200 dark:border-slate-700 rounded-lg ${className}`}
  >
    <Skeleton className="h-6 w-1/3 mb-4" />
    <SkeletonText lines={3} />
    <div className="flex gap-2 mt-4">
      <Skeleton className="h-8 w-20" variant="rounded" />
      <Skeleton className="h-8 w-20" variant="rounded" />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; className?: string }> = ({
  rows = 5,
  className = "",
}) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 items-center">
        <Skeleton className="h-12 w-12" variant="rounded" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <Skeleton className="h-6 w-16" variant="rounded" />
        <Skeleton className="h-8 w-8" variant="circular" />
      </div>
    ))}
  </div>
);

export default Skeleton;
