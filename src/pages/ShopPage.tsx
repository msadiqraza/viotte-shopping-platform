// src/pages/ShopPage.tsx
import React, { useState, useEffect } from "react";
import { Shop, Product as ShopProductType } from "../types";
import { getProducts } from "../services/productApis";
import { getMainShopDetails } from "../services/shopApis";
import { ShopHeader } from "../components/shop/ShopHeader";
import { ShopNavigationTabs } from "../components/shop/ShopNavigationTabs";
import { ProductCard as ShopProductCard } from "../components/shared/ProductCard";
import { FilterControls as ShopFilterControls } from "../components/shared/FilterControls";
import { Pagination as ShopPagination } from "../components/shared/Pagination";
import { ShopAboutSection } from "../components/shop/ShopAboutSection";
import { ShopPoliciesSection } from "../components/shop/ShopPoliciesSection";
import { NavigateParams } from "../types";

const MAIN_SHOP_PRODUCTS_PER_PAGE = 15;
interface ShopPageProps {
  onNavigate: (page: string, params?: NavigateParams) => void;
}
type MainShopActiveTab = "products" | "about" | "policies";

export const ShopPage: React.FC<ShopPageProps> = ({ onNavigate }) => {
  const [mainShop, setMainShop] = useState<Shop | null>(null);
  const [shopProducts, setShopProducts] = useState<ShopProductType[]>([]);
  const [isLoadingShop, setIsLoadingShop] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<MainShopActiveTab>("products");
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const [totalProductPages, setTotalProductPages] = useState(1);
  const [totalShopProducts, setTotalShopProducts] = useState(0);
  const [currentProductSort, setCurrentProductSort] = useState("relevance");
  const [shopProductSearchTerm, setShopProductSearchTerm] = useState<string | undefined>();
  const [policies, setPolicies] = useState({
    shipping: "",
    returns: "",
    payment: "",
  });
  const productSortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating", label: "Average Rating" },
    { value: "newest", label: "Newest Arrivals" },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchMainShopDetails = async () => {
      setIsLoadingShop(true);
      setError(null);
      try {
        const shopData = await getMainShopDetails();
        if (shopData) {
          setPolicies({
            shipping: shopData.policies_shipping,
            returns: shopData.policies_returns,
            payment: shopData.policies_payment,
          });
        }
        setMainShop(shopData);
      } catch (err: any) {
        console.error("Failed to fetch main shop details:", err);
        setError(err.message || "Could not load store information.");
      } finally {
        setIsLoadingShop(false);
      }
    };
    fetchMainShopDetails();
  }, []);

  useEffect(() => {
    if (mainShop && activeTab === "products") {
      const fetchProductsForMainStore = async () => {
        setIsLoadingProducts(true);
        try {
          const params = {
            shopId: mainShop.id,
            // sort: currentProductSort,
            page: currentProductPage,
            limit: MAIN_SHOP_PRODUCTS_PER_PAGE,
            search: shopProductSearchTerm,
          };
          const response = await getProducts(params);
          setShopProducts(response.items);
          setTotalShopProducts(response.totalItems);
          setTotalProductPages(response.totalPages);
          setCurrentProductPage(response.currentPage);
        } catch (err) {
          console.error(`Failed to fetch products for the main store:`, err);
        } finally {
          setIsLoadingProducts(false);
        }
      };
      fetchProductsForMainStore();
    }
  }, [mainShop, activeTab, currentProductPage, currentProductSort, shopProductSearchTerm]);

  const handleProductPageChange = (page: number) => {
    setCurrentProductPage(page);
    window.scrollTo(0, 200);
  };
  const handleProductSortChange = (sortValue: string) => {
    setCurrentProductSort(sortValue);
    setCurrentProductPage(1);
  };
  const handleShopProductSearch = (searchTerm: string) => {
    setShopProductSearchTerm(searchTerm);
    setCurrentProductPage(1);
  };

  if (isLoadingShop)
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
        <p className="ml-3 text-slate-700">Loading Store Information...</p>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-4 text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Error Loading Store</h2>
        <p className="text-slate-600 mb-4">{error}</p>
        <button onClick={() => onNavigate("landing")} className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
          Go to Homepage
        </button>
      </div>
    );
  if (!mainShop)
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-slate-700 text-xl">Store information not found.</p>
      </div>
    );

  return (
    <div className="bg-stone-50 min-h-screen">
      <ShopHeader shop={mainShop} onNavigate={onNavigate} />
      <main className="max-w-7xl mx-auto pb-12">
        <ShopNavigationTabs activeTab={activeTab} onTabChange={setActiveTab} onSearch={handleShopProductSearch} shopName={mainShop.name} />
        <div className="mt-0 px-4 sm:px-6 lg:px-8">
          {activeTab === "products" && (
            <div className="py-8">
              <ShopFilterControls
                sortOptions={productSortOptions}
                currentSort={currentProductSort}
                onSortChange={handleProductSortChange}
                totalItems={totalShopProducts}
              />
              {isLoadingProducts ? (
                <div className="text-center py-10 text-slate-600">Loading products...</div>
              ) : shopProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                    {shopProducts.map((product) => (
                      <ShopProductCard key={product.id} product={product} onNavigate={onNavigate} />
                    ))}
                  </div>
                  {totalProductPages > 1 && (
                    <ShopPagination currentPage={currentProductPage} totalPages={totalProductPages} onPageChange={handleProductPageChange} />
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <h3 className="text-xl font-semibold text-slate-600">No products found in our store.</h3>
                  {shopProductSearchTerm && <p className="text-slate-500">Try a different search term.</p>}
                </div>
              )}
            </div>
          )}
          {activeTab === "about" && <ShopAboutSection description={mainShop.description} shopName={mainShop.name} />}
          {activeTab === "policies" && <ShopPoliciesSection policies={policies} />}
        </div>
      </main>
    </div>
  );
};
