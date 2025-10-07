"use client"


import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { isAutheticated } from "./isAuthticated";

const PlanContext = createContext()


export const AppProvider = ({ children }) => {
    const token = isAutheticated()
    const url = process.env.NEXT_PUBLIC_API_URL
    // const [token, setToken] = useState(null)
    const [allPlans, setAllPlans] = useState([])
    const [allPlanLoading, setAllPlansLoading] = useState(false)
    const [yearly, setYearly] = useState(false);

    console.log("token from the local storage", token)
    // getAllPlan

    const handleAllPlans = async () => {
        try {
            setAllPlansLoading(true)
            const resp = await axios.get(`${url}/api/package/get/all`)
            let plans = resp?.data.getpackages

            setAllPlans(plans)

        } catch (error) {
            console.log("handleAllPlans.error", error)
            let msg = error.response?.data.message
            toast.error(msg || "Internal Server Error")
        } finally {
            setAllPlansLoading(false)
        }
    }

    const handlePayment = async (planId, durationType, finalUser) => {
        try {
            const resp = await axios.post(
                `${url}/api/package/purchase/${planId}`,
                { durationType: durationType },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

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
                handler: (response) => {
                    toast.success(`✅ Payment Successful!\nPayment ID: ${response.razorpay_payment_id}`);
                },
                prefill: {
                    name: finalUser?.name || "User",
                    email: finalUser?.email || "user@example.com",
                    contact: "9999999999",
                },
                theme: {
                    color: "#3399cc",
                },
            };
            const razor = new window.Razorpay(options);
            razor.open();
        } catch (error) {
            let msg = error.response.data.message
            console.error('Payment initiation failed:', error.message);
            toast.error("Internal Server error")
        }
    }

    useEffect(() => {
        handleAllPlans()
    }, [])
    // useEffect(() => {
    //     const storedToken = localStorage.getItem("token");
    //     if (storedToken) {
    //         setToken(storedToken)
    //     }
    // }, [])


    return (
        <PlanContext.Provider value={{ allPlans, allPlanLoading, handlePayment, yearly, setYearly }}>{children}</PlanContext.Provider>
    )
}

 const usePlan = () => useContext(PlanContext)

 export default usePlan