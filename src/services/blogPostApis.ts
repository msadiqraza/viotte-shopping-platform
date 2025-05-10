// --- Blog Post Endpoints ---
import { fetchData } from "./fetchData";
import { BlogPost } from "../types";

export const getLatestBlogPosts = (limit: number = 6): Promise<BlogPost[]> => {
  return fetchData<BlogPost[]>('/blog', { sort: 'publishDate-desc', limit });
};
export const getBlogPostBySlug = (slug: string): Promise<BlogPost> => fetchData<BlogPost>(`/blog/${slug}`);
