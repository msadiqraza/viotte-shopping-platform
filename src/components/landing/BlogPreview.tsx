// -----------------------------------------------------------------------------
// 7. components/landing/BlogPreview.tsx
// Description: Section to display latest blog posts.
// -----------------------------------------------------------------------------
// Create this file in `src/components/landing/BlogPreview.tsx`

import React from 'react';
import { BlogPost } from '../../types'; // Already imported
import { BlogPostCard } from '../shared/BlogPostCard'; // Already imported

interface BlogPreviewProps {
  posts: BlogPost[];
}

export const BlogPreview: React.FC<BlogPreviewProps> = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4 px-4 md:px-0">Latest from Blog</h2>
        <p className="px-4 md:px-0 text-slate-500">Loading blog posts...</p>
      </div>
    );
  }

  // Wireframe shows 3 blog posts in a row, total 6.
  // Assuming the backend sends 6, we'll display them.
  // If more are sent, we might need pagination or a "View All" button.
  const postsToDisplay = posts.slice(0, 3); // Display first 3 for the row

  return (
    <div className="my-12">
      <div className="flex justify-between items-center mb-6 px-4 md:px-0">
        <h2 className="text-2xl font-semibold text-slate-800">Latest from Blog</h2>
        <a href="/blog" className="text-sm font-medium text-orange-500 hover:text-orange-600 hover:underline">
          View All Posts
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0">
        {postsToDisplay.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};