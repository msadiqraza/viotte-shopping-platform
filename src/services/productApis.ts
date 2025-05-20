import { supabase } from "../supabaseClient";
import { Product, PaginatedResponse, GetProductsParams } from "../types";

const ITEMS_PER_PAGE_DEFAULT = 10;

export const getProducts = async (params: GetProductsParams): Promise<PaginatedResponse<Product>> => {
  const page = params.page || 1;
  const limit = params.limit || ITEMS_PER_PAGE_DEFAULT;
  const offset = (page - 1) * limit;

  console.log("params", params);
  let query = supabase
    .from("products")
    .select(
      `
      *,
      category_id ( id, name, slug ),
      shop_id ( id, name, slug )
    `,
      { count: "exact" }
    )
    .eq("is_published", true); // Only fetch published products

  if (params.category) {
    // Assumes 'categories' table has 'slug' and 'products' table has 'category_id'
    // This might require a join or a function call if category is by slug directly on products table
    // For simplicity, if category_id on product refers to category.id and category.slug is what's passed:
    const { data: categoryData } = await supabase.from("categories").select("id").eq("slug", params.category).single();
    if (categoryData) {
      query = query.eq("category_id", categoryData.id);
    } else {
      // Category not found, return empty
      return { items: [], totalItems: 0, totalPages: 0, currentPage: 1, itemsPerPage: limit };
    }
  }
  if (params.shopId) query = query.eq("shop_id", params.shopId);
  if (params.search) query = query.ilike("name", `%${params.search}%`); // Case-insensitive search on name
  if (params.isFeatured) query = query.eq("is_featured", true);
  if (params.isNewArrival) query = query.eq("is_new_arrival", true);
  if (params.ids) query = query.in("id", params.ids.split(","));

  // Sorting
  if (params.sort) {
    // TODO: Implement sorting based on the sort parameter
    // const [field, direction] = params.sort.split("-");
    // query = query.order(field as keyof Product, { ascending: direction === "asc" });
    query = query.order("date_added", { ascending: false }); // Default sort
  } else {
    query = query.order("date_added", { ascending: false }); // Default sort
  }

  query = query.range(offset, offset + limit - 1);


  const { data, error, count } = await query;
  if (error) throw error;

  // Transform nested category and shop data
  const items =
    (data?.map((p) => ({
      ...p,
      category: (p.category_id as any)?.name || p.category, // Use nested name if available
      seller: {
        id: (p.shop_id as any)?.slug || (p.shop_id as any)?.id, // Prefer slug for navigation
        name: (p.shop_id as any)?.name,
      },
    })) as Product[]) || [];

  return {
    items,
    totalItems: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
    currentPage: page,
    itemsPerPage: limit,
  };
};

export const getFeaturedProductsList = (limit: number = 10): Promise<Product[]> => getProducts({ isFeatured: true, limit }).then((res) => res.items);

export const getNewArrivalProductsList = (limit: number = 10): Promise<Product[]> =>
  getProducts({ isNewArrival: true, sort: "date_added-desc", limit }).then((res) => res.items);

export const getShopPreviewProductsList = (shopId: string, limit: number = 10): Promise<Product[]> => getProducts({ shopId, limit }).then((res) => res.items);

export const getProductById = async (productId: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
        *,
        category_id ( id, name, slug ),
        shop_id ( id, name, slug )
    `
    )
    .eq("id", productId)
    .eq("is_published", true)
    .single();
  if (error && error.code !== "PGRST116") {
    // PGRST116: single row not found
    console.error("Error fetching product by ID:", error);
    throw error;
  }
  if (!data) return null;

  return {
    ...data,
    category: (data.category_id as any)?.name || data.category,
    seller: {
      id: (data.shop_id as any)?.slug || (data.shop_id as any)?.id,
      name: (data.shop_id as any)?.name,
    },
  } as Product;
};

export const getProductsByIds = (ids: string[]): Promise<Product[]> => {
  if (ids.length === 0) return Promise.resolve([]);
  return getProducts({ ids: ids.join(",") }).then((res) => res.items);
};

export const getSimilarProducts = (productId: string, categoryId?: string, limit: number = 5): Promise<Product[]> => {
  // If categoryId is actually a slug, you'd first fetch the ID.
  // For this, assuming categoryId is the UUID.
  return getProducts({ category: categoryId, limit: limit + 1 }).then((response) => response.items.filter((p) => p.id !== productId).slice(0, limit));
};
