// -----------------------------------------------------------------------------
// 1. components/Navbar.tsx
// Description: A responsive navigation bar for the application.
// -----------------------------------------------------------------------------
// Create this file in your `src/components/Navbar.tsx` directory

import React, { useState } from 'react';
import { ShoppingCart, User as UserIcon, Search, Menu, X, Briefcase, Info, Home, Rss, FileText, Shield, Handshake, LogIn, LogOut } from 'lucide-react';

interface NavbarProps {
  setCurrentPage: (page: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
}

const NavLink: React.FC<{ href: string; children: React.ReactNode; onClick: () => void; icon?: React.ReactNode }> = ({ href, children, onClick, icon }) => (
  <a
    href={href}
    onClick={(e) => { e.preventDefault(); onClick(); }}
    className="flex items-center text-slate-100 hover:text-sky-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
  >
    {icon && <span className="mr-2">{icon}</span>}
    {children}
  </a>
);

const MobileNavLink: React.FC<{ href: string; children: React.ReactNode; onClick: () => void; icon?: React.ReactNode }> = ({ href, children, onClick, icon }) => (
  <a
    href={href}
    onClick={(e) => { e.preventDefault(); onClick(); }}
    className="flex items-center text-slate-700 hover:bg-sky-100 hover:text-sky-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-150"
  >
    {icon && <span className="mr-2">{icon}</span>}
    {children}
  </a>
);

export const Navbar: React.FC<NavbarProps> = ({ setCurrentPage, isLoggedIn, setIsLoggedIn }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const commonLinks = [
    { name: 'Products', page: 'products', icon: <ShoppingCart size={18} /> },
    { name: 'About Us', page: 'about', icon: <Info size={18} /> },
    { name: 'Blog', page: 'blog', icon: <Rss size={18} /> },
    { name: 'Career', page: 'career', icon: <Briefcase size={18} /> },
  ];

  const footerLinks = [
    { name: 'Policies', page: 'policies', icon: <Shield size={18}/> },
    { name: 'Terms of Service', page: 'terms', icon: <FileText size={18}/> },
    { name: 'Privacy Policy', page: 'privacy', icon: <Shield size={18}/> },
    { name: 'Join as Seller', page: 'join-seller', icon: <Handshake size={18}/> },
  ];

  const handleAuthAction = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      setCurrentPage('home'); // or 'auth'
    } else {
      setCurrentPage('auth');
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-slate-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Home link */}
          <div className="flex items-center">
            <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }} className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-sky-400">YourStore</h1>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <NavLink href="#" onClick={() => setCurrentPage('home')} icon={<Home size={18}/>}>Home</NavLink>
            {commonLinks.map(link => (
              <NavLink key={link.page} href="#" onClick={() => setCurrentPage(link.page)} icon={link.icon}>{link.name}</NavLink>
            ))}
          </div>
          
          {/* Search, Cart, Auth Icons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input 
                type="search" 
                placeholder="Search products..." 
                className="bg-slate-700 text-white placeholder-slate-400 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-slate-600 transition-all duration-300 w-48 sm:w-64"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-slate-400" size={20} />
              </div>
            </div>
            <button onClick={() => setCurrentPage('checkout')} className="relative text-slate-100 hover:text-sky-300 p-2 rounded-full hover:bg-slate-700 transition-colors">
              <ShoppingCart size={24} />
              <span className="absolute top-0 right-0 block h-5 w-5 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center">3</span>
            </button>
            <button onClick={handleAuthAction} className="text-slate-100 hover:text-sky-300 p-2 rounded-full hover:bg-slate-700 transition-colors">
              {isLoggedIn ? <LogOut size={24} /> : <LogIn size={24} />}
            </button>
             {isLoggedIn && <UserIcon className="text-slate-100" size={24} />}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setCurrentPage('checkout')} className="relative text-slate-100 hover:text-sky-300 p-2 rounded-full hover:bg-slate-700 transition-colors mr-2">
              <ShoppingCart size={24} />
              <span className="absolute top-0 right-0 block h-5 w-5 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center">3</span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-100 hover:text-sky-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500 transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="relative px-2 mb-2">
                <input 
                  type="search" 
                  placeholder="Search products..." 
                  className="bg-slate-100 text-slate-700 placeholder-slate-500 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-slate-50 transition-all duration-300 w-full"
                />
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Search className="text-slate-500" size={20} />
                </div>
              </div>
            <MobileNavLink href="#" onClick={() => { setCurrentPage('home'); setIsMobileMenuOpen(false); }} icon={<Home size={18}/>}>Home</MobileNavLink>
            {commonLinks.map(link => (
              <MobileNavLink key={link.page} href="#" onClick={() => { setCurrentPage(link.page); setIsMobileMenuOpen(false); }} icon={link.icon}>{link.name}</MobileNavLink>
            ))}
            <hr className="my-2 border-slate-200"/>
            {footerLinks.map(link => (
              <MobileNavLink key={link.page} href="#" onClick={() => { setCurrentPage(link.page); setIsMobileMenuOpen(false); }} icon={link.icon}>{link.name}</MobileNavLink>
            ))}
            <hr className="my-2 border-slate-200"/>
            <MobileNavLink href="#" onClick={handleAuthAction} icon={isLoggedIn ? <LogOut size={18}/> : <LogIn size={18}/>}>
              {isLoggedIn ? 'Logout' : 'Login / Register'}
            </MobileNavLink>
            {isLoggedIn && (
              <div className="flex items-center px-3 py-2 text-slate-700">
                <UserIcon size={18} className="mr-2"/> Profile
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};