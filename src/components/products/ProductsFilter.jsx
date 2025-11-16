import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const ProductsFilter = ({ onFilterChange, currentFilters }) => {
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || '');
  const [minPrice, setMinPrice] = useState(currentFilters.min_price || '');
  const [maxPrice, setMaxPrice] = useState(currentFilters.max_price || '');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onFilterChange({
      search: searchTerm,
      min_price: minPrice ? parseFloat(minPrice) : undefined,
      max_price: maxPrice ? parseFloat(maxPrice) : undefined,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    onFilterChange({
      search: undefined,
      min_price: undefined,
      max_price: undefined,
    });
  };

  const hasActiveFilters = searchTerm || minPrice || maxPrice;

  return (
    <div className="mb-8">
      <div className="bg-white rounded-sm shadow-md p-6 border border-stone-100">
        {/* Search bar - always visible */}
        <form onSubmit={handleSearch} className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search essential oils..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 rounded-sm border-stone-300 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <Button 
            type="submit"
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 h-12 rounded-sm"
          >
            Search
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="border-2 border-stone-300 hover:bg-stone-50 px-6 h-12 rounded-sm"
          >
            <SlidersHorizontal className="w-5 h-5 mr-2" />
            Filters
          </Button>
        </form>

        {/* Advanced filters - toggleable */}
        {showFilters && (
          <div className="pt-4 border-t border-stone-200">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Price range */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Price Range
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="rounded-sm border-stone-300 focus:border-emerald-500 focus:ring-emerald-500"
                    min="0"
                    step="0.01"
                  />
                  <span className="text-stone-500">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="rounded-sm border-stone-300 focus:border-emerald-500 focus:ring-emerald-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Apply/Clear buttons */}
              <div className="flex items-end gap-2">
                <Button
                  onClick={handleSearch}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-sm"
                >
                  Apply Filters
                </Button>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="border-2 border-stone-300 hover:bg-stone-50 rounded-sm"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-stone-200">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-stone-600 font-medium">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full">
                  Search: "{searchTerm}"
                </span>
              )}
              {minPrice && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full">
                  Min: ${minPrice}
                </span>
              )}
              {maxPrice && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full">
                  Max: ${maxPrice}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsFilter;