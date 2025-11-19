import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import usePlan from "../../../components/PricingContext";

const PlansDashboardPage = () => {
  const [userPlan, setUserPlan] = useState(null);
  const [allPlans, setAllPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const [userId,setUserId]=useState(null)
  const {handlePayment}=usePlan()
  useEffect(()=>{
    
  const id=localStorage.getItem("userId") 
  setUserId(id)
   
  },[])

  console.log("userId",userId)
  const formatPrice = (price) => {
    if (!price) return "—";
    return typeof price === "number" ? price.toLocaleString() : String(price);
  };

  const extractUserId = (payload) => {
    const source = payload?.data || payload?.user || payload?.result || payload;
    return (
      source?.id ||
      source?._id ||
      source?.userId ||
      source?.user?.id ||
      source?.user?._id ||
      source?.data?.id ||
      source?.data?._id ||
      source?.data?.userId ||
      null
    );
  };


  const isPlanExpired = (plan) => {
    if (!plan) return true;
    const expiryDate = plan?.plan_expiry_date || plan?.expiryDate || plan?.expiry;
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    return expiry < now;
  };

  const hasValidPlan = (plan) => {
    if (!plan) return false;
    // Check if plan has PlanId (indicates actual subscription)
    if (!plan.PlanId) return false;
    // Check if plan has invoice data
    if (!plan.InvoiceNo) return false;
    // Check if not expired
    return !isPlanExpired(plan);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short", 
      day: "2-digit"
    });
  };

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setError("");
      
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!baseUrl) throw new Error("API URL is missing.");
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Please log in to view plans.");

        // First, get user profile to extract user ID
        const userRes = await fetch(`${baseUrl}/api/v1/user/details`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        if (!userRes.ok) throw new Error("Unable to load user profile.");
        const userJson = await userRes.json();
        const userId = extractUserId(userJson);
        if (!userId) throw new Error("Could not determine user ID.");

        // Fetch user's current plan from billing API (handle 403 as no plan)
        try {
          const userPlanRes = await fetch(`${baseUrl}/user/billing/get/${userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          });

          if (userPlanRes.ok) {
            const userPlanData = await userPlanRes.json();
            console.log("User plan response:", userPlanData);
            // Extract plan data from billing response
            const planData = userPlanData?.getresult?.[0] || userPlanData?.data || userPlanData?.result || userPlanData;
            setUserPlan(planData);
          } else if (userPlanRes.status === 403) {
            // 403 means user has no active plan, this is expected for new users
            console.log("No active plan found - user will see all available plans");
            setUserPlan(null);
          } else if (userPlanRes.status === 404) {
            // 404 means endpoint not found or user not found
            console.log("User plan endpoint not found - showing all available plans");
            setUserPlan(null);
          } else {
            // Other errors (401, 500, etc.)
            console.warn(`User plan fetch returned ${userPlanRes.status}: ${userPlanRes.statusText}`);
            setUserPlan(null);
          }
        } catch (planErr) {
          // Network or parsing errors - this is expected for users without plans
          console.log("No user plan available - displaying all plans for selection");
          setUserPlan(null);
        }

        // Fetch all available plans
        const allPlansRes = await fetch(`${baseUrl}/api/package/get/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        if (allPlansRes.ok) {
          const allPlansData = await allPlansRes.json();
          console.log("All plans response:", allPlansData);
          // Extract plans array from various possible response structures
          const plansArray = allPlansData?.getpackages || allPlansData?.data || allPlansData?.packages || allPlansData?.result || allPlansData || [];
          setAllPlans(Array.isArray(plansArray) ? plansArray : []);
        } else {
          console.warn("Failed to fetch all plans, using fallback");
          setAllPlans([]);
        }

      } catch (err) {
        setError(err.message || "Failed to load plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  
  return (
    <DashboardLayout>
      {() => (
        <div className="space-y-6 max-w-6xl mx-auto">
          <header>
            <h1 className="text-2xl font-bold mb-2">Plans</h1>
            <p className="text-slate-600">Review and manage the subscription plans available to your account.</p>
          </header>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="text-slate-600">Loading plans...</div>
            </div>
          ) : (
            <div className="space-y-8">
              {hasValidPlan(userPlan) ? (
                <>
                  {/* Current Plan Section */}
                  <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
                      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-800">
                              {userPlan?.PlanId?.Package || userPlan?.PlanId?.name || userPlan?.name || "Current Plan"}
                            </h3>
                            <p className="text-slate-600 mt-1">
                              {userPlan?.PlanId?.name || "Your active subscription plan"}
                            </p>
                            
                            {/* Plan Features */}
                            {userPlan?.PlanId && (
                              <div className="mt-4">
                                <p className="font-medium text-slate-700 mb-2">Plan Features:</p>
                                <ul className="list-disc list-inside text-slate-600 space-y-1 text-sm">
                                  {userPlan.duration === 'yearly' && userPlan.PlanId.Yearly_features ? (
                                    userPlan.PlanId.Yearly_features.map((feature, idx) => (
                                      <li key={idx}>{feature}</li>
                                    ))
                                  ) : userPlan.PlanId.Monthly_features ? (
                                    userPlan.PlanId.Monthly_features.map((feature, idx) => (
                                      <li key={idx}>{feature}</li>
                                    ))
                                  ) : (
                                    <>
                                      <li>{userPlan.PlanId.SearchLimitMonthly || userPlan.PlanId.SearchLimitYearly || 80} Profile / {userPlan.duration || 'month'}</li>
                                      <li>Up to {userPlan.PlanId.monthlyUserLimit || userPlan.PlanId.yearlyUserLimit || 3} users</li>
                                      <li>Interest Prediction</li>
                                      <li>Buyer Insights</li>
                                      <li>Conversation Playbook</li>
                                      <li>Objection Handling</li>
                                    </>
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Billing Summary Section */}
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Billing Summary</h2>
                      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Plan Type:</span>
                            <span className="font-medium">{userPlan?.duration || "Monthly"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Amount Paid:</span>
                            <span className="font-medium">₹{formatPrice(userPlan?.Amount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Usage Credits:</span>
                            <span className="font-medium">{userPlan?.userId?.SearchLimit || "—"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Payment Status:</span>
                            <span className="text-green-600 font-medium">{userPlan?.status || "Active"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Next Billing:</span>
                            <span className="font-medium">{formatDate(userPlan?.plan_expiry_date)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </>
              ) : null}

              {/* All Plans Section - Only show if no active plan or plan expired */}
              {!hasValidPlan(userPlan) && (
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-center">
                    {userPlan && isPlanExpired(userPlan) ? "Your Plan Has Expired - Choose a New Plan" : "Choose Your Plan"}
                  </h2>
                
                {/* Billing Period Toggle */}
                <div className="flex justify-center mb-8">
                  <div className="bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => setBillingPeriod("monthly")}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        billingPeriod === "monthly"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingPeriod("yearly")}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        billingPeriod === "yearly"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Yearly
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                  {Array.isArray(allPlans) && allPlans.length > 0 ? (
                    allPlans.map((plan, index) => {
                      const isPopular = index === 2; // Making Growth plan (index 2) popular
                      const planName = plan?.Package || plan?.name || plan?.planName || ['Free', 'Pro', 'Growth', 'Enterprise'][index] || `Plan ${index + 1}`;
                      const planType = planName.toLowerCase().replace(/\s+plan/i, '').trim(); // Extract plan type (free, pro, growth, enterprise)
                      const monthlyPrices = [0, 2999, 5199, 'Custom'];
                      const yearlyPrices = [0, 29990, 51990, 'Custom']; // Yearly prices (10 months pricing)
                      const planPrice = billingPeriod === "yearly" 
                        ? (plan?.Total_Yearly_Price || plan?.yearlyPrice || plan?.yearly_amount || yearlyPrices[index] || 0)
                        : (plan?.Total_Monthly_Price || plan?.price || plan?.amount || monthlyPrices[index] || 0);
                      
                      return (
                        <div 
                          key={plan?.id || plan?._id || index}
                          className="bg-white border-2 border-orange-200 rounded-2xl p-6 hover:shadow-lg transition-shadow relative"
                        >
                          {isPopular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                              <span className="bg-orange-500 text-white text-sm font-medium px-4 py-1 rounded-full flex items-center">
                                <span className="mr-1">⭐</span>
                                Most Popular
                              </span>
                            </div>
                          )}
                          
                          <div className="text-center">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-2">
                              {planName}
                            </h3>
                            
                            <div className="mb-4">
                              {planName === 'Enterprise' ? (
                                <div>
                                  <div className="text-4xl font-bold text-gray-900">Custom</div>
                                </div>
                              ) : (
                                <div>
                                  <span className="text-4xl font-bold text-gray-900">
                                    {formatPrice(planPrice)}
                                  </span>
                                  <span className="text-gray-600">/{billingPeriod === "yearly" ? "year" : "mo"}</span>
                                </div>
                              )}
                              
                              {planName !== 'Free' && planName !== 'Enterprise' && (
                                <p className="text-gray-500 text-sm mt-1">
                                  {billingPeriod === "yearly" ? "Yearly billing (2 months free)" : "Monthly billing available"}
                                </p>
                              )}
                              {planName === 'Enterprise' && (
                                <p className="text-gray-500 text-sm mt-1">Contact Sales for pricing</p>
                              )}
                            </div>

                            {/* Features List */}
                            <div className="space-y-2 text-left mb-6 min-h-[180px]">
                              {(() => {
                                // Always use custom features that change with billing period
                                // This ensures profile limits update correctly
                                if (planType === 'free') {
                                  return (
                                    <>
                                      <p className="text-gray-600 text-sm">
                                        • {billingPeriod === "yearly" ? "24 Profile / year" : "2 Profile / month"}
                                      </p>
                                      <p className="text-gray-600 text-sm">• 1 user</p>
                                      <p className="text-gray-600 text-sm">• Interest Prediction</p>
                                      <p className="text-gray-600 text-sm">• Buyer Insights</p>
                                      <p className="text-gray-600 text-sm">• Conversation Playbook</p>
                                      <p className="text-gray-600 text-sm">• Objection Handling</p>
                                    </>
                                  );
                                } else if (planType === 'pro') {
                                  return (
                                    <>
                                      <p className="text-gray-600 text-sm">
                                        • {billingPeriod === "yearly" ? "240 Profile / year" : "20 Profile / month"}
                                      </p>
                                      <p className="text-gray-600 text-sm">• 1 user</p>
                                      <p className="text-gray-600 text-sm">• Interest Prediction</p>
                                      <p className="text-gray-600 text-sm">• Buyer Insights</p>
                                      <p className="text-gray-600 text-sm">• Conversation Playbook</p>
                                      <p className="text-gray-600 text-sm">• Objection Handling</p>
                                    </>
                                  );
                                } else if (planType === 'growth') {
                                  return (
                                    <>
                                      <p className="text-gray-600 text-sm">
                                        • {billingPeriod === "yearly" ? "960 Profile / year" : "80 Profile / month"}
                                      </p>
                                      <p className="text-gray-600 text-sm">• Up to 3 users</p>
                                      <p className="text-gray-600 text-sm">• Interest Prediction</p>
                                      <p className="text-gray-600 text-sm">• Buyer Insights</p>
                                      <p className="text-gray-600 text-sm">• Conversation Playbook</p>
                                      <p className="text-gray-600 text-sm">• Objection Handling</p>
                                    </>
                                  );
                                } else if (planType === 'enterprise') {
                                  return (
                                    <>
                                      <p className="text-gray-600 text-sm">• Custom quota</p>
                                      <p className="text-gray-600 text-sm">• Flexible users</p>
                                      <p className="text-gray-600 text-sm">• Interest Prediction</p>
                                      <p className="text-gray-600 text-sm">• Buyer Insights</p>
                                      <p className="text-gray-600 text-sm">• Conversation Playbook</p>
                                      <p className="text-gray-600 text-sm">• Objection Handling</p>
                                      <p className="text-gray-600 text-sm">• Dedicated support</p>
                                    </>
                                  );
                                }
                                
                                return null;
                              })()}
                            </div>

                            <button  onClick={()=>handlePayment(plan._id,billingPeriod,userId)}
                              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                                planType === 'free'
                                  ? "bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                                  : planType === 'enterprise'
                                    ? "bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                                    : "bg-orange-500 text-white hover:bg-orange-600"
                              }`}
                            >
                              {planType === 'free'
                                ? "Start Free"
                                : planType === 'pro'
                                  ? "Start Pro"
                                  : planType === 'growth'
                                    ? "Start Growth"
                                    : planType === 'enterprise'
                                      ? "Contact Sales"
                                      : `Start ${planName}`
                              }
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    // Fallback static plans if API doesn't return data
                    <>
                      {/* Free Plan */}
                      <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                        <div className="text-center">
                          <h3 className="text-xl font-semibold text-gray-800 mb-4">Free</h3>
                          <div className="mb-4">
                            <span className="text-4xl font-bold text-gray-900">0</span>
                            <span className="text-gray-600">/mo</span>
                          </div>
                          <div className="space-y-3 text-left mb-6">
                            <p className="text-gray-600 text-sm">
                              • {billingPeriod === "yearly" ? "24 Profile / year" : "2 Profile / month"}
                            </p>
                            <p className="text-gray-600 text-sm">• 1 user</p>
                            <p className="text-gray-600 text-sm">• Interest Prediction</p>
                            <p className="text-gray-600 text-sm">• Buyer Insights</p>
                            <p className="text-gray-600 text-sm">• Conversation Playbook</p>
                            <p className="text-gray-600 text-sm">• Objection Handling</p>
                          </div>
                          <button className="w-full py-3 px-4 rounded-lg font-medium bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                            Start Free
                          </button>
                        </div>
                      </div>

                      {/* Pro Plan */}
                      <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                        <div className="text-center">
                          <h3 className="text-xl font-semibold text-gray-800 mb-4">Pro</h3>
                          <div className="mb-4">
                            <span className="text-4xl font-bold text-gray-900">
                              {billingPeriod === "yearly" ? "29990" : "2999"}
                            </span>
                            <span className="text-gray-600">/{billingPeriod === "yearly" ? "year" : "mo"}</span>
                            <p className="text-gray-500 text-sm mt-1">
                              {billingPeriod === "yearly" ? "Yearly billing (2 months free)" : "Monthly billing available"}
                            </p>
                          </div>
                          <div className="space-y-3 text-left mb-6">
                            <p className="text-gray-600 text-sm">
                              • {billingPeriod === "yearly" ? "240 Profile / year" : "20 Profile / month"}
                            </p>
                            <p className="text-gray-600 text-sm">• 1 user</p>
                            <p className="text-gray-600 text-sm">• Interest Prediction</p>
                            <p className="text-gray-600 text-sm">• Buyer Insights</p>
                            <p className="text-gray-600 text-sm">• Conversation Playbook</p>
                            <p className="text-gray-600 text-sm">• Objection Handling</p>
                          </div>
                          <button className="w-full py-3 px-4 rounded-lg font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors">
                            Start Pro
                          </button>
                        </div>
                      </div>

                      {/* Growth Plan - Most Popular */}
                      <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 hover:shadow-lg transition-shadow relative">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-orange-500 text-white text-sm font-medium px-4 py-1 rounded-full flex items-center">
                            <span className="mr-1">⭐</span>
                            Most Popular
                          </span>
                        </div>
                        <div className="text-center">
                          <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-2">Growth</h3>
                          <div className="mb-4">
                            <span className="text-4xl font-bold text-gray-900">
                              {billingPeriod === "yearly" ? "51990" : "5199"}
                            </span>
                            <span className="text-gray-600">/{billingPeriod === "yearly" ? "year" : "mo"}</span>
                            <p className="text-gray-500 text-sm mt-1">
                              {billingPeriod === "yearly" ? "Yearly billing (2 months free)" : "Monthly billing available"}
                            </p>
                          </div>
                          <div className="space-y-3 text-left mb-6">
                            <p className="text-gray-600 text-sm">
                              • {billingPeriod === "yearly" ? "960 Profile / year" : "80 Profile / month"}
                            </p>
                            <p className="text-gray-600 text-sm">• Up to 3 users</p>
                            <p className="text-gray-600 text-sm">• Interest Prediction</p>
                            <p className="text-gray-600 text-sm">• Buyer Insights</p>
                            <p className="text-gray-600 text-sm">• Conversation Playbook</p>
                            <p className="text-gray-600 text-sm">• Objection Handling</p>
                          </div>
                          <button className="w-full py-3 px-4 rounded-lg font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors">
                            Start Growth
                          </button>
                        </div>
                      </div>

                      {/* Enterprise Plan */}
                      <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                        <div className="text-center">
                          <h3 className="text-xl font-semibold text-gray-800 mb-4">Enterprise</h3>
                          <div className="mb-4">
                            <div className="text-4xl font-bold text-gray-900">Custom</div>
                            <p className="text-gray-500 text-sm mt-1">Contact Sales for pricing</p>
                          </div>
                          <div className="space-y-3 text-left mb-6">
                            <p className="text-gray-600 text-sm">• Custom quota</p>
                            <p className="text-gray-600 text-sm">• Flexible users</p>
                            <p className="text-gray-600 text-sm">• Interest Prediction</p>
                            <p className="text-gray-600 text-sm">• Buyer Insights</p>
                            <p className="text-gray-600 text-sm">• Conversation Playbook</p>
                            <p className="text-gray-600 text-sm">• Objection Handling</p>
                            <p className="text-gray-600 text-sm">• Dedicated support</p>
                          </div>
                          <button className="w-full py-3 px-4 rounded-lg font-medium bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                            Contact Sales
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </section>
              )}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default PlansDashboardPage;
