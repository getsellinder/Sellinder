import React from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const DashboardPage = () => {
  return (
    <DashboardLayout>
      {({ user }) => (
        <div className="space-y-6">
          <header>
            <h1 className="text-2xl font-bold mb-2">Welcome{user?.name ? `, ${user.name}` : ""}</h1>
            <p className="text-slate-600">This is your dashboard. Use the sidebar to navigate.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4">Overview card</div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">Billing summary</div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">Recent activity</div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;
