import React, { useEffect, useState } from "react";

import { FaArrowLeft } from "react-icons/fa";
import { IoMdLogIn } from "react-icons/io";
import { Images } from "../../components/images";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useRouter } from "next/router";
import usePlan from "../../components/PricingContext";
import toast from "react-hot-toast";
import { isAutheticated } from "../../components/isAuthticated";

const SignUP = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const { handlePayment } = usePlan();
  const token = isAutheticated();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [apiError, setApiError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");
    setIsLoading(true);
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = "Name is required";
    if (!formData.email?.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    setErrors({});
    try {
      const res = await fetch(`${url}/api/v1/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          phone: formData.phone,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setApiError(data?.message || data?.error || "Sign UP failed");
        setIsLoading(false);
        return;
      }

      // Defensive extraction of token and user from common API shapes
      const token =
        data?.token ||
        data?.data?.token ||
        data?.accessToken ||
        data?.data?.accessToken;
      const possibleUser =
        data?.user || data?.data?.user || data?.userData || data?.data || data;
      localStorage.setItem("token", token);
      let selectedPlan = JSON.parse(localStorage.getItem("selectedPlan"));

      if (!selectedPlan) {
        toast.error("No plan selected");
        return;
      }

      let finalUser = null;
      if (
        possibleUser &&
        typeof possibleUser === "object" &&
        (possibleUser.email || possibleUser.name || possibleUser.id)
      ) {
        finalUser = possibleUser;
      } else if (data?.user && typeof data.user === "object") {
        finalUser = data.user;
      } else {
        // Fallback: create a minimal user object using submitted email
        finalUser = {
          email: formData.email,
          name: data?.name || data?.fullName || "",
        };
      }

      // Persist token if provided (useful for later API calls)
      try {
        if (token && chrome?.storage?.local) {
          chrome.storage.local.set({ authToken: token });
        }
      } catch (e) {
        // ignore storage errors in extension environment
        console.warn("Could not save auth token to chrome.storage:", e);
      }
      const { planId, durationType } = selectedPlan;
      console.log("finalUser", finalUser);
      await handlePayment(planId, durationType, finalUser);
      console.log(
        "singnup success - user:",
        finalUser,
        "token:",
        Boolean(token)
      );
      router.push("/pricing");
    } catch (err) {
      let msg = err?.response?.data?.message;
      toast.error(msg || "Network error. Please try again.");
      setApiError("Network error. Please try again.");
    }
    setIsLoading(false);
  }

  // async function handleSubmit(e) {
  //    e.preventDefault();
  //   try {
  //     const res = await fetch(`${url}/api/v1/user/register`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         name: formData.name,
  //         email: formData.email,
  //         password: formData.password,
  //         confirmPassword: formData.confirmPassword,
  //         phone: formData.phone,
  //       }),
  //     });
  //         const data = await res.json();

  //   console.log("Signup data:", data);
  //     let selectedPlan = JSON.parse(localStorage.getItem("selectedPlan"));
  //     if (!selectedPlan) {
  //       toast.error("No plan selected");
  //       return;
  //     }
  //          const token =data?.token

  //     // const possibleUser =
  //     //   data?.user || data?.data?.user || data?.userData || data?.data || data;
  //     localStorage.setItem("token", token);
  //     const { planId, durationType } = selectedPlan;
  //      await handlePayment(planId, durationType, data,token)
  //      router.push("/pricing")
  //   } catch (error) {
  //     let msg = error?.response?.data.message;
  //     toast.error(msg || "Internal Server Error");
  //   }
  // }
  return (
    <>
      <div className="min-h-screen bg-white text-slate-800">
        <Header />
        <div className="flex flex-center justify-center align-center">
          <div className="w-[30%] bg-gray-50 rounded-xl shadow-m m-3 ">
            {/* Header */}
            <div className="flex items-center p-4 border-b border-gray-100">
              <button
                onClick={() => router.push("/pricing")}
                className="mr-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaArrowLeft className="w-5  text-gray-600" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Sign Up</h1>
            </div>

            <div className="flex-1 p-6">
              {/* Logo and Welcome Message */}
              <div className="text-center ">
                <div className="w-25  h-10 mx-auto">
                  <img
                    src={Images.logowhitebg}
                    alt="Sellinder Logo"
                    className="w-full h-full object-contain "
                  />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Welcome
                </h2>
                <p className="text-sm text-gray-600">
                  Please enter the credentials
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {apiError && (
                  <div className="text-xs text-red-600 mb-2 text-center">
                    {apiError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${
                      errors.email
                        ? "border-red-300 focus:ring-red-200"
                        : "border-gray-300 focus:ring-orange-200"
                    } focus:outline-none focus:ring-2`}
                    placeholder="Enter your Name"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${
                      errors.password
                        ? "border-red-300 focus:ring-red-200"
                        : "border-gray-300 focus:ring-orange-200"
                    } focus:outline-none focus:ring-2`}
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    confirmPassword
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${
                      errors.confirmPassword
                        ? "border-red-300 focus:ring-red-200"
                        : "border-gray-300 focus:ring-orange-200"
                    } focus:outline-none focus:ring-2`}
                    placeholder="Enter your password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="Number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${
                      errors.email
                        ? "border-red-300 focus:ring-red-200"
                        : "border-gray-300 focus:ring-orange-200"
                    } focus:outline-none focus:ring-2`}
                    placeholder="Enter your Phone Number"
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
                  {isLoading ? "Signing Up..." : "Sign Up"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Alredy have an account?{" "}
                  <button
                    onClick={() => router.push("/login")}
                    className="text-orange-500 hover:text-orange-600 font-medium"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};
export default SignUP;
