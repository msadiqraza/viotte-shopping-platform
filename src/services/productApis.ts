import { supabase } from "../supabaseClient";
import { Product, PaginatedResponse, GetProductsParams } from "../types";

const ITEMS_PER_PAGE_DEFAULT = 10;

const toCamel = (str: string) => str.replace(/_([a-z])/g, (match) => match[1].toUpperCase());

const snakeToCamelObject = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(snakeToCamelObject);
  } else if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [toCamel(key), snakeToCamelObject(value)])
    );
  }
  return obj;
};

export const getProducts = async (
  params: GetProductsParams
): Promise<PaginatedResponse<Product>> => {
  const page = params.page || 1;
  const limit = params.limit || ITEMS_PER_PAGE_DEFAULT;
  const offset = (page - 1) * limit;

  console.log("Get Products...");
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
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.category)
      .maybeSingle();
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
    const sortParts = params.sort.split("-");
    const fieldParam = sortParts[0];
    const direction = sortParts[1]?.toLowerCase(); // 'asc' or 'desc'

    let sortField: string = "date_added"; // Default sort field
    let ascending: boolean = false; // Default direction (newest first)

    // Map user-friendly sort options to actual database column names
    switch (fieldParam) {
      case "price":
        sortField = "price";
        break;
      case "name":
        sortField = "name";
        break;
      case "date": // Alias for date_added
      case "newest":
        sortField = "date_added";
        break;
      case "rating":
        sortField = "rating"; // Assuming you have a 'rating' column
        break;
      case "popularity":
        sortField = "view_count"; // Example: if you track popularity by views
        break;
      // Add more cases as needed for your sortable fields
      default:
        // If the fieldParam is a direct column name and not in the switch,
        // you might want to allow it, but be cautious with direct user input.
        // For now, we'll stick to predefined ones or default.
        console.warn(
          `Unsupported sort field parameter: "${fieldParam}". Defaulting to date_added.`
        );
        sortField = "date_added";
    }

    if (direction === "asc") {
      ascending = true;
    } else if (direction === "desc") {
      ascending = false;
    }

    // Ensure the sortField is a valid column name in your 'products' table
    // This is a basic check; a more robust solution might involve a list of allowed sortable columns.
    const allowedSortFields = [
      "price",
      "name",
      "date_added",
      "rating",
      "view_count",
      "stock_quantity",
      "created_at",
      "updated_at",
    ]; // Add all sortable columns
    if (allowedSortFields.includes(sortField)) {
      query = query.order(sortField, { ascending: ascending });
    } else {
      console.warn(`Sort field "${sortField}" is not in allowed list. Defaulting to date_added.`);
      query = query.order("date_added", { ascending: false });
    }
  }
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) throw error;

  // Transform nested category and shop data
  const items =
    (data?.map((p) => {
      const camel = snakeToCamelObject(p);
      return {
        ...camel,
        category: camel.categoryId?.name,
        categorySlug: camel.categoryId?.slug,
        seller: {
          id: camel.shopId?.slug || camel.shopId?.id,
          name: camel.shopId?.name,
        },
      };
    }) as Product[]) || [];

  return {
    items,
    totalItems: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
    currentPage: page,
    itemsPerPage: limit,
  };
};

export const getFeaturedProductsList = (limit: number = 10): Promise<Product[]> =>
  getProducts({ isFeatured: true, limit }).then((res) => res.items);

export const getNewArrivalProductsList = (limit: number = 10): Promise<Product[]> =>
  getProducts({ isNewArrival: true, sort: "date_added-desc", limit }).then((res) => res.items);

export const getShopPreviewProductsList = (
  shopId: string,
  limit: number = 10
): Promise<Product[]> => getProducts({ shopId, limit }).then((res) => res.items);

export const getProductById = async (productId: string): Promise<Product | null> => {
  console.log("Get Product by ID...");
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
    .maybeSingle();
  if (error && error.code !== "PGRST116") {
    // PGRST116: single row not found
    console.error("Error fetching product by ID:", error);
    throw error;
  }
  if (!data) return null;

  const refinedData = snakeToCamelObject(data);

  return {
    ...refinedData,
    category: (refinedData.categoryId as any)?.name || refinedData.category,
    seller: {
      id: (refinedData.shopId as any)?.slug || (refinedData.shopId as any)?.id,
      name: (refinedData.shopId as any)?.name,
    },
  } as Product;
};

export const getProductsByIds = (ids: string[]): Promise<Product[]> => {
  if (ids.length === 0) return Promise.resolve([]);
  return getProducts({ ids: ids.join(",") }).then((res) => res.items);
};

export const getSimilarProducts = (
  productId: string,
  categoryId?: string,
  limit: number = 5
): Promise<Product[]> => {
  // If categoryId is actually a slug, you'd first fetch the ID.
  // For this, assuming categoryId is the UUID.
  return getProducts({ category: categoryId, limit: limit + 1 }).then((response) =>
    response.items.filter((p) => p.id !== productId).slice(0, limit)
  );
};
