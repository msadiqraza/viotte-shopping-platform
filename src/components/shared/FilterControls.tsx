// --- src/components/shared/FilterControls.tsx ---
// (Previously in products, moved to shared as it's used by multiple listing contexts)
import React from "react"; // Already imported
import { ChevronDown as ChevronDownIconF } from "lucide-react";

interface FilterControlsProps {
  sortOptions: { value: string; label: string }[];
  currentSort: string;
  onSortChange: (sortValue: string) => void;
  totalItems?: number;
  // Potentially add more generic filter props here if needed
}
export const FilterControls: React.FC<FilterControlsProps> = ({ sortOptions, currentSort, onSortChange, totalItems }) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row justify-between items-center p-4 bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="text-sm text-slate-600 mb-2 sm:mb-0">{totalItems !== undefined ? `${totalItems} items found` : "Filtering options"}</div>
      <div className="flex items-center space-x-3">
        <label htmlFor="sort-by" className="text-sm font-medium text-slate-700">
          Sort by:
        </label>
        <div className="relative">
          <select
            id="sort-by"
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none w-full sm:w-auto bg-white border border-slate-300 text-slate-700 py-2 pl-3 pr-8 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDownIconF size={18} className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
