// -----------------------------------------------------------------------------
// 3. pages/ProductListingsPage.tsx
// Description: Page to display a list of products with filtering and sorting.
// -----------------------------------------------------------------------------
// Create this file in your `src/pages/ProductListingsPage.tsx` directory

import React, { useState } from 'react';
import { Product } from '../types'; // Assuming types are in src/types
import { Filter, Star, ChevronDown, ChevronUp, List, Grid } from 'lucide-react';

const placeholderProducts: Product[] = [
  { id: '1', name: 'Elegant Smartwatch', description: 'Stay connected in style.', price: 199.99, imageUrl: 'https://placehold.co/400x400/3498db/ffffff?text=Smartwatch', category: 'Electronics', rating: 4.5, stock: 50 },
  { id: '2', name: 'Wireless Headphones', description: 'Immersive sound experience.', price: 129.50, imageUrl: 'https://placehold.co/400x400/2ecc71/ffffff?text=Headphones', category: 'Electronics', rating: 4.2, stock: 30 },
  { id: '3', name: 'Organic Cotton T-Shirt', description: 'Comfortable and eco-friendly.', price: 29.99, imageUrl: 'https://placehold.co/400x400/e74c3c/ffffff?text=T-Shirt', category: 'Apparel', rating: 4.8, stock: 100 },
  { id: '4', name: 'Modern Coffee Maker', description: 'Brew the perfect cup.', price: 79.00, imageUrl: 'https://placehold.co/400x400/f39c12/ffffff?text=Coffee+Maker', category: 'Home Goods', rating: 4.0, stock: 20 },
  { id: '5', name: 'Yoga Mat Premium', description: 'Non-slip, eco-friendly mat.', price: 45.00, imageUrl: 'https://placehold.co/400x400/9b59b6/ffffff?text=Yoga+Mat', category: 'Sports', rating: 4.6, stock: 60 },
  { id: '6', name: 'Leather Backpack', description: 'Stylish and durable for everyday use.', price: 150.00, imageUrl: 'https://placehold.co/400x400/7f8c8d/ffffff?text=Backpack', category: 'Accessories', rating: 4.3, stock: 25 },
];

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star key={i} size={16} className={`${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
      );
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col">
      <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x400/cccccc/ffffff?text=Image+Not+Found')} />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-slate-800 mb-1 truncate">{product.name}</h3>
        <p className="text-sm text-slate-600 mb-2 flex-grow">{product.description.substring(0,50)}...</p>
        <div className="flex items-center mb-2">
          {renderStars(product.rating)}
          <span className="ml-2 text-sm text-slate-500">({product.rating.toFixed(1)})</span>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <p className="text-xl font-bold text-sky-600">${product.price.toFixed(2)}</p>
          <button className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors duration-150">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="py-4 border-b border-slate-200">
      <button onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center w-full text-left">
        <h4 className="text-md font-semibold text-slate-700">{title}</h4>
        {isOpen ? <ChevronUp size={20} className="text-slate-500"/> : <ChevronDown size={20} className="text-slate-500"/>}
      </button>
      {isOpen && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
};

export const ProductListingsPage: React.FC = () => {
  const [products] = useState<Product[]>(placeholderProducts);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');


  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-600">Browse our curated selection of high-quality products.</p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4 px-4 sm:px-0">
            <button 
              onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
              className="w-full flex items-center justify-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
            >
              <Filter size={20} className="mr-2" />
              {isFilterSidebarOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Filters Sidebar */}
          <aside className={`lg:w-1/4 xl:w-1/5 ${isFilterSidebarOpen ? 'block' : 'hidden'} lg:block px-4 sm:px-0`}>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-slate-800 mb-4 border-b pb-2">Filters</h3>
              <FilterSection title="Category">
                {['Electronics', 'Apparel', 'Home Goods', 'Sports', 'Accessories'].map(cat => (
                  <label key={cat} className="flex items-center text-sm text-slate-600 hover:text-sky-600 cursor-pointer">
                    <input type="checkbox" className="h-4 w-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500 mr-2"/>
                    {cat}
                  </label>
                ))}
              </FilterSection>
              <FilterSection title="Price Range">
                 <input type="range" min="0" max="500" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500"/>
                 <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>$0</span>
                    <span>$500+</span>
                 </div>
              </FilterSection>
              <FilterSection title="Rating">
                {[5, 4, 3, 2, 1].map(rating => (
                  <label key={rating} className="flex items-center text-sm text-slate-600 hover:text-sky-600 cursor-pointer">
                    <input type="checkbox" className="h-4 w-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500 mr-2"/>
                    <span className="flex">{Array(rating).fill(0).map((_,i) => <Star key={i} size={16} className="text-yellow-400 fill-yellow-400"/>)}</span>
                    <span className="ml-1">& Up</span>
                  </label>
                ))}
              </FilterSection>
              <button className="mt-6 w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150">
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Product Grid / List */}
          <div className="flex-1">
            {/* Toolbar: Sort, View Mode */}
            <div className="flex items-center justify-between mb-6 px-4 sm:px-0">
              <p className="text-sm text-slate-600">Showing {products.length} products</p>
              <div className="flex items-center space-x-2">
                <select className="text-sm border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500">
                  <option>Sort by relevance</option>
                  <option>Sort by price: low to high</option>
                  <option>Sort by price: high to low</option>
                  <option>Sort by rating</option>
                </select>
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-sky-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
                  <Grid size={20}/>
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-sky-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
                  <List size={20}/>
                </button>
              </div>
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 px-4 sm:px-0">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
                </div>
            ) : (
                <div className="space-y-6 px-4 sm:px-0">
                    {products.map(product => (
                        <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex transform hover:shadow-xl transition-shadow duration-300 ease-in-out">
                            <img src={product.imageUrl} alt={product.name} className="w-1/3 h-auto object-cover hidden sm:block" onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x400/cccccc/ffffff?text=No+Image')} />
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="text-lg font-semibold text-slate-800 mb-1">{product.name}</h3>
                                <p className="text-sm text-slate-600 mb-2 flex-grow">{product.description}</p>
                                <div className="flex items-center mb-2">
                                    {Array(5).fill(0).map((_, i) => <Star key={i} size={16} className={`${i < product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />)}
                                    <span className="ml-2 text-sm text-slate-500">({product.rating.toFixed(1)})</span>
                                </div>
                                <div className="flex items-center justify-between mt-auto">
                                    <p className="text-xl font-bold text-sky-600">${product.price.toFixed(2)}</p>
                                    <button className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors duration-150">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination (UI Only) */}
            <div className="mt-10 flex justify-center">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                  Previous
                </a>
                {[1, 2, 3].map(num => (
                  <a key={num} href="#" className={`relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium ${num === 1 ? 'text-sky-600 bg-sky-50' : 'text-slate-700 hover:bg-slate-50'}`}>
                    {num}
                  </a>
                ))}
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                  Next
                </a>
              </nav>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};