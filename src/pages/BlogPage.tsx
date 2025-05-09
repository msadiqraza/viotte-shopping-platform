// -----------------------------------------------------------------------------
// 10. pages/BlogPage.tsx
// Description: Page to display blog posts.
// -----------------------------------------------------------------------------
// Create this file in your `src/pages/BlogPage.tsx` directory

import React, { useState } from 'react';
import { BlogPost } from '../types'; // Assuming types are in src/types
import { Search as SearchIcon, Tag, CalendarDays, UserCircle } from 'lucide-react'; // Renamed Search to SearchIcon to avoid conflict

const placeholderBlogPosts: BlogPost[] = [
  { 
	id: '1', 
	title: 'The Future of E-commerce: Trends to Watch', 
	slug: 'future-of-ecommerce', 
	excerpt: 'Discover the upcoming trends that will shape the future of online shopping, from AI personalization to sustainable practices.', 
	imageUrl: 'https://placehold.co/600x400/3498db/ffffff?text=E-commerce+Trends', 
	author: 'Jane Doe', 
	publishDate: '2025-04-28', 
	tags: ['E-commerce', 'Technology', 'Future'], 
	content: 'This is the content of the blog post.' 
	},
  { 
	id: '2', 
	title: 'Top 10 Gadgets You Need in 2025', 
	slug: 'top-10-gadgets-2025', 
	excerpt: 'Our curated list of the must-have tech gadgets for the year, enhancing productivity and entertainment.', 
	imageUrl: 'https://placehold.co/600x400/2ecc71/ffffff?text=Tech+Gadgets', 
	author: 'John Smith', 
	publishDate: '2025-04-22', 
	tags: ['Gadgets', 'Technology', 'Reviews'], 
	content: 'This is the content of the blog post.' 
},
  { 
	id: '3', 
	title: 'Sustainable Shopping: How to Make Eco-Friendly Choices', 
	slug: 'sustainable-shopping-guide', 
	excerpt: 'Learn how to shop more sustainably and reduce your environmental impact with these practical tips.', 
	imageUrl: 'https://placehold.co/600x400/e74c3c/ffffff?text=Sustainable+Shopping', 
	author: 'Alice Green', 
	publishDate: '2025-04-15', 
	tags: ['Sustainability', 'Lifestyle', 'Guides'], 
	content: 'This is the content of the blog post.' 
	},
];

const BlogPostCard: React.FC<{ post: BlogPost }> = ({ post }) => (
  <article className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col">
    <img src={post.imageUrl} alt={post.title} className="w-full h-56 object-cover" onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400/cccccc/ffffff?text=Blog+Image')} />
    <div className="p-6 flex flex-col flex-grow">
      <div className="mb-3">
        {post.tags.map(tag => (
          <span key={tag} className="inline-block bg-sky-100 text-sky-700 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{tag}</span>
        ))}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2 hover:text-sky-600 transition-colors">
        <a href={`/blog/${post.slug}`}>{post.title}</a>
      </h3>
      <p className="text-slate-600 text-sm mb-4 flex-grow">{post.excerpt}</p>
      <div className="mt-auto pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center">
          <UserCircle size={16} className="mr-1.5" /> {post.author}
        </div>
        <div className="flex items-center">
          <CalendarDays size={16} className="mr-1.5" /> {new Date(post.publishDate).toLocaleDateString()}
        </div>
      </div>
    </div>
  </article>
);

export const BlogPage: React.FC = () => {
  const [posts] = useState<BlogPost[]>(placeholderBlogPosts);
  const popularTags = ['E-commerce', 'Technology', 'Lifestyle', 'Guides', 'Reviews', 'Sustainability'];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Hero Section */}
      <section className="bg-slate-700 text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Our Blog</h1>
          <p className="text-lg sm:text-xl opacity-90">
            Insights, news, and stories from the YourStore team.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Blog Posts Grid */}
          <div className="lg:w-2/3">
            <div className="grid md:grid-cols-2 gap-8">
              {posts.map(post => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
            {/* Pagination (UI Only) */}
            <div className="mt-12 flex justify-center">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <a href="#" className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                  Previous
                </a>
                {[1, 2, 3].map(num => (
                  <a key={num} href="#" className={`relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium ${num === 1 ? 'text-sky-600 bg-sky-50' : 'text-slate-700 hover:bg-slate-50'}`}>
                    {num}
                  </a>
                ))}
                <a href="#" className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                  Next
                </a>
              </nav>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/3 space-y-8">
            {/* Search Bar */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Search Blog</h3>
              <div className="relative">
                <input 
                  type="search" 
                  placeholder="Search articles..." 
                  className="w-full py-2 px-4 pl-10 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="text-slate-400" size={20} />
                </div>
              </div>
            </div>

            {/* Categories/Tags */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map(tag => (
                  <a 
                    key={tag} 
                    href="#" 
                    className="text-sm bg-slate-200 text-slate-700 hover:bg-sky-200 hover:text-sky-700 px-3 py-1.5 rounded-full transition-colors duration-150"
                  >
                    <Tag size={14} className="inline mr-1.5" />{tag}
                  </a>
                ))}
              </div>
            </div>

            {/* Recent Posts (UI Only) */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Posts</h3>
              <ul className="space-y-3">
                {posts.slice(0,3).map(post => (
                  <li key={post.id}>
                    <a href={`/blog/${post.slug}`} className="text-sm text-slate-700 hover:text-sky-600 font-medium transition-colors">
                      {post.title}
                    </a>
                    <p className="text-xs text-slate-500">{new Date(post.publishDate).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};