import { Cart } from "../types";
import { supabase } from "../supabaseClient";
import { getCurrentUserId } from "./index";
import { CartItem } from "../types";
import { Product } from "../types";

const getOrCreateUserCartId = async (userId: string): Promise<string> => {
    let { data: cart, error: fetchError } = await supabase
        .from('user_carts')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: no rows found
        throw fetchError;
    }
    if (!cart) {
        const { data: newCart, error: insertError } = await supabase
            .from('user_carts')
            .insert({ user_id: userId })
            .select('id')
            .maybeSingle();
        if (insertError) throw insertError;
        if (!newCart) throw new Error("Failed to create cart.");
        cart = newCart;
    }
    return cart.id;
};

const fetchAndCalculateCart = async (cartId: string): Promise<Cart> => {
    const { data: cartItemsData, error: itemsError } = await supabase
        .from('user_cart_items')
        .select(`
            *,
            products (id, name, price, image_url, stock_quantity)
        `)
        .eq('cart_id', cartId);

    if (itemsError) throw itemsError;

    const items: CartItem[] = cartItemsData?.map(ci => ({
        productId: (ci.products as Product).id,
        name: (ci.products as Product).name,
        price: ci.price_at_add, // Use price_at_add for consistency
        quantity: ci.quantity,
        imageUrl: (ci.products as Product).imageUrl,
        size: ci.size,
        color: ci.color,
    })) || [];
    
    // Recalculate totals (discount, shipping, taxes would be applied later or fetched from cart table if stored there)
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // For a full implementation, fetch discount, shipping, taxes from user_carts table or calculate them
    const total = subtotal; // Simplified for now

    return {
        id: cartId,
        items,
        subtotal,
        total,
        lastUpdated: new Date().toISOString(), // Could be from user_carts.updated_at
    };
};


export const getSupabaseCart = async (): Promise<Cart> => {
    const userId = await getCurrentUserId();
    const cartId = await getOrCreateUserCartId(userId);
    return fetchAndCalculateCart(cartId);
};

export const addSupabaseItemToCart = async (item: { productId: string; quantity: number; price: number; name?: string; imageUrl?: string; size?: string; color?: string }): Promise<Cart> => {
    const userId = await getCurrentUserId();
    const cartId = await getOrCreateUserCartId(userId);

    // Check if item variant already exists
    let query = supabase.from('user_cart_items')
        .select('*')
        .eq('cart_id', cartId)
        .eq('product_id', item.productId);
    if (item.size) query = query.eq('size', item.size); else query = query.is('size', null);
    if (item.color) query = query.eq('color', item.color); else query = query.is('color', null);
    
    const { data: existingItem, error: fetchExistingError } = await query.maybeSingle();

    if (fetchExistingError && fetchExistingError.code !== 'PGRST116') throw fetchExistingError;

    if (existingItem) { // Update quantity
        const { error: updateError } = await supabase
            .from('user_cart_items')
            .update({ quantity: existingItem.quantity + item.quantity })
            .eq('id', existingItem.id);
        if (updateError) throw updateError;
    } else { // Insert new item
        const { error: insertError } = await supabase
            .from('user_cart_items')
            .insert({
                cart_id: cartId,
                product_id: item.productId,
                quantity: item.quantity,
                price_at_add: item.price, // Price when added
                size: item.size,
                color: item.color,
            });
        if (insertError) throw insertError;
    }
    await supabase.from('user_carts').update({ updated_at: new Date().toISOString() }).eq('id', cartId).eq('user_id', userId);
    return fetchAndCalculateCart(cartId);
};

export const updateSupabaseCartItemQuantity = async (productId: string, quantity: number, size?: string, color?: string): Promise<Cart> => {
  const userId = await getCurrentUserId();
  const cartId = await getOrCreateUserCartId(userId);

  // Define the match criteria for finding the specific cart item
  const matchCriteria: { cart_id: string; product_id: string; size?: string | null; color?: string | null } = {
    cart_id: cartId,
    product_id: productId,
  };
  if (size !== undefined) matchCriteria.size = size;
  else matchCriteria.size = null;
  if (color !== undefined) matchCriteria.color = color;
  else matchCriteria.color = null;

  if (quantity <= 0) {
    // Delete the item if quantity is 0 or less
    const { error } = await supabase.from("user_cart_items").delete().match(matchCriteria);
    if (error) {
      console.error("Error deleting cart item:", error);
      throw error;
    }
  } else {
    // Update the quantity for the item
    const { error } = await supabase.from("user_cart_items").update({ quantity: quantity }).match(matchCriteria);
    if (error) {
      console.error("Error updating cart item quantity:", error);
      throw error;
    }
  }

  // Update the cart's last updated timestamp
  await supabase.from("user_carts").update({ updated_at: new Date().toISOString() }).eq("id", cartId);

  // Fetch and return the updated cart
  return fetchAndCalculateCart(cartId);
};
export const removeSupabaseCartItem = async (productId: string, size?: string, color?: string): Promise<Cart> => {
    const userId = await getCurrentUserId();
    const cartId = await getOrCreateUserCartId(userId);
    
    let query = supabase.from('user_cart_items')
        .delete()
        .eq('cart_id', cartId)
        .eq('product_id', productId);
    if (size) query = query.eq('size', size); else query = query.is('size', null);
    if (color) query = query.eq('color', color); else query = query.is('color', null);

    const { error } = await query;
    if (error) throw error;
    
    await supabase.from('user_carts').update({ updated_at: new Date().toISOString() }).eq('id', cartId);
    return fetchAndCalculateCart(cartId);
};

// applyDiscountCode and updateShippingOption would involve updating fields on the `user_carts` table.
// placeOrder would read from user_carts and user_cart_items, create records in `orders` and `order_items`, then clear the cart.
