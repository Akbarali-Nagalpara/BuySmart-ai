import { useState } from 'react';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';

interface SearchFiltersProps {
  onApplyFilters: (filters: FilterState) => void;
}

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sortBy: string;
  brands: string[];
}

export function SearchFilters({ onApplyFilters }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    minPrice: 0,
    maxPrice: 100000,
    minRating: 0,
    sortBy: 'relevance',
    brands: [],
  });

  const categories = [
    'All Categories',
    'Electronics',
    'Fashion',
    'Home & Kitchen',
    'Books',
    'Sports',
    'Beauty',
    'Toys',
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'reviews', label: 'Most Reviews' },
  ];

  const popularBrands = ['Samsung', 'Apple', 'Sony', 'LG', 'Nike', 'Adidas'];

  const handleApply = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const defaultFilters: FilterState = {
      category: 'all',
      minPrice: 0,
      maxPrice: 100000,
      minRating: 0,
      sortBy: 'relevance',
      brands: [],
    };
    setFilters(defaultFilters);
    onApplyFilters(defaultFilters);
  };

  const toggleBrand = (brand: string) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand],
    }));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
      >
        <SlidersHorizontal className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filters</span>
        {(filters.brands.length > 0 || filters.category !== 'all' || filters.minRating > 0) && (
          <span className="ml-1 px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full">
            {filters.brands.length + (filters.category !== 'all' ? 1 : 0) + (filters.minRating > 0 ? 1 : 0)}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Filter Panel */}
          <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Filters</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
              >
                <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </button>
            </div>

            <div className="space-y-6 max-h-96 overflow-y-auto">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat.toLowerCase().replace(' ', '-')}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Minimum Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFilters({ ...filters, minRating: rating })}
                      className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                        filters.minRating === rating
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {rating}★
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Brands
                </label>
                <div className="space-y-2">
                  {popularBrands.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.brands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleApply}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
