// --- Blog Post Endpoints ---
import { fetchData } from "./fetchData";
import { BlogPost } from "../types";

// --- Blog Post Endpoints ---
export const getLatestBlogPosts = (limit: number = 6): Promise<BlogPost[]> => {
  return fetchData<BlogPost[]>('/blog_posts', { sort: 'publish_date-desc', limit, is_published: true });
};
export const getBlogPostBySlug = (slug: string): Promise<BlogPost | null> => {
  return fetchData<BlogPost>(`/blog_posts?slug=eq.${slug}&is_published=eq.true`, {}).then(data => data || null);
};