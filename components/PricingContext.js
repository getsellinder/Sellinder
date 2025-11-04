"use client";

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { isAutheticated } from "./isAuthticated";

const PlanContext = createContext();

export const AppProvider = ({ children }) => {
  const token = isAutheticated();
  const url = process.env.NEXT_PUBLIC_API_URL;
  // const [token, setToken] = useState(null)
  const [allPlans, setAllPlans] = useState([]);
  const [allPlanLoading, setAllPlansLoading] = useState(false);
  const [yearly, setYearly] = useState(false);

  const [loading, setLoading] = useState(false);
  const [appdetails, setAppDetails] = useState([]);

  const GetAllAPPdetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${url}/api/config/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let resp = res.data.result;
      if (resp) {
        setAppDetails(resp);
      }
    } catch (error) {
      let msg = error.response.data.message;
      toast.error(msg || "Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  // getAllPlan

  const handleAllPlans = async () => {
    try {
      setAllPlansLoading(true);
      const resp = await axios.get(`${url}/api/package/get/all`);
      let plans = resp?.data.getpackages;

      setAllPlans(plans);
    } catch (error) {
      console.log("handleAllPlans.error", error);
      let msg = error.response?.data.message;
      toast.error(msg || "Internal Server Error");
    } finally {
      setAllPlansLoading(false);
    }
  };

  const ConfirmPayment = async (
    planId,
    durationType,

    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,

    planAmount,
        paymentStatus,
    userId
  ) => {
    // durationType, razorpayPaymentId, planAmount, orderId
    try {
      const data = {
        durationType: durationType,
        razorpayPaymentId: razorpayPaymentId,
        planAmount: planAmount,
        paymentStatus,
        razorpayOrderId,
        razorpaySignature,
        userId: userId, 
      };
      console.log("data.confirm",data)
  

      const resp = await axios.post(
        `${url}/api/package/confirm/pyment/${planId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.data.message === "Free plan activated successfully") {
        toast.success("🎉 Free plan activated successfully!");
        localStorage.removeItem("selectedPlan");
        return; // stop here, don't open Razorpay
      }
      localStorage.removeItem("selectedPlan");
    } catch (error) {
      let msg = error?.response?.data?.message;
      console.error("Payment initiation failed:", error.message);
      toast.error(msg || "Internal Server error");
    }
  };

  const handlePayment = async (planId, durationType, finalUser) => {
    try {
      const userId = finalUser?.userId;
      console.log("userId finalUser", userId);
      const resp = await axios.post(
        `${url}/api/package/purchase/${planId}`,
        { durationType: durationType, userId: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.data.message === "Free plan activated successfully") {
        toast.success("🎉 Free plan activated successfully!");
        return; // stop here, don't open Razorpay
      }
      console.log("payment succesfuuly after payemnt data", resp.data);
      const { key_id, amount, currency, order_id } = resp.data;
      if (!window.Razorpay) {
        console.error("Razorpay SDK not loaded");
        return;
      }
      const options = {
        key: key_id,
        currency,
        name: "Sellinder",
        description: "Plan Purchase",
        order_id,
        handler: async (response) => {
          console.log("response", response);
          ConfirmPayment(
            planId,
            durationType,
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature,
            amount,
            "success",

            userId
          );
          toast.success(
            `✅ Payment Successful!\nPayment ID: ${response.razorpay_payment_id}`
          );
        },
        prefill: {
          name: finalUser?.name || "User",
          email: finalUser?.email || "user@example.com",
          contact: finalUser?.phone || "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: async function () {
            await ConfirmPayment(
              // planId,
              // durationType,
              // null,
              // 0,
              // "failed",
              // userId

              planId,
            durationType,
           null, // response.razorpay_payment_id,
           null, // response.razorpay_order_id,
           null, //response.razorpay_signature,
            amount,
            "failed",

            userId
            );

            toast.error("❌ Payment Failed or Cancelled");
          },
        },
      };
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      let msg = error?.response?.data?.message;
      console.error("Payment initiation failed:", error.message);
      toast.error(msg || "Internal Server error");
    }
  };

  useEffect(() => {
    handleAllPlans();
    GetAllAPPdetails();
  }, []);
  // useEffect(() => {
  //     const storedToken = localStorage.getItem("token");
  //     if (storedToken) {
  //         setToken(storedToken)
  //     }
  // }, [])

  return (
    <PlanContext.Provider
      value={{
        allPlans,
        allPlanLoading,
        handlePayment,
        yearly,
        setYearly,
        appdetails,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

const usePlan = () => useContext(PlanContext);

export default usePlan;
