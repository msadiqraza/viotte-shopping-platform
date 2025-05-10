// src/components/layout/Navbar.tsx
import React, { useState, useEffect } from "react";
import { Search, ShoppingCart, User, Heart, Menu, X, ChevronDown } from "lucide-react";
// import { getCategories } from "../../services/utilityApis";
import { Category, CollectionSectionProps as NavbarProps } from "../../types";

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const handleNav = (page: string, params?: any) => {
    setIsMobileMenuOpen(false);
    onNavigate?.(page, params);
  };

  const mainNavLinks = [
    { name: "Categories", page: "categories", dropdown: true },
    { name: "Shop", page: "shop" },
    { name: "Avout us", page: "account" }, // point it to collection
    { name: "Blog", page: "blog" }, //
  ];

  const categoriesList: Category[] = [
    {
      id: "1",
      name: "All",
      slug: "all",
      productCount: 0,
      imageUrl: "",
    },
    {
      id: "2",
      name: "Men",
      slug: "men",
      productCount: 0,
      imageUrl: "",
    },
    {
      id: "3",
      name: "Women",
      slug: "women",
      productCount: 0,
      imageUrl: "",
    },
    {
      id: "4",
      name: "Kids",
      slug: "kids",
      productCount: 0,
      imageUrl: "",
    },
  ]

  useEffect(() => {
      // getCategories()
      //   .then(setCategories)
      //   .catch((err) => console.error("Failed to load categories for Navbar", err));
      
      if(categories.length === 0){
        setCategories(categoriesList);
      }
    }, []);

  return (
    <nav className="bg-green-700 text-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-green-800 text-sm py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <button className="flex items-center hover:text-green-300">
                English <ChevronDown size={16} className="ml-1" />
              </button>
              <div className="absolute left-0 mt-1 bg-white text-slate-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 p-1 min-w-[100px]">
                <a href="#" onClick={(e) => e.preventDefault()} className="block px-3 py-1.5 text-xs hover:bg-green-100 rounded">
                  Spanish
                </a>
              </div>
            </div>
            <div className="relative group">
              <button className="flex items-center hover:text-green-300">
                USD <ChevronDown size={16} className="ml-1" />
              </button>
              <div className="absolute left-0 mt-1 bg-white text-slate-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 p-1 min-w-[100px]">
                <a href="#" onClick={(e) => e.preventDefault()} className="block px-3 py-1.5 text-xs hover:bg-green-100 rounded">
                  EUR
                </a>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNav("credits");
              }}
              className="hover:text-green-300 text-xs"
            >
              Check-in to earn credits
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNav("partner-program");
              }}
              className="hover:text-green-300 text-xs"
            >
              Partner Program
            </a>
          </div>
        </div>
      </div>
      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNav("");
            }}
            className="text-2xl font-bold text-white"
          >
            LOGO
          </a>
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Search for products..."
                className="w-full bg-green-600 placeholder-green-300 text-white rounded-md py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-green-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-green-300" />
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-7">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNav("account");
              }}
              className="hover:text-green-300 relative w-11 flex flex-col items-center"
            >
              <User size={24} /> <span className="text-xs">Account</span>
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNav("wishlist");
              }}
              className="hover:text-green-300 relative w-11 flex flex-col items-center"
            >
              <Heart size={24} /> <span className="text-xs">Wishlist</span>
              <span className="absolute -top-1 -right-1.5 h-4 w-4 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center">2</span>
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNav("cart");
              }}
              className="hover:text-green-300 relative w-11 flex flex-col items-center"
            >
              <ShoppingCart size={24} /> <span className="text-xs">Cart</span>
              <span className="absolute -top-1 -right-1.5 h-4 w-4 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center">3</span>
            </a>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md hover:bg-green-600 focus:outline-none">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* Desktop Category/Main Links Bar */}
      <div className="hidden md:flex bg-green-700 border-t border-green-600">
        <div className="max-w-7xl mx-auto flex justify-center items-center space-x-6 px-4 h-12">
          {mainNavLinks.map((link) =>
            link.dropdown && link.name === "Categories" ? (
              <div key={link.page} className="relative group">
                <button className="text-sm font-medium hover:text-green-300 py-3 flex items-center">
                  {link.name} <ChevronDown size={16} className="ml-1" />
                </button>
                <div className="absolute left-0 mt-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 transform scale-95 group-hover:scale-100 origin-top-left">
                  <div className="py-1">
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <a
                          key={cat.id}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleNav("products", { category: cat.slug });
                          }}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-green-100 hover:text-green-700"
                        >
                          {cat.name}
                        </a>
                      ))
                    ) : (
                      <span className="block px-4 py-2 text-sm text-slate-500">Loading...</span>
                    )}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNav("products");
                      }}
                      className="block px-4 py-2 text-sm text-slate-700 font-semibold hover:bg-green-100 hover:text-green-700"
                    >
                      All Products
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={link.page}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(link.page);
                }}
                className="text-sm font-medium hover:text-green-300 py-3"
              >
                {link.name}
              </a>
            )
          )}
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-green-700 border-t border-green-600">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="relative mb-2">
              <input
                type="search"
                placeholder="Search..."
                className="w-full bg-green-600 placeholder-green-300 text-white rounded-md py-2 px-3 pl-10 focus:outline-none focus:ring-1 focus:ring-green-400"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-green-300" />
              </div>
            </div>
            {mainNavLinks.map((link) =>
              link.dropdown && link.name === "Categories" ? (
                <div key={link.page} className="relative group">
                  <button className="w-full text-left block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 flex items-center justify-between">
                    {link.name} <ChevronDown size={16} />
                  </button>
                  <div className="pl-4 mt-1 space-y-1">
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <a
                          key={cat.id}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleNav("products", { category: cat.slug });
                          }}
                          className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600"
                        >
                          {cat.name}
                        </a>
                      ))
                    ) : (
                      <span className="block px-3 py-2 text-sm text-slate-300">Loading...</span>
                    )}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNav("products");
                      }}
                      className="block px-3 py-2 rounded-md text-sm font-semibold hover:bg-green-600"
                    >
                      All Products
                    </a>
                  </div>
                </div>
              ) : (
                <a
                  key={link.page}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(link.page);
                  }}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600"
                >
                  {link.name}
                </a>
              )
            )}
            <hr className="my-2 border-green-600" />
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNav("account");
              }}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600"
            >
              Account
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNav("wishlist");
              }}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600"
            >
              Wishlist
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNav("cart");
              }}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600"
            >
              Cart
            </a>
            <hr className="my-2 border-green-600" />
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNav("credits");
              }}
              className="block px-3 py-2 rounded-md text-sm hover:bg-green-600"
            >
              Check-in to earn credits
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNav("partner-program");
              }}
              className="block px-3 py-2 rounded-md text-sm hover:bg-green-600"
            >
              Partner Program
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
