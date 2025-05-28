// src/components/layout/Navbar.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  CreditCardIcon,
  BriefcaseIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { getCategories } from "../../services/utilityApis";
import { Category, NavbarProps, NavigateParams } from "../../types"; // Assuming NavbarProps is defined in types
import { useAuth } from "../../contexts/AuthContext"; // Adjust path as needed
import { isCurrentUserAdmin } from "../../services/adminApis"; // Adjust path as needed

type NavLink = {
  name: string;
  page: string;
  dropdown?: boolean;
  isAccountLink?: boolean;
  separatorBefore?: boolean;
  icon?: React.ComponentType<{ size: number; className?: string }>;
};

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const categoriesDropdownRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!authLoading && user) {
      isCurrentUserAdmin().then(setIsAdmin);
    } else if (!user && !authLoading) {
      // Ensure to reset if user logs out or on initial load without user
      setIsAdmin(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    // Fetch categories only once or if they are not already loaded
    if (categories.length === 0) {
      getCategories()
        .then(setCategories)
        .catch((err) => console.error("Failed to load categories for Navbar", err));
    }
  }, [categories.length]); // Dependency on categories.length to prevent re-fetch if already loaded

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoriesDropdownRef.current &&
        !categoriesDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoriesDropdownOpen(false);
      }
    };
    if (isCategoriesDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCategoriesDropdownOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Pass searchTerm as initialSearchTerm, consistent with ProductListingsPage prop
      onNavigate("products", { initialSearchTerm: searchTerm.trim() });
      setSearchTerm("");
      setIsMobileMenuOpen(false);
    }
  };

  const handleNav = (page: string, params?: NavigateParams) => {
    setIsMobileMenuOpen(false);
    setIsCategoriesDropdownOpen(false);
    onNavigate(page, params);
  };

  const toggleCategoriesDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCategoriesDropdownOpen((prev) => !prev);
  };

  // Main navigation links for desktop (second row)
  const mainDesktopNavLinks: NavLink[] = [
    { name: "Categories", page: "categories-dropdown", dropdown: true },
    { name: "Shop", page: "shop" },
    { name: "About Us", page: "about" },
    { name: "Blog", page: "blog" }, // Ensured Blog link is included
  ];

  // Links for the mobile menu (includes main links and additional ones)
  const mobileNavLinks: NavLink[] = [
    ...mainDesktopNavLinks, // Includes Categories (which will need special handling for dropdown in mobile)
    // Separator and account related links
    { name: "Account", page: "account", isAccountLink: true, separatorBefore: true },
    // { name: "Wishlist", page: "wishlist" }, // Assuming wishlist is not a primary nav item for now
    { name: "Cart", page: "cart" },
    // Separator and other utility links
    { name: "My Credits", page: "credits", icon: CreditCardIcon, separatorBefore: true },
    { name: "Partner Program", page: "join-seller", icon: BriefcaseIcon },
  ];
  if (isAdmin) {
    mobileNavLinks.push({ name: "Admin Panel", page: "admin", icon: ShieldCheckIcon });
  }

  return (
    <nav className="bg-green-700 text-white shadow-md sticky top-0 z-50">
      {/* Top Bar: Logo, Search (Desktop), Main Icons (Desktop), Mobile Menu Toggle */}
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
            viotte {/* Or your actual logo/brand name */}
          </a>
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="search"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-green-600 placeholder-green-300 text-white rounded-md py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-green-500"
              />
              <button
                type="submit"
                className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer"
              >
                <Search size={20} className="text-green-300" />
              </button>
            </form>
          </div>
          <div className="hidden md:flex items-center space-x-5 lg:space-x-6">
            {isAdmin && (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav("admin");
                }}
                className="hover:text-green-300 relative flex flex-col items-center text-center px-1"
                title="Admin Panel"
              >
                <ShieldCheckIcon size={24} />{" "}
                <span className="text-xs mt-0.5 leading-tight">Admin</span>
              </a>
            )}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNav(user ? "account" : "login", user ? undefined : { returnUrl: "/account" });
              }}
              className="hover:text-green-300 relative flex flex-col items-center text-center px-1"
              title="My Account"
            >
              <User size={24} /> <span className="text-xs mt-0.5 leading-tight">Account</span>
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNav("cart");
              }}
              className="hover:text-green-300 relative flex flex-col items-center text-center px-1"
              title="Shopping Cart"
            >
              <ShoppingCart size={24} /> <span className="text-xs mt-0.5 leading-tight">Cart</span>
              {/* TODO: get cart count dynamically */}
              {/* <span className="absolute -top-1 -right-1.5 h-4 w-4 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center">0</span> */}
            </a>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md hover:bg-green-600 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Secondary Links Bar (Categories, Shop, About, Blog) */}
      <div className="hidden md:flex bg-green-700 border-t border-green-600">
        <div className="max-w-7xl mx-auto flex justify-center items-center space-x-6 px-4 h-12">
          {mainDesktopNavLinks.map((link) =>
            link.dropdown && link.name === "Categories" ? (
              <div key={link.page} className="relative" ref={categoriesDropdownRef}>
                <button
                  onClick={toggleCategoriesDropdown}
                  onMouseEnter={() => setIsCategoriesDropdownOpen(true)} // Keep hover to open for desktop
                  // onMouseLeave can be added to the button and dropdown div to manage closing
                  className="text-sm font-medium hover:text-green-300 py-3 flex items-center focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={isCategoriesDropdownOpen}
                >
                  {link.name}{" "}
                  <ChevronDown
                    size={16}
                    className={`ml-1 transition-transform duration-200 ${
                      isCategoriesDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isCategoriesDropdownOpen && (
                  <div
                    onMouseLeave={() => setIsCategoriesDropdownOpen(false)} // Close on mouse leave from dropdown itself
                    className="absolute left-0 mt-0 min-w-[200px] max-w-xs rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20"
                  >
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="categories-menu-button"
                    >
                      {categories.length > 0 ? (
                        categories.map((cat) => (
                          <a
                            key={cat.id}
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleNav("products", { categorySlug: cat.slug });
                            }}
                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-green-100 hover:text-green-700 rounded mx-1 my-0.5"
                            role="menuitem"
                          >
                            {cat.name}
                          </a>
                        ))
                      ) : (
                        <span className="block px-4 py-2 text-sm text-slate-500">Loading...</span>
                      )}
                      <div className="border-t border-slate-100 my-1"></div>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleNav("products");
                        }}
                        className="block px-4 py-2 text-sm text-slate-700 font-semibold hover:bg-green-100 hover:text-green-700 rounded mx-1 my-0.5"
                        role="menuitem"
                      >
                        All Products
                      </a>
                    </div>
                  </div>
                )}
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
            <form onSubmit={handleSearchSubmit} className="relative mb-2">
              <input
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-green-600 placeholder-green-300 text-white rounded-md py-2 px-3 pl-10 focus:outline-none focus:ring-1 focus:ring-green-400"
              />
              <button
                type="submit"
                className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer"
              >
                <Search size={18} className="text-green-300" />
              </button>
            </form>
            {mobileNavLinks.map((link, index) => (
              <React.Fragment key={link.page + index}>
                {link.separatorBefore && <hr className="my-2 border-green-600" />}
                {link.dropdown && link.name === "Categories" ? (
                  // Simplified categories for mobile: just list them, or make a collapsible section
                  <div>
                    <button
                      onClick={toggleCategoriesDropdown}
                      className="w-full text-left block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 flex items-center justify-between"
                    >
                      {link.name}{" "}
                      <ChevronDown
                        size={16}
                        className={`${isCategoriesDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isCategoriesDropdownOpen && (
                      <div className="pl-4 mt-1 space-y-1">
                        {categories.length > 0 ? (
                          categories.map((cat) => (
                            <a
                              key={cat.id}
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleNav("products", { categorySlug: cat.slug });
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
                    )}
                  </div>
                ) : (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (link.isAccountLink) {
                        handleNav(
                          user ? "account" : "login",
                          user ? undefined : { returnUrl: "/account" }
                        );
                      } else {
                        handleNav(link.page);
                      }
                    }}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 ${
                      link.icon ? "text-sm" : ""
                    }`}
                  >
                    {link.icon && <link.icon size={18} className="mr-2 opacity-80" />}
                    {link.name}
                  </a>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
