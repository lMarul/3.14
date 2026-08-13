import { motion, AnimatePresence } from "motion/react";
import { X, Filter } from "lucide-react";
import { useState } from "react";

interface FilterOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
  isDark: boolean;
}

export interface FilterState {
  categories: string[];
  years: string[];
  genres: string[];
}

import { useCustomTheme } from "../providers/ThemeContext";

export function FilterOverlay({ isOpen, onClose, onApplyFilters, isDark }: FilterOverlayProps) {
  const { theme, resolvedTheme } = useCustomTheme();
  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const categories = ["Animation", "Film", "Documentary"];
  const years = ["2026", "2025", "2024", "2023", "2022"];
  const genres = ["Drama", "Action", "Romance", "Horror", "Comedy", "Thriller"];

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleYear = (year: string) => {
    setSelectedYears(prev => 
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
    );
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleApply = () => {
    onApplyFilters({
      categories: selectedCategories,
      years: selectedYears,
      genres: selectedGenres,
    });
    onClose();
  };

  const handleClear = () => {
    setSelectedCategories([]);
    setSelectedYears([]);
    setSelectedGenres([]);
  };

  const activeFilterCount = selectedCategories.length + selectedYears.length + selectedGenres.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Filter Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-8 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-full pointer-events-auto ${
                isDark ? "bg-[#2a2a2a]" : "bg-white"
              }`}
            >
              {/* Header */}
              <div className={`flex items-center justify-between px-8 py-7 border-b shrink-0 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                <div className="flex items-center gap-3">
                  <Filter className="w-5 h-5 text-[#8a181a]" />
                  <h2 className="font-['Poppins'] font-bold text-xl">Filter Archive</h2>
                </div>
                <button
                  onClick={onClose}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isDark ? "hover:bg-white/10" : "hover:bg-gray-100"
                  }`}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Filter Content */}
              <div className="flex-1 overflow-y-auto px-8 py-7 space-y-8">
              {/* Category Filter */}
              <div>
                <h3 className="font-['Poppins'] font-semibold text-sm mb-3 uppercase tracking-wider text-gray-500">
                  Category
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`font-['Poppins'] px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedCategories.includes(category)
                          ? "bg-[#8a181a] text-white shadow-md"
                          : isDark
                          ? "bg-white/5 text-gray-300 hover:bg-white/10"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year Filter */}
              <div>
                <h3 className="font-['Poppins'] font-semibold text-sm mb-3 uppercase tracking-wider text-gray-500">
                  Year
                </h3>
                <div className="flex flex-wrap gap-2">
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => toggleYear(year)}
                      className={`font-['Poppins'] px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedYears.includes(year)
                          ? "bg-[#8a181a] text-white shadow-md"
                          : isDark
                          ? "bg-white/5 text-gray-300 hover:bg-white/10"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Genre Filter */}
              <div>
                <h3 className="font-['Poppins'] font-semibold text-sm mb-3 uppercase tracking-wider text-gray-500">
                  Genre
                </h3>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`font-['Poppins'] px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedGenres.includes(genre)
                          ? "bg-[#8a181a] text-white shadow-md"
                          : isDark
                          ? "bg-white/5 text-gray-300 hover:bg-white/10"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className={`px-8 py-7 border-t space-y-3 shrink-0 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
              {activeFilterCount > 0 && (
                <div className="flex items-center justify-between mb-2">
                  <p className="font-['Poppins'] text-sm text-gray-500">
                    {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} selected
                  </p>
                  <button
                    onClick={handleClear}
                    className="font-['Poppins'] text-sm text-[#8a181a] font-semibold hover:underline"
                  >
                    Clear All
                  </button>
                </div>
              )}
              <div className="flex gap-3">
                <motion.button
                  onClick={onClose}
                  className={`font-['Poppins'] flex-1 py-3 rounded-lg font-medium border-2 transition-colors ${
                    isDark
                      ? "bg-white/5 border-gray-600 text-gray-300 hover:bg-white/10"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleApply}
                  className="font-['Poppins'] flex-1 py-3 bg-[#8a181a] text-white rounded-lg font-medium shadow-[0_2px_8px_rgba(138,24,26,0.25)]"
                  whileHover={{ y: -2, boxShadow: "0 6px 16px rgba(138,24,26,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Apply Filters
                </motion.button>
              </div>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
