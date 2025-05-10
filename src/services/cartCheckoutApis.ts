import { Cart, Order } from "../types";

// --- CART & CHECKOUT API MOCKS ---
let mockCart: Cart = { 
    id: 'cart-session-123',
    items: [],
    subtotal: 0, 
    total: 0,    
    lastUpdated: new Date().toISOString(),
};
const calculateCartTotals = (cart: Cart): Cart => {
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = cart.discount?.amount || 0;
    const shipping = cart.shippingCost || 0; 
    const taxes = cart.taxes || 0; 
    const total = subtotal - discountAmount + shipping + taxes;
    return { ...cart, subtotal, total, lastUpdated: new Date().toISOString() };
};
mockCart = calculateCartTotals(mockCart);

export const getCart = (): Promise<Cart> => {
    console.warn("Fetching MOCKED Cart");
    return new Promise(resolve => setTimeout(() => {
        resolve(calculateCartTotals(mockCart));
    }, 300));
};
export const addItemToCart = (item: { productId: string; quantity: number; price: number; name: string; imageUrl: string; size?: string; color?: string }): Promise<Cart> => {
    console.warn("MOCK Adding item to cart:", item);
    return new Promise(resolve => setTimeout(() => {
        const existingItemIndex = mockCart.items.findIndex(i => i.productId === item.productId && i.size === item.size && i.color === item.color);
        if (existingItemIndex > -1) mockCart.items[existingItemIndex].quantity += item.quantity;
        else mockCart.items.push({ ...item });
        mockCart = calculateCartTotals(mockCart);
        resolve(mockCart);
    }, 500));
};
export const updateCartItemQuantity = (productId: string, quantity: number, size?: string, color?: string): Promise<Cart> => {
    console.warn(`MOCK Updating cart item ${productId} quantity to ${quantity}`);
    return new Promise(resolve => setTimeout(() => {
        const itemIndex = mockCart.items.findIndex(i => i.productId === productId && i.size === size && i.color === color);
        if (itemIndex > -1) {
            if (quantity <= 0) mockCart.items.splice(itemIndex, 1);
            else mockCart.items[itemIndex].quantity = quantity;
            mockCart = calculateCartTotals(mockCart);
        }
        resolve(mockCart);
    }, 400));
};
export const removeCartItem = (productId: string, size?: string, color?: string): Promise<Cart> => {
    console.warn(`MOCK Removing cart item ${productId}`);
    return new Promise(resolve => setTimeout(() => {
        mockCart.items = mockCart.items.filter(i => !(i.productId === productId && i.size === size && i.color === color));
        mockCart = calculateCartTotals(mockCart);
        resolve(mockCart);
    }, 400));
};
export const applyDiscountCode = (code: string): Promise<Cart> => {
    console.warn(`MOCK Applying discount code ${code}`);
    return new Promise((resolve, reject) => setTimeout(() => {
        if (code.toUpperCase() === 'SALE10') {
            mockCart.discount = { code, amount: mockCart.subtotal * 0.10 };
            mockCart = calculateCartTotals(mockCart);
            resolve(mockCart);
        } else {
            mockCart.discount = undefined; 
            mockCart = calculateCartTotals(mockCart);
            reject(new Error("Invalid discount code."));
        }
    }, 600));
};
export const updateShippingOption = (shippingOption: { name: string; cost: number }): Promise<Cart> => {
    console.warn("MOCK Updating shipping option:", shippingOption);
    return new Promise(resolve => setTimeout(() => {
        mockCart.shippingCost = shippingOption.cost;
        mockCart = calculateCartTotals(mockCart);
        resolve(mockCart);
    }, 300));
};
export const placeOrder = (orderDetails: Omit<Order, 'id' | 'orderNumber' | 'datePlaced' | 'status'>): Promise<{ success: boolean; order: Order }> => {
    console.warn("MOCK Placing Order:", orderDetails);
    return new Promise(resolve => setTimeout(() => {
        const newOrder: Order = {
            ...orderDetails,
            id: `order${Date.now()}`,
            orderNumber: `YS${Date.now().toString().slice(-6)}`,
            datePlaced: new Date().toISOString(),
            status: 'Processing', 
            paymentDetails: { ...orderDetails.paymentDetails, paymentStatus: 'Paid' } 
        };
        mockCart = { id: 'cart-session-123', items: [], subtotal: 0, total: 0, lastUpdated: new Date().toISOString() };
        resolve({ success: true, order: newOrder });
    }, 1000));
};
