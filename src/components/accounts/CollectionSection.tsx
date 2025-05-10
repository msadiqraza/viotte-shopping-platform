// --- src/components/account/CollectionSection.tsx ---
import { getUserCollection } from "../../services/accountApis"; // Ensure this is correctly imported
import { useState, useEffect } from "react";
import { CollectionItem, CollectionSectionProps } from "../../types";
import { Heart, Search as SearchIconAcc } from "lucide-react";
import { Pagination } from "../../components/shared/Pagination";
import { FilterControls } from "../../components/shared/FilterControls";
import { ProductCard } from "../../components/shared/ProductCard";

export const CollectionSection: React.FC<CollectionSectionProps> = ({ onNavigate }) => {
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentSort, setCurrentSort] = useState("dateAdded-desc");
  const [searchTerm, setSearchTerm] = useState("");
  const ITEMS_PER_PAGE_COLLECTION = 10;
  const sortOptions = [
    { value: "dateAdded-desc", label: "Recently Added" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rating" },
  ];
  useEffect(() => {
    const fetchCollection = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getUserCollection({ page: currentPage, limit: ITEMS_PER_PAGE_COLLECTION, sort: currentSort, search: searchTerm || undefined });
        setCollectionItems(response.items);
        setTotalItems(response.totalItems);
        setTotalPages(response.totalPages);
      } catch (err: any) {
        setError(err.message || "Could not load collection.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCollection();
  }, [currentPage, currentSort, searchTerm]);
  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleSortChange = (sortValue: string) => {
    setCurrentSort(sortValue);
    setCurrentPage(1);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };
  if (isLoading && collectionItems.length === 0)
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p>Loading your collection...</p>
      </div>
    );
  if (error)
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-slate-200">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">My Collection</h2>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <FilterControls sortOptions={sortOptions} currentSort={currentSort} onSortChange={handleSortChange} totalItems={totalItems} />
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-auto sm:max-w-xs">
          <input
            type="search"
            placeholder="Search collection..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-slate-50 border border-slate-300 placeholder-slate-400 text-slate-700 rounded-md py-2 px-3 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          />
          <button type="submit" className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-green-600">
            <SearchIconAcc size={18} />
          </button>
        </form>
      </div>
      {collectionItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {collectionItems.map((item) => (
              <ProductCard key={item.id} product={item} onNavigate={onNavigate} />
            ))}
          </div>
          {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
        </>
      ) : (
        <div className="text-center py-10">
          <Heart size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 text-lg">Your collection is empty.</p>
          <p className="text-sm text-slate-400 mt-1">Start adding your favorite products to see them here!</p>
          <button
            onClick={() => onNavigate?.("products")}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md transition-colors"
          >
            Browse Products
          </button>
        </div>
      )}
    </div>
  );
};
