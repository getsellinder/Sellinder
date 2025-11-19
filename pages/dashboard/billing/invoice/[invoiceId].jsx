import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "../../../../components/dashboard/DashboardLayout";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});
// Keep a plain numeric formatting (no currency symbol) for invoice display
const formatPlainAmount = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  const numeric = Number(String(value).replace(/[^0-9.]/g, ""));
  if (!Number.isNaN(numeric)) {
    return numeric.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  // If not numeric, just return stripped leading $ and commas untouched
  return String(value).replace(/^\$/g, "");
};
const formatDisplayDate = (value) => {
  if (!value) return "—";
  let date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};

const InvoiceViewerPage = () => {
  const router = useRouter();
  const { invoiceId, url } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [invoice, setInvoice] = useState(null);

  const receiptUrl = useMemo(() => {
    const raw = Array.isArray(url) ? url[0] : url;
    return raw ? decodeURIComponent(raw) : null;
  }, [url]);

  useEffect(() => {
    const run = async () => {
      if (!invoiceId) return;
      setLoading(true);
      setError("");
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!baseUrl) throw new Error("API URL is missing.");
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) throw new Error("Please log in to view invoices.");

        const userRes = await fetch(`${baseUrl}/api/v1/user/details`, {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
        });
        if (!userRes.ok) throw new Error("Failed to load user details.");
        const userJson = await userRes.json();
        const userPayload = userJson?.data || userJson?.user || userJson;
        const userId = userPayload?.id || userPayload?._id || userPayload?.userId;
        if (!userId) throw new Error("Could not determine user ID.");

        const invRes = await fetch(`${baseUrl}/user/billing/get/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
        });
        const invJson = await invRes.json();
        if (!invRes.ok) throw new Error(invJson?.message || "Failed to load invoices.");

        const list = Array.isArray(invJson?.getresult)
          ? invJson.getresult
          : Array.isArray(invJson?.data)
          ? invJson.data
          : [];

        const found = list.find((it) => {
          const candidates = [it?.InvoiceNo, it?._id, it?.invoiceId, it?.id].filter(Boolean).map(String);
          return candidates.includes(String(invoiceId));
        });
        if (!found) throw new Error("Invoice not found.");

        setInvoice(found);
      } catch (e) {
        setError(e.message || "Failed to load invoice.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [invoiceId]);

  const effectiveReceiptUrl = useMemo(() => {
    if (receiptUrl) return receiptUrl;
    if (!invoice) return null;
    return invoice?.receiptUrl || invoice?.downloadUrl || invoice?.pdfUrl || invoice?.url || null;
  }, [receiptUrl, invoice]);

  return (
    <DashboardLayout>
      {() => (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          <div>
            <button onClick={() => router.push('/dashboard/billing')} className="text-sm text-slate-600 hover:underline">← Back to billing</button>
          </div>

          <h1 className="text-2xl font-semibold">Invoice {invoiceId || ""}</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
          )}

          {loading ? (
            <div className="text-sm text-slate-600">Loading invoice…</div>
          ) : (
            <div className="space-y-8">
              {invoice && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                    <div className="space-y-1">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">Invoice</p>
                        <p className="text-lg font-semibold text-slate-800">{invoice?.InvoiceNo || invoiceId}</p>
                      </div>
                      <p className="text-sm text-slate-600">Status: <span className="font-medium capitalize">{invoice?.status || invoice?.invoice_status || '—'}</span></p>
                    </div>
                    <div className="text-sm text-slate-600 space-y-1">
                      <p><span className="text-slate-500">Issued:</span> {invoice?.createdAt || formatDisplayDate(invoice?.plan_start_date)}</p>
                      <p><span className="text-slate-500">Plan Start:</span> {formatDisplayDate(invoice?.plan_start_date)}</p>
                      <p><span className="text-slate-500">Plan End:</span> {formatDisplayDate(invoice?.plan_expiry_date)}</p>
                    </div>
                  </div>

                  {/* Parties */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-sm">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wide text-slate-500">Billed To</p>
                      <p className="font-medium text-slate-800">{invoice?.userId?.name || 'User'}</p>
                      <p className="text-slate-600">User ID: {invoice?.userId?._id || '—'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wide text-slate-500">Transaction</p>
                      <p className="text-slate-600">Transaction ID: <span className="font-medium">{invoice?.TransactionId || '—'}</span></p>
                      <p className="text-slate-600">Order ID: <span className="font-medium">{invoice?.RazorpayOrderId || '—'}</span></p>
                    </div>
                  </div>

                  {/* Line Items */}
                  <div className="overflow-x-auto mb-6">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-slate-500">
                          <th className="py-2 text-left">Description</th>
                          <th className="py-2 text-left">Duration</th>
                          <th className="py-2 text-left">Start</th>
                          <th className="py-2 text-left">End</th>
                          <th className="py-2 text-left">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-slate-700">
                        <tr>
                          <td className="py-2">{invoice?.duration ? `${invoice.duration.charAt(0).toUpperCase()}${invoice.duration.slice(1)} plan` : 'Subscription Plan'}</td>
                          <td className="py-2 capitalize">{invoice?.duration || '—'}</td>
                          <td className="py-2">{formatDisplayDate(invoice?.plan_start_date)}</td>
                          <td className="py-2">{formatDisplayDate(invoice?.plan_expiry_date)}</td>
                          <td className="py-2">{formatPlainAmount(invoice?.Amount ?? invoice?.amount)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="flex flex-col items-start md:items-end">
                    <div className="w-full md:w-80 space-y-3 text-sm">
                      {(() => {
                        // Calculate amounts based on plan data
                        const totalAmount = Number(String((invoice?.Amount ?? invoice?.amount) || 0).replace(/[^0-9.]/g, "")) || 0;
                        const isYearly = invoice?.duration === 'yearly';
                        
                        // Get GST amount from PlanId
                        const gstAmount = isYearly 
                          ? (invoice?.PlanId?.gstYearlyPrice || 0)
                          : (invoice?.PlanId?.gstMonthlyPrice || 0);
                        
                        // Calculate base price (before GST)
                        const basePrice = isYearly
                          ? (invoice?.PlanId?.Yearly_Price || totalAmount - gstAmount)
                          : (invoice?.PlanId?.Monthly_Price || totalAmount - gstAmount);
                        
                        return (
                          <>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Subtotal</span>
                              <span className="font-medium text-slate-800">{formatPlainAmount(basePrice)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">GST (18%)</span>
                              <span className="font-medium text-slate-800">{formatPlainAmount(gstAmount)}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-200 pt-2">
                              <span className="text-slate-600 font-medium">Total</span>
                              <span className="font-semibold text-slate-900 text-lg">{formatPlainAmount(totalAmount)}</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Footer Note */}
                  <div className="mt-8 text-xs text-slate-500">This invoice was generated from subscription billing data. Keep this for your records.</div>
                </div>
              )}

              {effectiveReceiptUrl && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                  <p className="text-sm mb-3 text-slate-600">Embedded receipt (if supported by your browser):</p>
                  <div style={{ width: '100%', height: '70vh', borderRadius: 6, overflow: 'hidden' }}>
                    <iframe title={`Invoice-${invoiceId}`} src={effectiveReceiptUrl} style={{ width: '100%', height: '100%', border: 'none' }} />
                  </div>
                  <div className="mt-3 text-sm">
                    <a href={effectiveReceiptUrl} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">Open original / download</a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default InvoiceViewerPage;
