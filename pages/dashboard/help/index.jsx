import React from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const HelpDashboardPage = () => {
  return (
    <DashboardLayout>
      {() => (
        <div className="space-y-6 max-w-4xl mx-auto">
          <header>
            <h1 className="text-2xl font-bold mb-2">Help Center</h1>
            <p className="text-slate-600">Find answers to common questions or reach out to the support team.</p>
          </header>

          <div className="space-y-4">
            <section className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Getting Started</h2>
              <p className="text-sm text-slate-600">Learn how to set up your Sellinder account and start automating responses.</p>
            </section>
            <section className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">FAQs</h2>
              <p className="text-sm text-slate-600">Browse frequently asked questions to resolve issues quickly.</p>
            </section>
            <section className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Contact Support</h2>
              <p className="text-sm text-slate-600">Still need help? Submit a ticket and our team will assist you shortly.</p>
            </section>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default HelpDashboardPage;
