import React, { useEffect, useState } from "react";

import { FaArrowLeft } from "react-icons/fa";
import { IoMdLogIn } from "react-icons/io";
import { Images } from "../../components/images";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useRouter } from "next/router";
import usePlan from "../../components/PricingContext";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;


  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
  });
  console.log("formData", formData);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [apiError, setApiError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");
    setIsLoading(true);
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";

    setErrors({});
    try {
      const res = await fetch(`${url}/api/v1/user/password/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setApiError(data?.message || data?.error || "Forgot Password failed");
        setIsLoading(false);
        return;
      }
      toast.success('Password has been sent to your email!')
      router.push("/login")
    } catch (err) {
      setApiError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <div className="min-h-screen bg-white text-slate-800">
        <Header />
        <div className="flex flex-center justify-center align-center">
          <div className="w-[30%] p-8 bg-gray-50 rounded-xl shadow-m m-3 ">
            {/* Header */}
            <div className="flex items-center p-4 border-b border-gray-100">
              <button
                onClick={() => router.push("/pricing")}
                className="mr-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">
                Forgot Password
              </h1>
            </div>

            <div className="flex-1 p-6">
              {/* Logo and Welcome Message */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4">
                  <img
                    src={Images.logowhitebg}
                    alt="Sellinder Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Welcome Back
                </h2>
                <p className="text-sm text-gray-600">Please enter the Email</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {apiError && (
                  <div className="text-xs text-red-600 mb-2 text-center">
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
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
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

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                  disabled={isLoading}
                >
                  <IoMdLogIn className="w-4 h-4" />
                  {isLoading ? "Submiting..." : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ForgotPassword;
