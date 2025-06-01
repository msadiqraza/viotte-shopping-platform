// src/components/accounts/ManageAddressesSection.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Address, AddressFormData } from "../../types"; // Ensure AddressFormData is defined in types
import {
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setDefaultAddress,
  AuthenticationRequiredError, // Assuming this is exported from accountApis or a shared error file
} from "../../services/accountApis"; // Adjust path as needed
import { useAuth } from "../../contexts/AuthContext"; // Adjust path
import { useLoginPrompt } from "../../contexts/LoginPromptContext"; // Adjust path
import {
  MapPin,
  PlusCircle,
  Edit3,
  Trash2,
  AlertTriangle,
  X,
  Star,
} from "lucide-react";

// Define AddressFormData if not already in types.ts
// export type AddressFormData = Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'is_default_shipping' | 'is_default_billing'>;
// And ensure Address type includes is_default_shipping and is_default_billing

const initialAddressFormData: AddressFormData = {
  is_default: true,
  full_name: "",
  street_address1: "",
  street_address2: "",
  city: "",
  state: "",
  zip_code: "",
  country: "",
  phone_number: "",
  type: "Shipping"
};

export const ManageAddressesSection: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { showLoginPrompt } = useLoginPrompt();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(initialAddressFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAddresses = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      showLoginPrompt({ returnUrl: "/account?tab=addresses" }); // Or your current account page path
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const userAddresses = await getUserAddresses();
      setAddresses(userAddresses);
    } catch (err: any) {
      console.error("Failed to fetch addresses:", err);
      if (err instanceof AuthenticationRequiredError) {
        showLoginPrompt({ returnUrl: "/account?tab=addresses" });
      } else {
        setError(err.message || "Could not load addresses.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, showLoginPrompt]);

  useEffect(() => {
    if (!authLoading) {
      fetchAddresses();
    }
  }, [user, authLoading, fetchAddresses]);

  const handleOpenForm = (address?: Address) => {
    setFormError(null);
    if (address) {
      setEditingAddress(address);
      // Map Address to AddressFormData
      const {
        id,
        user_id,
        created_at,
        updated_at,
        is_default,
        ...editableFields
      } = address;
      setFormData(editableFields as AddressFormData);
    } else {
      setEditingAddress(null);
      setFormData(initialAddressFormData);
    }
    setIsFormModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormModalOpen(false);
    setEditingAddress(null);
    setFormData(initialAddressFormData);
    setFormError(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showLoginPrompt({ returnUrl: "/account?tab=addresses" });
      return;
    }
    setIsSubmitting(true);
    setFormError(null);
    try {
      if (editingAddress) {
        await updateUserAddress(editingAddress.id, {
          ...formData,
          is_default: false,
        });
      } else {
        await addUserAddress({
          ...formData,
          is_default: false,
        });
      }
      fetchAddresses(); // Refresh list
      handleCloseForm();
    } catch (err: any) {
      console.error("Failed to save address:", err);
      setFormError(err.message || "Failed to save address. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!user) {
      showLoginPrompt({ returnUrl: "/account?tab=addresses" });
      return;
    }
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await deleteUserAddress(addressId);
        fetchAddresses(); // Refresh list
      } catch (err: any) {
        console.error("Failed to delete address:", err);
        setError(err.message || "Could not delete address."); // Show error on main page for delete
      }
    }
  };

  const handleSetDefault = async (addressId: string) => {
    if (!user) {
      showLoginPrompt({ returnUrl: "/account?tab=addresses" });
      return;
    }
    try {
      await setDefaultAddress(addressId);
      fetchAddresses(); // Refresh list to show updated default status
    } catch (err: any) {
      console.error(`Failed to set default address:`, err);
      setError(err.message || `Could not set default address.`);
    }
  };

  if (authLoading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p>Loading authentication...</p>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p>Loading addresses...</p>
      </div>
    );
  }
  // If not authenticated and not loading auth (prompt should be visible)
  if (!user && !authLoading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Authentication Required</h2>
        <p className="text-slate-600">Please log in to manage your addresses.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">Manage Addresses</h2>
        <button
          onClick={() => handleOpenForm()}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md flex items-center text-sm transition-colors"
        >
          <PlusCircle size={18} className="mr-2" /> Add New Address
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
          <AlertTriangle size={18} className="inline mr-2" /> {error}
        </div>
      )}

      {addresses.length === 0 && !isLoading && (
        <div className="text-center py-10">
          <MapPin size={48} className="mx-auto text-slate-400 mb-4" />
          <p className="text-slate-500">You haven't added any addresses yet.</p>
        </div>
      )}

      <div className="space-y-6">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="p-4 border border-slate-200 rounded-lg shadow-sm bg-slate-50/50"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-slate-700">{address.full_name || "N/A"}</h3>
                <p className="text-sm text-slate-600">{address.street_address1}</p>
                {address.street_address2 && (
                  <p className="text-sm text-slate-600">{address.street_address2}</p>
                )}
                <p className="text-sm text-slate-600">
                  {address.city}, {address.state} {address.zip_code}
                </p>
                <p className="text-sm text-slate-600">{address.country}</p>
                {address.phone_number && (
                  <p className="text-sm text-slate-500 mt-1">Phone: {address.phone_number}</p>
                )}
              </div>
              <div className="flex space-x-2 flex-shrink-0">
                <button
                  onClick={() => handleOpenForm(address)}
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                  title="Edit Address"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-md transition-colors"
                  title="Delete Address"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap gap-2 items-center">
              {address.is_default ? (
                <span className="flex items-center text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  <Star size={12} className="mr-1 fill-current" /> Default Address
                </span>
              ) : (
                <button
                  onClick={() => handleSetDefault(address.id)}
                  className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                  Set as Default Address
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Address Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4 overflow-y-auto">
          {" "}
          {/* Ensure z-index is high enough */}
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 md:p-8 space-y-6 transform transition-all">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-slate-800">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h3>
              <button
                onClick={handleCloseForm}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X size={22} />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
                <AlertTriangle size={18} className="inline mr-2" /> {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form Fields: Recipient Name, Address Line 1, Line 2, City, State, Postal Code, Country, Phone, Type */}
              <div>
                <label
                  htmlFor="recipient_name"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Full Name (Recipient)
                </label>
                <input
                  type="text"
                  name="full_name"
                  id="full_name"
                  value={formData.full_name || ""}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label
                  htmlFor="street_address1"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="street_address1"
                  id="street_address1"
                  value={formData.street_address1}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label
                  htmlFor="street_address2"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  name="street_address2"
                  id="street_address2"
                  value={formData.street_address2 || ""}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    State / Province / Region
                  </label>
                  <input
                    type="text"
                    name="state"
                    id="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="zip_code"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Zip Code
                  </label>
                  <input
                    type="text"
                    name="zip_code"
                    id="zip_code"
                    value={formData.zip_code}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Country
                  </label>
                  {/* Consider using a select dropdown for countries if you have a predefined list */}
                  <input
                    type="text"
                    name="country"
                    id="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="phone_number"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  id="phone_number"
                  value={formData.phone_number || ""}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label
                  htmlFor="address_type"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Address Type (Optional)
                </label>
                <select
                  name="type"
                  id="type"
                  value={formData.type || "Shipping"}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500 bg-white"
                >
                  <option value="Shipping">Shipping</option>
                  <option value="Billing">Billing</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 mt-2">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-5 py-2.5 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-70"
                >
                  {isSubmitting
                    ? editingAddress
                      ? "Saving..."
                      : "Adding..."
                    : editingAddress
                    ? "Save Changes"
                    : "Add Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
