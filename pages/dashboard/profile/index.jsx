import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import toast from "react-hot-toast";

const ProfileDashboardPage = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const [user, setUser] = useState({ name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    fetchProfileDetails();
  }, []);

  const fetchProfileDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // First, try to get from localStorage
      const stored = JSON.parse(localStorage.getItem("user") || "null");
      if (stored && (stored.name || stored.email)) {
        setUser({
          name: stored.name || "",
          email: stored.email || ""
        });
        setFormData({
          name: stored.name || "",
          email: stored.email || ""
        });
      }

      // Then try API if token exists
      if (token) {
        const res = await fetch(`${url}/api/v1/user/details`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data && (data.name || data.email)) {
            setUser({
              name: data.name || "",
              email: data.email || ""
            });
            setFormData({
              name: data.name || "",
              email: data.email || ""
            });
            // Update localStorage with API data
            localStorage.setItem("user", JSON.stringify({
              name: data.name || "",
              email: data.email || ""
            }));
          }
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setApiError("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        // If no token, just update localStorage
        setUser({
          name: formData.name,
          email: formData.email
        });
        localStorage.setItem("user", JSON.stringify({
          name: formData.name,
          email: formData.email
        }));
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        setIsLoading(false);
        return;
      }

      const res = await fetch(`${url}/api/v1/user/update/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email
        })
      });
      const data = await res.json();

      if (!res.ok) {
        setApiError(data?.message || data?.error || "Update failed");
        setIsLoading(false);
        return;
      }

      setUser({
        name: formData.name,
        email: formData.email
      });
      localStorage.setItem("user", JSON.stringify({
        name: formData.name,
        email: formData.email
      }));
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setApiError("Network error. Please try again.");
      toast.error("Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {() => (
        <div className="space-y-6 max-w-4xl mx-auto">
          <header>
            <h1 className="text-2xl font-bold mb-2">Profile</h1>
            <p className="text-slate-600">View and manage your account information.</p>
          </header>

          <div className="space-y-4">
            <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Account Information</h2>
              
              {apiError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {apiError}
                </div>
              )}

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="Enter your name"
                    />
                  ) : (
                    <p className="text-sm text-slate-800">{user.name || "Not provided"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <p className="text-sm text-slate-800">{user.email || "Not provided"}</p>
                  )}
                </div>

                {isEditing ? (
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-60"
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({ name: user.name, email: user.email });
                        setApiError("");
                      }}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Update Profile
                  </button>
                )}
              </form>
            </section>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ProfileDashboardPage;
