// --- src/components/shared/Pagination.tsx ---
import React from "react"; // Already imported
import { ChevronLeft as ChevronLeftIconP, ChevronRight as ChevronRightIconP } from "lucide-react"; // Renamed

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  const pageNumbers = [];
  const maxPagesToShow = 7;
  if (totalPages <= maxPagesToShow) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  } else {
    pageNumbers.push(1);
    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);
    if (currentPage - 1 <= 2) endPage = Math.min(totalPages - 1, maxPagesToShow - 2);
    if (totalPages - currentPage <= 2) startPage = Math.max(2, totalPages - (maxPagesToShow - 3));
    if (startPage > 2) pageNumbers.push(-1);
    for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
    if (endPage < totalPages - 1) pageNumbers.push(-1);
    pageNumbers.push(totalPages);
  }
  return (
    <nav className="mt-10 flex justify-center items-center space-x-1" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
      >
        <ChevronLeftIconP size={16} className="mr-1" /> Previous
      </button>
      {pageNumbers.map((page, index) =>
        page === -1 ? (
          <span key={`ellipsis-${index}`} className="px-3 py-2 text-sm text-slate-500">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 text-sm font-medium border rounded-md transition-colors ${
              currentPage === page
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:border-slate-400"
            }`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
      >
        Next <ChevronRightIconP size={16} className="ml-1" />
      </button>
    </nav>
  );
};
