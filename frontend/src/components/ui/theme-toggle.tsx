import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "minimal";
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "",
  variant = "default",
}) => {
  const { theme, toggleTheme } = useTheme();

  if (variant === "minimal") {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className={`p-2 h-9 w-9 ${className}`}
      >
        <motion.div
          initial={false}
          animate={{ rotate: theme === "dark" ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </motion.div>
      </Button>
    );
  }

  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={toggleTheme}
        className="relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur border-gray-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-colors duration-200"
      >
        <motion.div
          className="flex items-center gap-2"
          initial={false}
          animate={{ x: theme === "dark" ? -20 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium">Light</span>
          </div>
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-indigo-400" />
            <span className="text-sm font-medium">Dark</span>
          </div>
        </motion.div>

        {/* Animated background indicator */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-amber-100 to-amber-200 dark:from-indigo-900 dark:to-indigo-800 rounded-md"
          initial={false}
          animate={{
            x: theme === "dark" ? "50%" : "0%",
            opacity: theme === "dark" ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Sliding indicator */}
        <motion.div
          className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-amber-400 to-amber-500 dark:from-indigo-500 dark:to-indigo-600 rounded-sm shadow-sm"
          initial={false}
          animate={{ x: theme === "dark" ? "calc(100% - 4px)" : "4px" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </Button>
    </motion.div>
  );
};

export default ThemeToggle;
