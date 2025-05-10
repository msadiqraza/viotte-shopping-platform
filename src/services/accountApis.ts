// --- ACCOUNT PAGE API MOCKS ---
import {UserAccountDetails, GetProductsParams, PaginatedResponse, CollectionItem, Order, Address, PaymentMethod} from "../types";
import {getProducts} from "./productApis";

export const getUserAccountDetails = (): Promise<UserAccountDetails> => {
  console.warn("Fetching MOCKED User Account Details");
  return new Promise(resolve => setTimeout(() => resolve({
    id: 'user123', firstName: 'John', lastName: 'Doe', email: 'johndoe@example.com',
    phoneNumber: '703-123-4567', gender: 'Male', avatarUrl: 'https://placehold.co/100x100/3498db/ffffff?text=JD'
  }), 500));
};
export const updateUserAccountDetails = (details: Partial<UserAccountDetails>): Promise<{ success: boolean; updatedDetails: UserAccountDetails }> => {
  console.warn("MOCK Updating User Account Details:", details);
  const currentDetails = { 
      id: 'user123', firstName: 'John', lastName: 'Doe', email: 'johndoe@example.com',
      phoneNumber: '703-123-4567', gender: 'Male', avatarUrl: 'https://placehold.co/100x100/3498db/ffffff?text=JD'
  };
  const updated = { ...currentDetails, ...details } as UserAccountDetails;
  return Promise.resolve({ success: true, updatedDetails: updated });
};
export const getUserCollection = (params: GetProductsParams): Promise<PaginatedResponse<CollectionItem>> => {
  console.warn("Fetching MOCKED User Collection (wishlist)");
  return getProducts({ ...params, isFeatured: true, limit: params.limit || 10 }); 
};
export const getUserOrders = (params: { page?: number; limit?: number; status?: Order['status'] }): Promise<PaginatedResponse<Order>> => {
  console.warn("Fetching MOCKED User Orders with params:", params);
  return new Promise(resolve => setTimeout(() => { 
    const itemsPerPage = params.limit || 5;
    const mockOrders: Order[] = Array.from({ length: 12 }, (_, i) => ({
      id: `order${i + 1}`, orderNumber: `YS000${1001 + i}`,
      datePlaced: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: i % 4 === 0 ? 'Delivered' : i % 4 === 1 ? 'Shipped' : i % 4 === 2 ? 'Processing' : 'Pending',
      items: [
        { id: `p${i+1}`, name: `Product ${i+1} in Order`, priceAtPurchase: 20 + i*5, quantity: 1, imageUrl: `https://placehold.co/80x80/aabbcc/ffffff?text=P${i+1}`, category: 'Mock', rating: 4, stock: 1, description: '', price: 20 + i*5 },
      ],
      subtotal: 20 + i*5, shippingCost: 5, taxes: (20+i*5)*0.1, totalAmount: (20+i*5)*1.1 + 5,
      shippingAddress: { id: 'addr1', type: 'Shipping', fullName: 'John Doe', streetAddress1: '123 Main St', city: 'Anytown', state: 'CA', zipCode: '90210', country: 'USA', isDefault: true },
      paymentMethod: "CreditCard", paymentDetails: { paymentStatus: 'Paid' }
    }));
    const filteredOrders = params.status ? mockOrders.filter(o => o.status === params.status) : mockOrders;
    const totalItems = filteredOrders.length; const totalPages = Math.ceil(totalItems / itemsPerPage);
    const page = params.page || 1; const paginatedItems = filteredOrders.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    resolve({ items: paginatedItems, totalItems, totalPages, currentPage: page, itemsPerPage });
  }, 600));
};
export const getUserAddresses = (): Promise<Address[]> => {
  console.warn("Fetching MOCKED User Addresses");
  return new Promise(resolve => setTimeout(() => resolve([
    { id: 'addr1', type: 'Shipping', fullName: 'John Doe', streetAddress1: '123 Main St', city: 'Anytown', state: 'CA', zipCode: '90210', country: 'USA', isDefault: true, phoneNumber: '555-123-4567' },
    { id: 'addr2', type: 'Billing', fullName: 'John Doe', streetAddress1: '456 Oak Ave', streetAddress2: 'Unit B', city: 'Otherville', state: 'NY', zipCode: '10001', country: 'USA', phoneNumber: '555-987-6543' },
  ]), 400));
};
export const addUserAddress = (address: Omit<Address, 'id' | 'isDefault'>): Promise<{ success: boolean; address: Address }> => {
  console.warn("MOCK Adding User Address:", address);
  const newAddress: Address = { ...address, id: `addr${Date.now()}`, isDefault: false };
  return Promise.resolve({ success: true, address: newAddress });
};
export const updateUserAddress = (addressId: string, updates: Partial<Address>): Promise<{ success: boolean; address: Address }> => {
  console.warn(`MOCK Updating User Address ${addressId}:`, updates);
  const updatedAddress: Address = { 
      id: addressId, type: 'Shipping', fullName: 'John Updated', streetAddress1: '123 Main St Updated', 
      city: 'Anytown', state: 'CA', zipCode: '90210', country: 'USA', ...updates 
  };
  return Promise.resolve({ success: true, address: updatedAddress });
};
export const deleteUserAddress = (addressId: string): Promise<{ success: boolean }> => {
  console.warn(`MOCK Deleting User Address ${addressId}`);
  return Promise.resolve({ success: true });
};
export const setDefaultAddress = (addressId: string, type: 'Shipping' | 'Billing'): Promise<{ success: boolean }> => {
    console.warn(`MOCK Setting default ${type} address to ${addressId}`);
    return Promise.resolve({ success: true });
};
export const getUserPaymentMethods = (): Promise<PaymentMethod[]> => {
  console.warn("Fetching MOCKED User Payment Methods");
  return new Promise(resolve => setTimeout(() => resolve([
    { id: 'pm1', type: 'CreditCard', cardBrand: 'Visa', last4: '1234', expiryMonth: '12', expiryYear: '2025', nameOnCard: 'John Doe', isDefault: true },
    { id: 'pm2', type: 'PayPal', email: 'johndoe@paypal.example.com' },
  ]), 450));
};
export const addUserPaymentMethod = (method: Omit<PaymentMethod, 'id' | 'isDefault'>): Promise<{ success: boolean; paymentMethod: PaymentMethod }> => {
  console.warn("MOCK Adding User Payment Method:", method);
  const newMethod: PaymentMethod = { ...method, id: `pm${Date.now()}`, isDefault: false };
  return Promise.resolve({ success: true, paymentMethod: newMethod });
};
export const deleteUserPaymentMethod = (methodId: string): Promise<{ success: boolean }> => {
  console.warn(`MOCK Deleting User Payment Method ${methodId}`);
  return Promise.resolve({ success: true });
};
export const setDefaultPaymentMethod = (methodId: string): Promise<{ success: boolean }> => {
    console.warn(`MOCK Setting default payment method to ${methodId}`);
    return Promise.resolve({ success: true });
};