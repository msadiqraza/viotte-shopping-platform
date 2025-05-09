// -----------------------------------------------------------------------------
// 6. components/shared/BlogPostCard.tsx
// Description: Card to display individual blog post summary.
// -----------------------------------------------------------------------------
// Create this file in `src/components/shared/BlogPostCard.tsx`

import React from 'react';
import { BlogPost } from '../../types'; // Adjust path
import { ArrowRight } from 'lucide-react';

interface BlogPostCardProps {
  post: BlogPost;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl">
      <a href={`/blog/${post.slug}`} className="block overflow-hidden">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x250/e0e0e0/757575?text=No+Image')}
        />
      </a>
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-xs text-slate-500 mb-1">
          {new Date(post.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          {post.author && ` • By ${post.author}`}
        </p>
        <h3 className="text-lg font-semibold text-slate-800 mb-2 truncate group-hover:text-green-700 transition-colors">
          <a href={`/blog/${post.slug}`}>{post.title}</a>
        </h3>
        <p className="text-sm text-slate-600 mb-3 flex-grow">{post.excerpt.substring(0,100)}...</p>
        <a 
          href={`/blog/${post.slug}`} 
          className="mt-auto text-sm font-medium text-orange-500 hover:text-orange-600 group-hover:underline flex items-center"
        >
          Read More <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
};
