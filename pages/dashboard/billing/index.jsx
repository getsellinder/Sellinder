import React from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const BillingDashboardPage = () => {
	const invoices = [
		{ id: "INV-010", date: "Nov 01, 2025", amount: "$129.00", status: "Paid" },
		{ id: "INV-009", date: "Oct 01, 2025", amount: "$129.00", status: "Paid" },
		{ id: "INV-008", date: "Sep 01, 2025", amount: "$129.00", status: "Paid" }
	];

	return (
		<DashboardLayout>
			{() => (
				<div className="space-y-6 max-w-6xl mx-auto">
					<header>
						<h1 className="text-2xl font-bold mb-2">Billing</h1>
						<p className="text-slate-600">Track subscription status, invoices, and payment methods for your organization.</p>
					</header>

					<section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
						<div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
							<p className="text-xs uppercase text-slate-500">Current Plan</p>
							<p className="text-lg font-semibold text-slate-800 mt-2">Growth</p>
							<p className="text-sm text-slate-600 mt-1">Renews Dec 01, 2025</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
							<p className="text-xs uppercase text-slate-500">Monthly Spend</p>
							<p className="text-lg font-semibold text-slate-800 mt-2">$129.00</p>
							<p className="text-sm text-slate-600 mt-1">Billed on the 1st of each month</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
							<p className="text-xs uppercase text-slate-500">Usage Credits</p>
							<p className="text-lg font-semibold text-slate-800 mt-2">8,500</p>
							<p className="text-sm text-slate-600 mt-1">1,500 credits remaining</p>
						</div>
						<div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
							<p className="text-xs uppercase text-slate-500">Payment Method</p>
							<p className="text-lg font-semibold text-slate-800 mt-2">Visa ending 4242</p>
							<button className="mt-3 text-sm font-medium text-sky-600 hover:underline">Update</button>
						</div>
					</section>

					<section className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-semibold">Invoice History</h2>
							<button className="text-sm font-medium text-sky-600 hover:underline">Download all</button>
						</div>
						<div className="overflow-x-auto">
							<table className="min-w-full text-left text-sm">
								<thead>
									<tr className="text-slate-500 uppercase text-xs tracking-wide border-b border-gray-200">
										<th className="py-3 pr-4">Invoice</th>
										<th className="py-3 pr-4">Date</th>
										<th className="py-3 pr-4">Amount</th>
										<th className="py-3 pr-4">Status</th>
										<th className="py-3 pr-4">Receipt</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-100 text-slate-700">
									{invoices.map((invoice) => (
										<tr key={invoice.id}>
											<td className="py-3 pr-4 font-medium">{invoice.id}</td>
											<td className="py-3 pr-4">{invoice.date}</td>
											<td className="py-3 pr-4">{invoice.amount}</td>
											<td className="py-3 pr-4">
												<span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{invoice.status}</span>
											</td>
											<td className="py-3 pr-4">
												<button className="text-sm font-medium text-sky-600 hover:underline">Download</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</section>
				</div>
			)}
		</DashboardLayout>
	);
};

export default BillingDashboardPage;
