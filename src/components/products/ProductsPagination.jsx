import React from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductsPagination = ({ 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange 
}) => {
  // Note: Since API doesn't return total count, we'll show basic pagination
  // For full pagination, you'd need the total count from the API
  const hasNextPage = totalItems === itemsPerPage;
  const hasPrevPage = currentPage > 1;

  return (
    <div className="flex items-center justify-center gap-4 mt-12">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className="border-2 border-stone-300 hover:bg-stone-50 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Previous
      </Button>

      <div className="flex items-center gap-2">
        <span className="text-stone-600">Page</span>
        <span className="font-semibold text-stone-900 bg-emerald-50 px-4 py-2 rounded-sm border border-emerald-200">
          {currentPage}
        </span>
      </div>

      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="border-2 border-stone-300 hover:bg-stone-50 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
        <ChevronRight className="w-5 h-5 ml-1" />
      </Button>
    </div>
  );
};

export default ProductsPagination;