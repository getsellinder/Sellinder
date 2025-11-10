import React from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const PlansDashboardPage = () => {
  return (
    <DashboardLayout>
      {() => (
        <div className="space-y-6 max-w-6xl mx-auto">
          <header>
            <h1 className="text-2xl font-bold mb-2">Plans</h1>
            <p className="text-slate-600">Review and manage the subscription plans available to your account.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Current Plan</h2>
              <p className="text-sm text-slate-600">Details about the plan you are currently subscribed to.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Upgrade Options</h2>
              <p className="text-sm text-slate-600">Explore additional features by upgrading your plan.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Billing Summary</h2>
              <p className="text-sm text-slate-600">Keep an eye on upcoming charges and billing cycles.</p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PlansDashboardPage;
