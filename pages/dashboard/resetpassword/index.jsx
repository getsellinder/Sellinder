import React, { useState } from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { IoMdLogIn } from "react-icons/io";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const ResetPasswordDashboard = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");
    setIsLoading(true);
    const newErrors = {};
    
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    setErrors({});
    
    try {
      const res = await fetch(`${url}/api/v1/user/password/reset`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setApiError(data?.message || data?.error || "Reset Password failed");
        setIsLoading(false);
        return;
      }
      
      toast.success("Password has been reset successfully!");
      setFormData({ email: "", password: "", confirmPassword: "" });
      setShowSuccessModal(true);
    } catch (err) {
      setApiError("Network error. Please try again.");
      toast.error("Reset Password failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DashboardLayout>
      {() => (
        <>
          {showSuccessModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Success!</h3>
                  <p className="text-sm text-gray-600 mb-6">Your password has been reset successfully!</p>
                  <button
                    onClick={() => {
                      setShowSuccessModal(false);
                      router.push("/dashboard");
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-center min-h-[80vh]">
          <div className="w-full max-w-md">
            <header className="mb-6 text-center">
              <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
              <p className="text-slate-600">Update your account password securely.</p>
            </header>

            <section className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              {apiError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 text-center">
                  {apiError}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg text-sm ${
                    errors.email
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-300 focus:ring-orange-200"
                  } focus:outline-none focus:ring-2`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg text-sm ${
                    errors.password
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-300 focus:ring-orange-200"
                  } focus:outline-none focus:ring-2`}
                  placeholder="Enter your new password"
                />
                {errors.password && (
                  <p className="text-xs text-red-600 mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg text-sm ${
                    errors.confirmPassword
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-300 focus:ring-orange-200"
                  } focus:outline-none focus:ring-2`}
                  placeholder="Confirm your new password"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                disabled={isLoading}
              >
                <IoMdLogIn className="w-4 h-4" />
                {isLoading ? "Submitting..." : "Reset Password"}
              </button>
            </form>
          </section>
          </div>
        </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default ResetPasswordDashboard;
