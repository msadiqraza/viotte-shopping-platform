// src/pages/AdminPage.tsx
import React, { useState, useEffect } from "react";
import { ShieldCheck, UserCheck, UserX, Edit, Eye, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext"; // Adjust path
import {
  isCurrentUserAdmin,
  getSellerApplicationsForAdmin,
  updateSellerApplicationStatus,
} from "../services/adminApis"; // Adjust path
import { SellerApplication } from "../services/sellerApis";
import { useNavigate } from "react-router-dom";

interface AdminPageProps {
  onNavigate?: (page: string, params?: any) => void;
}

type ApplicationStatusFilter = "pending" | "approved" | "rejected" | "all";

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingAdminStatus, setIsLoadingAdminStatus] = useState(true);
  const [applications, setApplications] = useState<SellerApplication[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [filterStatus, setFilterStatus] = useState<ApplicationStatusFilter>("pending");
  const [error, setError] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<SellerApplication | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (authLoading) {
      setIsLoadingAdminStatus(true);
      return;
    }
    if (!user) {
      navigate("/login", { state: { returnUrl: "/admin" } }); // Redirect if not logged in
      return;
    }
    isCurrentUserAdmin()
      .then((status) => {
        setIsAdmin(status);
        if (!status) {
          navigate("/"); // Redirect if not admin
        }
      })
      .finally(() => setIsLoadingAdminStatus(false));
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      setIsLoadingApps(true);
      setError(null);
      getSellerApplicationsForAdmin(filterStatus)
        .then(setApplications)
        .catch((err) => {
          console.error("Error fetching applications:", err);
          setError("Failed to load seller applications.");
        })
        .finally(() => setIsLoadingApps(false));
    }
  }, [isAdmin, filterStatus]);

  const handleUpdateStatus = async (appId: string, newStatus: "approved" | "rejected") => {
    setIsUpdatingStatus(true);
    try {
      await updateSellerApplicationStatus(appId, newStatus, reviewerNotes);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === appId
            ? {
                ...app,
                status: newStatus,
                reviewerNotes: reviewerNotes || app.reviewerNotes,
                reviewedAt: new Date().toISOString(),
              }
            : app
        )
      );
      setSelectedApp(null); // Close modal
      setReviewerNotes("");
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update application status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (authLoading || isLoadingAdminStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <p>Verifying admin access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    // This should ideally not be reached if redirection works, but as a fallback:
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <p>Access Denied.</p>
      </div>
    );
  }

  return (
    <div className="bg-stone-100 py-8 min-h-screen">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center">
            <ShieldCheck size={40} className="text-blue-600 mr-3" />
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">Admin Panel</h1>
          </div>
          <p className="text-sm text-slate-600">Logged in as: {user?.email}</p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-700 mb-6">Seller Applications</h2>

          <div className="mb-4 flex space-x-2">
            {(["pending", "approved", "rejected", "all"] as ApplicationStatusFilter[]).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    filterStatus === status
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              )
            )}
          </div>

          {isLoadingApps && <p className="text-center py-4">Loading applications...</p>}
          {error && <p className="text-center py-4 text-red-600">{error}</p>}
          {!isLoadingApps && !error && applications.length === 0 && (
            <p className="text-center py-10 text-slate-500">
              No applications found for the selected filter.
            </p>
          )}

          {!isLoadingApps && !error && applications.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Business Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Contact Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {app.businessName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {app.contactEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {new Date(app.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`font-semibold px-2 py-0.5 rounded-full text-xs ${
                            app.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : app.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <Eye size={16} className="mr-1" /> View/Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal for Reviewing Application */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-xl font-semibold text-slate-800">
              Review Application: {selectedApp.businessName}
            </h3>
            <p>
              <strong className="text-slate-600">Applicant User ID:</strong> {selectedApp.userId}
            </p>
            <p>
              <strong className="text-slate-600">Contact:</strong> {selectedApp.contactEmail}
            </p>
            <p>
              <strong className="text-slate-600">Submitted:</strong>{" "}
              {new Date(selectedApp.submittedAt).toLocaleString()}
            </p>
            <p>
              <strong className="text-slate-600">Current Status:</strong> {selectedApp.status}
            </p>
            {selectedApp.applicationDetails && (
              <div className="mt-2 p-3 bg-slate-50 rounded border max-h-40 overflow-y-auto">
                <strong className="text-slate-600 block mb-1">Application Details:</strong>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">
                  {selectedApp.applicationDetails}
                </p>
              </div>
            )}
            {selectedApp.reviewerNotes && (
              <div className="mt-2 p-3 bg-blue-50 rounded border max-h-40 overflow-y-auto">
                <strong className="text-slate-600 block mb-1">Previous Reviewer Notes:</strong>
                <p className="text-sm text-blue-700 whitespace-pre-wrap">
                  {selectedApp.reviewerNotes}
                </p>
              </div>
            )}

            <div>
              <label
                htmlFor="reviewerNotes"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Reviewer Notes (Optional):
              </label>
              <textarea
                id="reviewerNotes"
                value={reviewerNotes}
                onChange={(e) => setReviewerNotes(e.target.value)}
                rows={3}
                className="w-full p-2 border border-slate-300 rounded-md text-sm"
                placeholder="Notes for approval or rejection..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
                disabled={isUpdatingStatus}
              >
                Cancel
              </button>
              {selectedApp.status === "pending" && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(selectedApp.id, "rejected")}
                    disabled={isUpdatingStatus}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md flex items-center disabled:opacity-70"
                  >
                    <UserX size={16} className="mr-1.5" />{" "}
                    {isUpdatingStatus ? "Rejecting..." : "Reject"}
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedApp.id, "approved")}
                    disabled={isUpdatingStatus}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md flex items-center disabled:opacity-70"
                  >
                    <UserCheck size={16} className="mr-1.5" />{" "}
                    {isUpdatingStatus ? "Approving..." : "Approve"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
