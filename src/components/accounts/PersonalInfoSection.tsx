// --- src/components/account/PersonalInfoSection.tsx ---
import { useState, useEffect } from "react";
import { PersonalInfoSectionProps, UserAccountDetails } from "../../types";
import { Edit3 } from "lucide-react";

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  userDetails,
  onUpdateDetails,
  isLoading,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserAccountDetails>>(userDetails || {});
  const [formMessage, setFormMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setFormData(userDetails || {});
    }
  }, [userDetails, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMessage(null);
    setIsSubmitting(true);

    const result = await onUpdateDetails(formData);

    if (result.success) {
      setFormMessage({ type: "success", text: "Information updated successfully!" });
      setIsEditing(false);
      setFormData(result.updatedDetails || {});
      console.log(result.updatedDetails);
    } else {
      setFormMessage({ type: "error", text: "Failed to update information. Please try again." });
    }
    setIsSubmitting(false);
  };
  if (isLoading && !userDetails)
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p>Loading personal information...</p>
      </div>
    );
  if (!userDetails)
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p>Could not load user information.</p>
      </div>
    );

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">Personal Information</h2>
        {!isEditing && (
          <button
            onClick={() => {
              setIsEditing(true);
              setFormMessage(null);
            }}
            className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center py-1 px-2 rounded hover:bg-green-50 transition-colors"
          >
            <Edit3 size={16} className="mr-1.5" /> Edit
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={
                formData.avatar_url ||
                userDetails.avatar_url ||
                "https://placehold.co/120x120/e2e8f0/64748b?text=Avatar"
              }
              alt="User Avatar"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            {isEditing && (
              <label
                htmlFor="avatarUpload"
                className="absolute bottom-0 right-0 bg-green-600 hover:bg-green-700 text-white p-2.5 rounded-full cursor-pointer shadow-md transition-transform hover:scale-110"
              >
                <Edit3 size={16} />
                <input
                  type="file"
                  id="avatarUpload"
                  name="avatar_url"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({ ...formData, avatar_url: reader.result as string });
                      };
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                />
              </label>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-slate-700 mb-1">
              First Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              value={formData.first_name || ""}
              onChange={handleChange}
              disabled={!isEditing}
              required
              className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-slate-100 disabled:text-slate-500 text-sm"
            />
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-slate-700 mb-1">
              Last Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="last_name"
              id="last_name"
              value={formData.last_name || ""}
              onChange={handleChange}
              disabled={!isEditing}
              required
              className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-slate-100 disabled:text-slate-500 text-sm"
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            Email<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email || ""}
            onChange={handleChange}
            disabled={!isEditing || true}
            className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-slate-100 disabled:text-slate-500 text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium text-slate-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone_number"
            id="phone_number"
            value={formData.phone_number || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-slate-100 disabled:text-slate-500 text-sm"
          />
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-1">
            Gender
          </label>
          <select
            name="gender"
            id="gender"
            value={formData.gender || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-slate-100 disabled:text-slate-500 text-sm bg-white"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
        {formMessage && (
          <div
            className={`p-3 rounded-md text-sm ${
              formMessage.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {formMessage.text}
          </div>
        )}
        {isEditing && (
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 mt-6">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData(userDetails);
                setFormMessage(null);
              }}
              className="px-5 py-2.5 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-70"
            >
              {isSubmitting ? "Updating..." : "Update Information"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
