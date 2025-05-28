// --- src/components/landing/BlogPreview.tsx ---
import React from "react"; // Already imported
import { BlogPost } from "../../types"; // Adjust path
import { BlogPostCard } from "../shared/BlogPostCard"; // Adjust path

interface BlogPreviewProps {
  posts: BlogPost[];
  onNavigate: (page: string, params?: any) => void;
}

export const BlogPreview: React.FC<BlogPreviewProps> = ({ posts, onNavigate }) => {
  if (!posts || posts.length === 0)
    return (
      <div className="my-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4 px-4 md:px-0">Latest from Blog</h2>
        <p className="px-4 md:px-0 text-slate-500">Loading blog posts...</p>
      </div>
    );
  const postsToDisplay = posts.slice(0, 3);
  return (
    <div className="my-12 px-6 md:px-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">Latest from Blog</h2>
        <a
          href="/blog"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("blog");
          }}
          className="text-sm font-medium text-orange-500 hover:text-orange-600 hover:underline"
        >
          View All Posts
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0">
        {postsToDisplay.map((post) => (
          <BlogPostCard key={post.id} post={post} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
};
