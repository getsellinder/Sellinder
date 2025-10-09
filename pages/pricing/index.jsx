import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from "axios";
import  usePlan  from "../../components/PricingContext";

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

let pricingsubtitle = {
    fontSize: "1rem",
    lineHeight: "1.6",
    color: "#475569",
    maxWidth: "600px",
  }

  let pricingtitle = {
    fontSize: "1rem",
    lineHeight: "1.6",
    color: "#475569",
    maxWidth: "600px",
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

                  <div className="text-sm text-slate-600" style={{fontWeight:"600"}}>{item.Package}</div>
                  {item.Package === "Enterprise" && <div className="mt-2 text-2xl font-bold">Custom</div>}


                  {/* <div className="mt-2 text-2xl font-bold">
                    {yearly ? `${item.Total_Yearly_Price == null ? 0 : item.Total_Yearly_Price} ` : `${item.Total_Monthly_Price == null ? 0 : item.Total_Monthly_Price} `}
                    <span className="text-sm">{yearly ? "/yr" : "/mo"}</span>
                  </div> */}
                  <div className="mt-2 text-2xl font-bold">
                    {item.Package !== "Enterprise" && (
                      <>
                        {yearly
                          ? `${item.Total_Yearly_Price == null ? 0 : item.Total_Yearly_Price}`
                          : `${item.Total_Monthly_Price == null ? 0 : item.Total_Monthly_Price}`}
                        <span className="text-sm">{yearly ? "/yr" : "/mo"}</span>
                      </>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    <div className="text-sm text-gray-500" style={{...pricingtitle}}>
                      {yearly ? (
                        item.Package === "Free" ? (
                          "Yearly: Free"
                        ) : item.Package === "Pro" || item.Package === "Growth" ? (
                          "Billed yearly (2 months free)"
                        ) : item.Package === "Enterprise" ? (
                          "Contact Sales for pricing"
                        ) : null
                      ) : item.Package === "Free" ? (
                        ""
                      ) : item.Package === "Pro" || item.Package === "Growth" ? (
                        "Monthly billing available"
                      ) : item.Package === "Enterprise" ? (
                        "Contact Sales for pricing"
                      ) : null}
                    </div>

                  </div>
                  <div className="mt-3 text-sm text-slate-600 text-left">

                    {yearly ? item.Yearly_features.map((data) => (
                      <div style={{...pricingsubtitle}}>• {data}</div>
                    )) : item.Monthly_features.map((data) => (
                      <div style={{...pricingsubtitle}}>• {data}</div>
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
                    <button onClick={() => Router.push("/contactsales")}

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
                    <button onClick={() => handlePlanSelect(item)}
                     
                      className="inline-block w-full px-4 py-2 rounded-lg border border-slate-200"
                    >
                      Start Free
                    </button>
                  </div>}



                </div>
              )
            })}

         
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default index;
