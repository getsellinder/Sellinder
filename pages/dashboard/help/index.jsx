import React from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const HelpDashboardPage = () => {
  return (
    <DashboardLayout>
      {() => (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Help Center</h1>
            <p className="text-xl text-gray-600 mb-2">This page not yet created</p>
            <p className="text-lg text-gray-500">Coming Soon</p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default HelpDashboardPage;
