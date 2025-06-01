// src/pages/ProductListingsPage.tsx
import React, { useState, useEffect } from "react"; // Already imported
import { Product as ProductListingType, Category as CategoryTypePLP } from "../types";
import { getProducts } from "../services/productApis";
import { getCategories as getCategoriesPLP } from "../services/utilityApis";
import { ProductCard } from "../components/shared/ProductCard";
import { FilterControls } from "../components/shared/FilterControls";
import { Pagination as PaginationPLP } from "../components/shared/Pagination";
import { NavigateParams } from "../types";
import { useLocation } from "react-router-dom";

interface ProductListingsPageProps {
  onNavigate: (page: string, params?: NavigateParams) => void;
  onAddToCart: (
    productId: string,
    quantity: number,
    price: number,
    name?: string,
    imageUrl?: string,
    size?: string,
    color?: string
  ) => void;
}

const ITEMS_PER_PAGE_PLP = 15;

export const ProductListingsPage: React.FC<ProductListingsPageProps> = ({ onNavigate, onAddToCart }) => {
  const location = useLocation();
  const { initialSearchTerm, categorySlug } = location.state || {};
  
  const [products, setProducts] = useState<ProductListingType[]>([]);
  const [allCategories, setAllCategories] = useState<CategoryTypePLP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentSort, setCurrentSort] = useState("relevance");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(categorySlug);
  const [searchTerm, setSearchTerm] = useState<string | undefined>(initialSearchTerm);
  const [pageTitle, setPageTitle] = useState("All Products");

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating", label: "Average Rating" },
    { value: "newest", label: "Newest Arrivals" },
  ];

  useEffect(() => {
    setSelectedCategory(categorySlug);
    setSearchTerm(initialSearchTerm);
    setCurrentPage(1);
  }, [categorySlug, initialSearchTerm]);

  useEffect(() => {
    getCategoriesPLP()
      .then(setAllCategories)
      .catch((err: Error) => console.error("Failed to load categories for filter", err));
  }, []);

  useEffect(() => {
    const fetchProductsList = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = {
          category: selectedCategory,
          search: searchTerm,
          sort: currentSort,
          page: currentPage,
          limit: ITEMS_PER_PAGE_PLP,
        };
        const response = await getProducts(params);
        setProducts(response.items);
        setTotalItems(response.totalItems);
        setTotalPages(response.totalPages);
        setCurrentPage(response.currentPage);
        if (selectedCategory) {
          const categoryObj = allCategories.find((cat) => cat.slug === selectedCategory);
          setPageTitle(categoryObj ? categoryObj.name : "Products");
        } else if (searchTerm) {
          setPageTitle(`Search results for "${searchTerm}"`);
        } else {
          setPageTitle("All Products");
        }
      } catch (err: any) {
        console.error("Failed to fetch products:", err);
        setError(err.message || "Could not load products.");
      } finally {
        setIsLoading(false);
      }
    };
    if (allCategories.length > 0 || !selectedCategory || initialSearchTerm) {
      fetchProductsList();
    } else if (selectedCategory && allCategories.length === 0) {
      setPageTitle("Products");
    }
  }, [currentPage, currentSort, selectedCategory, searchTerm, allCategories, initialSearchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  const handleSortChange = (sortValue: string) => {
    setCurrentSort(sortValue);
    setCurrentPage(1);
  };

  if (isLoading && products.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
        <p className="ml-3 text-slate-700">Loading Products...</p>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-4 text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Error Loading Products</h2>
        <p className="text-slate-600 mb-4">{error}</p>
        <button onClick={() => onNavigate("landing")} className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
          Go to Homepage
        </button>
      </div>
    );

  return (
    <div className="bg-stone-50 py-8">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">{pageTitle}</h1>
        </header>
        <FilterControls sortOptions={sortOptions} currentSort={currentSort} onSortChange={handleSortChange} totalItems={totalItems} />
        {isLoading && <div className="text-center py-10 text-slate-600">Updating products...</div>}
        {!isLoading && products.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-slate-700 mb-3">No Products Found</h2>
            <p className="text-slate-500">Try adjusting your filters or search term.</p>
            {selectedCategory && (
              <button onClick={() => onNavigate("products")} className="mt-4 text-green-600 hover:underline">
                View All Products
              </button>
            )}
          </div>
        )}
        {products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onNavigate={onNavigate} onAddToCart={onAddToCart} />
            ))}
          </div>
        )}
        {totalPages > 1 && <PaginationPLP currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
      </main>
    </div>
  );
};
