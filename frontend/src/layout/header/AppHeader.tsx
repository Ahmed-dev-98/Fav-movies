import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Film } from "lucide-react";
import UserDropdown from "@/layout/header/_components/UserDropdown";

const AppHeader: React.FC = () => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-gray-200/50 dark:border-slate-700/50 sticky top-0 z-50"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <Link
            to="/shows"
            className="flex items-center gap-3 hover:scale-105 transition-transform duration-300 group"
          >
            <motion.div
              className="relative"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
                <Film className="h-6 w-6 text-white" />
              </div>
            </motion.div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                CineVault
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                Your Movie Universe
              </p>
            </div>
          </Link>

          {/* User Dropdown */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <UserDropdown />
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default AppHeader;
