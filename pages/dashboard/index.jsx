import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

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

const formatDisplayDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  });
};

const DashboardPage = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [completedCount, setCompletedCount] = useState(0);
  const [remainingCredits, setRemainingCredits] = useState(null);
  const [totalCredits, setTotalCredits] = useState(null);
  const [currentPlanName, setCurrentPlanName] = useState("—");
  const [billingPeriod, setBillingPeriod] = useState("—");
  const [nextBillingDate, setNextBillingDate] = useState("—");

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      if (typeof window === "undefined") return;
      if (!apiUrl) return;

      setIsLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view your dashboard summary.");
          return;
        }

        // Get user details to determine userId
        const userRes = await fetch(`${apiUrl}/api/v1/user/details`, {
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

        // Fetch history total (completed searches)
        const historyPromise = fetch(`${apiUrl}/api/linked/disc/user/${userId}?page=1&limit=1`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        })
          .then(async (res) => {
            if (!res.ok) return;
            const data = await res.json();
            const total =
              data?.total ||
              data?.totalCount ||
              data?.count ||
              (Array.isArray(data?.data) ? data.data.length : 0);
            if (typeof total === "number" && !Number.isNaN(total)) {
              setCompletedCount(total);
            }
          })
          .catch(() => {});

        // Fetch billing details (remaining searches & current plan)
        const billingPromise = fetch(`${apiUrl}/user/billing/get/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        })
          .then(async (res) => {
            const billingJson = await res.json().catch(() => ({}));
            if (!res.ok) return;

            const invoices = Array.isArray(billingJson?.getresult)
              ? billingJson.getresult
              : [];
            const activeInvoice = invoices[0] || null;
            const source = billingJson?.data || billingJson?.result || billingJson || {};
            const planObj =
              activeInvoice?.PlanId ||
              source?.PlanId ||
              source?.plan ||
              {};

            const planName =
              planObj?.Package ||
              planObj?.name ||
              source?.name ||
              "—";
            const duration =
              activeInvoice?.duration ||
              source?.duration ||
              source?.billingPeriod ||
              "—";

            const credits =
              activeInvoice?.userId?.SearchLimit ??
              source?.usageCredits?.remaining ??
              source?.usageCredits?.total ??
              null;
            const creditsTotal =
              source?.usageCredits?.limit ??
              source?.usageCredits?.total ??
              credits ??
              null;

            const renewDateRaw =
              activeInvoice?.plan_expiry_date ||
              source?.plan_expiry_date ||
              source?.nextBillingDate ||
              null;

            setCurrentPlanName(planName || "—");
            setBillingPeriod(duration || "—");
            setRemainingCredits(
              typeof credits === "number" && !Number.isNaN(credits)
                ? credits
                : credits !== null
                  ? Number(credits) || null
                  : null
            );
            setTotalCredits(
              typeof creditsTotal === "number" && !Number.isNaN(creditsTotal)
                ? creditsTotal
                : creditsTotal !== null
                  ? Number(creditsTotal) || null
                  : null
            );
            setNextBillingDate(formatDisplayDate(renewDateRaw));
          })
          .catch(() => {});

        await Promise.all([historyPromise, billingPromise]);
      } catch (err) {
        setError(err.message || "Failed to load dashboard summary.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardSummary();
  }, [apiUrl]);

  return (
    <DashboardLayout>
      {({ user }) => (
        <div className="space-y-6">
          <header>
            <h1 className="text-2xl font-bold mb-2">Welcome{user?.name ? `, ${user.name}` : ""}</h1>
            <p className="text-slate-600">Your key usage and plan overview at a glance.</p>
          </header>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-10 w-10 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin" />
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-6xl">
            {/* Remaining Searches */}
            <div className="rounded-xl p-4 shadow-sm border border-transparent bg-gradient-to-br from-sky-50 to-sky-100">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">Remaining searches</p>
              <p className="mt-2 text-2xl font-bold text-sky-900">
                {remainingCredits !== null ? remainingCredits.toLocaleString() : "—"}
              </p>
              {totalCredits && (
                <p className="mt-0.5 text-xs text-sky-700">
                  of {totalCredits.toLocaleString()} total credits
                </p>
              )}
              <p className="mt-2 text-[11px] text-sky-700/80">
                Based on your current subscription usage.
              </p>
            </div>

            {/* Completed Searches */}
            <div className="rounded-xl p-4 shadow-sm border border-transparent bg-gradient-to-br from-emerald-50 to-emerald-100">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">Completed searches</p>
              <p className="mt-2 text-2xl font-bold text-emerald-900">
                {completedCount.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-emerald-700">
                Total analyses recorded in your history.
              </p>
            </div>

            {/* Current Plan */}
            <div className="rounded-xl p-4 shadow-sm border border-transparent bg-gradient-to-br from-amber-50 to-orange-100">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">Current plan</p>
              <p className="mt-2 text-lg font-semibold text-amber-900">{currentPlanName}</p>
              <p className="mt-1 text-xs text-amber-800">
                Billing: {billingPeriod || "—"}
              </p>
              <p className="mt-1 text-[11px] text-amber-700/80">
                Next billing date: {nextBillingDate}
              </p>
            </div>
          </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;
