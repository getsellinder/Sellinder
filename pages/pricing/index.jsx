import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from "axios";
import { usePlan } from "./PricingContext";

import { useRouter } from "next/router";

const index = () => {
  const { allPlans, allPlanLoading, handlePayment, yearly, setYearly } = usePlan()

  const togglePricing = () => setYearly((v) => !v);
  const Router = useRouter()

  const handlePlanSelect = (item) => {
    const durationType = yearly ? "yearly" : "monthly";

    const selectedPlan = {
      planId: item._id,
      durationType,
    };
    localStorage.setItem("selectedPlan", JSON.stringify(selectedPlan))
    Router.push(`/login/`)

  }



  return (
    <>
      <div className="min-h-screen bg-white text-slate-800">
        <Header />
        <h1 className="text-3xl font-bold text-center w-100 mt-4">Pricing Plans</h1>
        <section id="pricing" className="mt-12 p- max-w-6xl mx-auto px-6 ">

          <div className="flex items-center justify-between w-full">
            <div className="w-1/2">
              <h3 className="text-xl font-bold ">💳 Pricing Plans</h3>
              <p className="mt-2 text-slate-600">
                Choose a plan that fits your team and scale as you grow. Growth Plan
                is our <span className="font-semibold">Most Popular</span> choice —
                best balance of value and team usage.
              </p>
            </div>

            <div className="flex items-center gap-3 ">

              <span className="text-sm text-slate-600">Monthly</span>
              <button
                onClick={togglePricing}
                aria-pressed={yearly}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${yearly ? "bg-orange-500" : "bg-slate-300"
                  }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${yearly ? "translate-x-6" : "translate-x-1"
                    }`}
                ></span>
              </button>
              <span className="text-sm text-slate-600">Yearly</span>
            </div>
          </div>

          <div className="mt-6 grid gap-6 grid-cols-1 md:grid-cols-4">
            {allPlanLoading ? <span style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1rem", fontWeight: "bolder" }}>Loading......</span> : allPlans.map((item, index) => {
              return (
                <div className="p-6 border-2 border-orange-300 rounded-2xl text-center relative bg-white"
                  style={{ cursor: "pointer" }}>
                  {item.Package === "Growth" && <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="px-3 py-1 bg-orange-500 text-white text-xs rounded-full font-semibold">
                      Most Popular ⭐
                    </div>
                  </div>}

                  <div className="text-sm text-slate-500">{item.Package}</div>
                  {item.Package === "Enterprise" && <div className="mt-2 text-2xl font-bold">Custom</div>}


                  <div className="mt-2 text-2xl font-bold">
                    {yearly ? `${item.Total_Yearly_Price == null ? 0 : item.Total_Yearly_Price} ` : `${item.Total_Monthly_Price == null ? 0 : item.Total_Monthly_Price} `}
                    <span className="text-sm">{yearly ? "/yr" : "/mo"}</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    {yearly
                      ? "Billed yearly (2 months free)"
                      : "Monthly billing available"}
                  </div>
                  <div className="mt-3 text-sm text-slate-600 text-left">

                    {yearly ? item.Yearly_features.map((data) => (
                      <div>• {data}</div>
                    )) : item.Monthly_features.map((data) => (
                      <div>• {data}</div>
                    ))}
                  </div>
                  {item.Package === "Growth" && <div className="mt-6">
                    <button
                      onClick={() => handlePlanSelect(item)}
                      className="inline-block w-full px-4 py-2 rounded-lg bg-orange-600 text-white font-semibold"
                    >
                      Start Growth
                    </button>
                  </div>}
                  {item.Package === "Enterprise" && <div className="mt-6">
                    <button onClick={() => handlePlanSelect(item)}

                      className="inline-block w-full px-4 py-2 rounded-lg border border-slate-200"
                    >
                      Contact Sales
                    </button>
                  </div>}

                  {item.Package === "Pro" && <div className="mt-6">
                    <button onClick={() => handlePlanSelect(item)}

                      className="inline-block w-full px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold"
                    >
                      Start Pro
                    </button>
                  </div>}

                  {item.Package === "Free" && <div className="mt-6">
                    <a
                      href="#"
                      className="inline-block w-full px-4 py-2 rounded-lg border border-slate-200"
                    >
                      Start Free
                    </a>
                  </div>}



                </div>
              )
            })}

            {/* <>

       
            <div className="p-6 border rounded-2xl text-center">
              <div className="text-sm text-slate-500">Free</div>
              <div className="mt-2 text-2xl font-bold">
                ₹0<span className="text-sm">/mo</span>
              </div>
              <div className="mt-1 text-xs text-slate-400">
                {yearly ? "Yearly: Free" : ""}
              </div>
              <div className="mt-3 text-sm text-slate-600 text-left">
                <div>• {yearly ? "24 searches / year" : "2 searches / month"}</div>
                <div>• 1 user</div>
                <div>• Interest Prediction</div>
                <div>• Buyer Insights</div>
                <div>• Conversation Playbook</div>
                <div>• Objection Handling</div>
              </div>
              <div className="mt-6">
                <a
                  href="#"
                  className="inline-block w-full px-4 py-2 rounded-lg border border-slate-200"
                >
                  Start Free
                </a>
              </div>
            </div>

           
            <div className="p-6 border rounded-2xl text-center">
              <div className="text-sm text-slate-500">Pro</div>
              <div className="mt-2 text-2xl font-bold">
                {yearly ? "₹29,990" : "₹2,999"}
                <span className="text-sm">{yearly ? "/yr" : "/mo"}</span>
              </div>
              <div className="mt-1 text-xs text-slate-400">
                {yearly
                  ? "Billed yearly (2 months free)"
                  : "Monthly billing available"}
              </div>
              <div className="mt-3 text-sm text-slate-600 text-left">
                <div>
                  • {yearly ? "240 searches / year" : "40 searches / month"}
                </div>
                <div>• 1 user</div>
                <div>• Interest Prediction</div>
                <div>• Buyer Insights</div>
                <div>• Conversation Playbook</div>
                <div>• Objection Handling</div>
              </div>
              <div className="mt-6">
                <a
                  href="#"
                  className="inline-block w-full px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold"
                >
                  Start Pro
                </a>
              </div>
            </div>

        
            <div className="p-6 border-2 border-orange-300 rounded-2xl text-center relative bg-white">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="px-3 py-1 bg-orange-500 text-white text-xs rounded-full font-semibold">
                  Most Popular ⭐
                </div>
              </div>
              <div className="text-sm text-slate-500">Growth</div>
              <div className="mt-2 text-2xl font-bold">
                {yearly ? "₹51,990" : "₹5,199"}
                <span className="text-sm">{yearly ? "/yr" : "/mo"}</span>
              </div>
              <div className="mt-1 text-xs text-slate-400">
                {yearly
                  ? "Billed yearly (2 months free)"
                  : "Monthly billing available"}
              </div>
              <div className="mt-3 text-sm text-slate-600 text-left">
                <div>
                  • {yearly ? "600 searches / year" : "80 searches / month"}
                </div>
                <div>• Up to 3 users</div>
                <div>• Interest Prediction</div>
                <div>• Buyer Insights</div>
                <div>• Conversation Playbook</div>
                <div>• Objection Handling</div>
              </div>
              <div className="mt-6">
                <a
                  href="#"
                  className="inline-block w-full px-4 py-2 rounded-lg bg-orange-600 text-white font-semibold"
                >
                  Start Growth
                </a>
              </div>
            </div>

        
            <div className="p-6 border rounded-2xl text-center">
              <div className="text-sm text-slate-500">Enterprise</div>
              <div className="mt-2 text-2xl font-bold">Custom</div>
              <div className="mt-1 text-xs text-slate-400">
                Contact Sales for pricing
              </div>
              <div className="mt-3 text-sm text-slate-600 text-left">
                <div>• Custom quota</div>
                <div>• Flexible users</div>
                <div>• Interest Prediction</div>
                <div>• Buyer Insights</div>
                <div>• Conversation Playbook</div>
                <div>• Objection Handling</div>
                <div>• API access</div>
                <div>• CRM integration</div>
                <div>• Dedicated support</div>
              </div>
              <div className="mt-6">
                <a
                  href="#"
                  className="inline-block w-full px-4 py-2 rounded-lg border border-slate-200"
                >
                  Contact Sales
                </a>
              </div>
            </div>
            </> */}
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default index;
