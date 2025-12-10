import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const defaultBillingSnapshot = {
	currentPlanName: "—",
	billingPeriod: "—",
	currentPlanRenewsOn: "—",
	monthlySpendAmount: "—",
	monthlySpendNote: "",
	usageCreditsTotal: "—",
	usageCreditsRemainingText: "",
	paymentMethodLabel: "—",
	paymentMethodNote: "",
	invoices: []
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD"
});

const formatCurrency = (value) => {
	if (value === null || value === undefined || value === "") return "—";
	if (typeof value === "number") return currencyFormatter.format(value);
	const trimmed = String(value).trim();
	if (!trimmed) return "—";
	if (trimmed.startsWith("$")) return trimmed;
	const numeric = Number(trimmed.replace(/,/g, ""));
	if (!Number.isNaN(numeric)) return currencyFormatter.format(numeric);
	return trimmed;
};

const stripLeadingDollar = (value) => {
	if (value === null || value === undefined) return value;
	if (typeof value !== "string") return value;
	const cleaned = value.trim().replace(/^\$/, "").trim();
	return cleaned || value;
};

const formatNumber = (value) => {
	if (value === null || value === undefined || value === "") return "—";
	if (typeof value === "number") return value.toLocaleString();
	const numeric = Number(String(value).replace(/,/g, ""));
	if (!Number.isNaN(numeric)) return numeric.toLocaleString();
	return String(value);
};

const formatDisplayDate = (value) => {
	if (!value) return "—";
	let date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		const localizedMatch = String(value).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:,\s*(\d{1,2}):(\d{2})\s*(am|pm))?/i);
		if (localizedMatch) {
			const [, day, month, year, hour = "0", minute = "0", meridiem] = localizedMatch;
			let hours = Number(hour);
			if (meridiem) {
				const isPM = meridiem.toLowerCase() === "pm";
				hours = (hours % 12) + (isPM ? 12 : 0);
			}
			date = new Date(Number(year), Number(month) - 1, Number(day), hours, Number(minute));
		}
	}
	if (Number.isNaN(date.getTime())) return String(value);
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "2-digit",
		year: "numeric"
	});
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

const normalizeInvoices = (rawInvoices) => {
	const list = Array.isArray(rawInvoices)
		? rawInvoices
		: Array.isArray(rawInvoices?.data)
			? rawInvoices.data
			: Array.isArray(rawInvoices?.items)
				? rawInvoices.items
				: [];
	return list.map((invoice, index) => {
		const statusValue =
			invoice?.status ||
			invoice?.paymentStatus ||
			invoice?.invoice_status ||
			invoice?.state ||
			"Pending";
		return {
			id:
				invoice?.id ||
				invoice?.invoiceId ||
				invoice?.InvoiceNo ||
				invoice?.reference ||
				`INV-${String(index + 1).padStart(3, "0")}`,
			date: formatDisplayDate(
				invoice?.date ||
				invoice?.createdAt ||
				invoice?.plan_start_date ||
				invoice?.paidAt ||
				invoice?.billingDate
			),
			amount: stripLeadingDollar(formatCurrency(
				invoice?.amount ??
				invoice?.Amount ??
				invoice?.total ??
				invoice?.due ??
				invoice?.subtotal
			)),
			status: String(statusValue).replace(/_/g, " "),
			receiptUrl: invoice?.receiptUrl || invoice?.downloadUrl || invoice?.pdfUrl || invoice?.url || ""
		};
	});
};

const normalizeBillingPayload = (payload) => {
	const source = payload?.data || payload?.result || payload?.billing || payload;
	const invoicesFromGet = Array.isArray(payload?.getresult) ? payload.getresult : [];
	const activeInvoice = invoicesFromGet[0] || null;
	const durationLabel =
		activeInvoice?.duration
			? `${activeInvoice.duration.charAt(0).toUpperCase()}${activeInvoice.duration.slice(1)} plan`
			: undefined;
	const mergedSource =
		activeInvoice && typeof activeInvoice === "object"
			? {
				...source,
				// Preserve original plan name from API response
				name: source?.name || activeInvoice?.name,
				PlanId: source?.PlanId || activeInvoice?.PlanId,
				currentPlan: {
					name: source?.name || source?.PlanId?.name || activeInvoice?.PlanId?.Package || durationLabel || source?.currentPlan?.name || activeInvoice?.InvoiceNo,
					renewDate: activeInvoice.plan_expiry_date
				},
				monthlySpend: activeInvoice.Amount ?? source?.monthlySpend,
				usageCredits: {
					total: activeInvoice?.userId?.SearchLimit ?? source?.usageCredits?.total,
					remaining: activeInvoice?.userId?.SearchLimit ?? source?.usageCredits?.remaining
				},
				paymentMethod: source?.paymentMethod || activeInvoice?.TransactionId || activeInvoice?.RazorpayOrderId,
				invoices: invoicesFromGet
			}
			: source;

	if (!mergedSource || typeof mergedSource !== "object") return {};

	const usage =
		mergedSource?.usageCredits ||
		mergedSource?.usage ||
		mergedSource?.credits ||
		mergedSource?.usage_summary ||
		{};
	const usageRemaining =
		usage?.remaining ??
		usage?.balance ??
		(typeof usage?.limit === "number" && typeof usage?.used === "number"
			? usage.limit - usage.used
			: usage?.total ?? null);
	const usageLimit = usage?.limit ?? usage?.total ?? usage?.included ?? usage?.quota;
	const payment = mergedSource?.paymentMethod || mergedSource?.card || mergedSource?.defaultPaymentMethod;
	let paymentLabel = "—";
	if (typeof payment === "string") {
		const trimmed = payment.trim();
		if (trimmed.startsWith("pay_")) {
			paymentLabel = `Payment ${trimmed.slice(-6)}`;
		} else if (trimmed.startsWith("txn_")) {
			paymentLabel = `Transaction ${trimmed.slice(-6)}`;
		} else if (trimmed) {
			paymentLabel = trimmed;
		}
	} else if (payment && typeof payment === "object") {
		const brand = payment?.brand || payment?.cardBrand || payment?.type;
		const last4 = payment?.last4 || payment?.cardLastFour || payment?.lastDigits;
		if (brand && last4) {
			paymentLabel = `${brand} ending ${last4}`;
		} else {
			paymentLabel = payment?.displayName || payment?.label || paymentLabel;
		}
	}

	return {
		currentPlanName:
			mergedSource?.PlanId?.Package ||
			mergedSource?.name ||
			mergedSource?.PlanId?.name ||
			mergedSource?.planName ||
			mergedSource?.plan?.name ||
			mergedSource?.subscriptionName ||
			mergedSource?.currentPlan?.name ||
			"—",
		billingPeriod:
			mergedSource?.duration ||
			mergedSource?.billingPeriod ||
			mergedSource?.period ||
			(activeInvoice?.duration ? `${activeInvoice.duration.charAt(0).toUpperCase()}${activeInvoice.duration.slice(1)}` : "Monthly"),
		currentPlanRenewsOn: formatDisplayDate(
			mergedSource?.currentPlan?.renewDate ||
			mergedSource?.planRenewsOn ||
			mergedSource?.nextBillingDate ||
			mergedSource?.renewDate ||
			mergedSource?.renewsOn
		),
		monthlySpendAmount: formatCurrency(
			mergedSource?.monthlySpend ??
			mergedSource?.planAmount ??
			mergedSource?.amount ??
			mergedSource?.price ??
			mergedSource?.billingAmount ??
			payload?.totalAmount
		),
		monthlySpendNote:
			mergedSource?.monthlySpendNote ||
			mergedSource?.billingNote ||
			(activeInvoice?.plan_start_date
				? `Started ${formatDisplayDate(activeInvoice.plan_start_date)}${
					activeInvoice?.plan_expiry_date ? ` · Ends ${formatDisplayDate(activeInvoice.plan_expiry_date)}` : ""
				}`
				: mergedSource?.billingDay
					? `Billed on day ${mergedSource.billingDay} of each month`
					: durationLabel || ""),
		usageCreditsTotal: formatNumber(usage?.total ?? usageLimit),
		usageCreditsRemainingText:
			usageRemaining !== null && usageRemaining !== undefined
				? `${formatNumber(usageRemaining)} credits remaining${
					usageLimit ? ` of ${formatNumber(usageLimit)}` : ""
				}`
				: usage?.note || "",
		// Show Razorpay as the common payment method label for all users
		paymentMethodLabel: "Razorpay",
		paymentMethodNote: mergedSource?.paymentMethodNote || payment?.note || "",
		invoices: normalizeInvoices(
			mergedSource?.invoices ||
			mergedSource?.invoiceHistory ||
			mergedSource?.payments ||
			mergedSource?.records ||
			mergedSource?.transactions ||
			invoicesFromGet
		)
	};
};

const BillingDashboardPage = () => {
	const url = process.env.NEXT_PUBLIC_API_URL;
	const [billing, setBilling] = useState(defaultBillingSnapshot);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		let isMounted = true;

		const fetchBillingDetails = async () => {
			if (typeof window === "undefined") return;
			setIsLoading(true);
			setError("");

			try {
				if (!url) throw new Error("API URL is missing.");
				const token = localStorage.getItem("token");
				if (!token) throw new Error("Please log in to view billing details.");

				const userRes = await fetch(`${url}/api/v1/user/details`, {
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

				const billingRes = await fetch(`${url}/user/billing/get/${userId}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`
					}
				});
				const billingJson = await billingRes.json();
				if (!billingRes.ok) throw new Error(billingJson?.message || "Failed to load billing details.");

				const normalized = normalizeBillingPayload(billingJson);
				if (isMounted) {
					setBilling({ ...defaultBillingSnapshot, ...normalized });
				}
			} catch (err) {
				console.error("Billing fetch error:", err);
				if (isMounted) setError(err.message || "Failed to load billing details.");
			} finally {
				if (isMounted) setIsLoading(false);
			}
		};

		fetchBillingDetails();
		return () => {
			isMounted = false;
		};
	}, [url]);

	return (
		<DashboardLayout>
			{() => (
				<div className="space-y-6 max-w-6xl mx-auto">
					<header>
						<h1 className="text-2xl font-bold mb-2">Billing</h1>
						<p className="text-slate-600">Track subscription status, invoices, and payment methods for your organization.</p>
					</header>

					{error && (
						<div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
							{error}
						</div>
					)}

					{isLoading ? (
						<div className="flex justify-center items-center py-12">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
						</div>
					) : (
						<>
							<section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
								<div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
									<p className="text-xs uppercase text-slate-500">Current Plan</p>
									<p className="text-lg font-semibold text-slate-800 mt-2">{billing.currentPlanName}</p>
								</div>
								<div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
									<p className="text-xs uppercase text-slate-500">Billing Period</p>
									<p className="text-lg font-semibold text-slate-800 mt-2">{billing.billingPeriod}</p>
									<p className="text-sm text-slate-600 mt-1">Renews {billing.currentPlanRenewsOn}</p>
								</div>
								<div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
									<p className="text-xs uppercase text-slate-500">Monthly or Yearly Spending</p>
									<p className="text-lg font-semibold text-slate-800 mt-2">{stripLeadingDollar(billing.monthlySpendAmount)}</p>
									<p className="text-sm text-slate-600 mt-1">{billing.monthlySpendNote || ""}</p>
								</div>
								<div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
									<p className="text-xs uppercase text-slate-500">Usage Credits</p>
									<p className="text-lg font-semibold text-slate-800 mt-2">{billing.usageCreditsTotal}</p>
									<p className="text-sm text-slate-600 mt-1">{billing.usageCreditsRemainingText || "—"}</p>
								</div>
								<div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
									<p className="text-xs uppercase text-slate-500">Payment Method</p>
									<p className="text-lg font-semibold text-slate-800 mt-2">{billing.paymentMethodLabel}</p>
									{billing.paymentMethodNote && <p className="text-sm text-slate-600 mt-1">{billing.paymentMethodNote}</p>}
								</div>
							</section>

							<section className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
								<div className="flex items-center justify-between mb-4">
									<h2 className="text-lg font-semibold">Invoice History</h2>
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
											{billing.invoices.length === 0 ? (
												<tr>
													<td colSpan={5} className="py-6 text-center text-slate-500">
														No invoices available yet.
													</td>
												</tr>
											) : (
												billing.invoices.map((invoice) => (
													<tr key={invoice.id}>
														<td className="py-3 pr-4 font-medium">{invoice.id}</td>
														<td className="py-3 pr-4">{invoice.date}</td>
														<td className="py-3 pr-4">{invoice.amount}</td>
														<td className="py-3 pr-4">
															<span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
																{invoice.status}
															</span>
														</td>
														<td className="py-3 pr-4">
															<a
																href={`/dashboard/billing/invoice/${invoice.id}`}
																target="_blank"
																rel="noopener noreferrer"
																className="text-sm font-medium text-sky-600 hover:underline"
															>
																View
															</a>
														</td>
													</tr>
												))
											)}
										</tbody>
									</table>
								</div>
							</section>
						</>
					)}
				</div>
			)}
		</DashboardLayout>
	);
};

export default BillingDashboardPage;
