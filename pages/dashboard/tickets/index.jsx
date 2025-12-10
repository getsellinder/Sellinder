import { useRouter } from "next/router";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useTicket } from "../../../components/SupportContext";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { isAutheticated } from "../../../components/isAuthticated";

export default function TicketsPage() {
  const router = useRouter();
  const {
    PageLimit,
    handleViewTicketDelete,
    allticketes,
    loading,
    setSearchInput,
    userId,
    searchInput,
    setStatus,
    status,
    handleAllTickets,
    errorMessage,
    delloading,
    setCurrentPage,
  } = useTicket();

  // Create ticket modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "",
    priority: ""
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.description || !formData.category || !formData.priority) {
      toast.error("Please fill out all fields");
      return;
    }
    const url = process.env.NEXT_PUBLIC_API_URL;
    const token = isAutheticated();
    const effectiveUserId = userId || (typeof window !== "undefined" ? localStorage.getItem("userId") : null);

    try {
      setCreateLoading(true);
      await axios.post(
        `${url}/api/support/create`,
        { ...formData, userId: effectiveUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Ticket created successfully");
      setShowCreateModal(false);
      setFormData({ subject: "", description: "", category: "", priority: "" });
      handleAllTickets(1, PageLimit, searchInput, status, effectiveUserId);
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || "Failed to create ticket";
      toast.error(msg);
    } finally {
      setCreateLoading(false);
    }
  };

  useEffect(() => {
    handleAllTickets(1, PageLimit, searchInput, status, userId);
  }, [userId]);
  let tickets = allticketes?.data;

  return (
    <DashboardLayout>
      <div className="p-6 ">
        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-2">Ticketing System</h1>
        <p className="text-gray-400 mb-6">
          Log, track, and resolve issues reported by tenant admins.
        </p>

        {/* Create Ticket Button */}
        <div className="flex justify-end w-full mb-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition"
          >
            🎫 Create New Ticket
          </button>
        </div>

        {/* Create Ticket Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
              <h2 className="text-xl font-semibold mb-4 text-slate-800">Create Ticket</h2>
              <form onSubmit={handleCreateTicket} className="space-y-4">
                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleFormChange}
                    placeholder="Enter subject"
                    required
                    className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-green-200"
                  />
                </div>
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Enter description"
                    required
                    rows={3}
                    className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-green-200 resize-y"
                  />
                </div>
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    placeholder="Enter category"
                    required
                    className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-green-200"
                  />
                </div>
                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleFormChange}
                    required
                    className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-green-200"
                  >
                    <option value="">Select priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                {/* Submit */}
                <button
                  type="submit"
                  disabled={createLoading}
                  className="w-full py-3 rounded-md bg-green-500 text-white font-semibold hover:bg-green-600 transition disabled:opacity-60"
                >
                  {createLoading ? "Submitting..." : "Submit Ticket"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Filters Row */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <input
            value={searchInput}
            onChange={(e) => {
              let val = e.target.value;
              setSearchInput(val);
              handleAllTickets(1, PageLimit, val, status, userId);
            }}
            type="text"
            placeholder="Search tickets..."
            className="bg-white border border-gray-200 text-slate-700 p-3 rounded-lg w-64 outline-none shadow-sm focus:ring-2 focus:ring-sky-200"
          />

          {/* <select className="bg-[#1a1c24] border border-gray-700 p-3 rounded-lg text-white w-48 outline-none">
            <option>All Priorities</option>
            <option>High</option>
            <option>Medium</option>
          </select> */}

          {/* <select className="bg-[#1a1c24] border border-gray-700 p-3 rounded-lg text-white w-48 outline-none">
            <option>All Categories</option>
            <option>Technical</option>
            <option>Billing</option>
          </select> */}

          <select
            className="bg-white border border-gray-200 p-3 rounded-lg text-slate-700 w-48 outline-none shadow-sm focus:ring-2 focus:ring-sky-200"
            value={status}
            onChange={(e) => {
              let val = e.target.value;
              setStatus(val);
              handleAllTickets(1, PageLimit, searchInput, val, userId);
            }}
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto text-slate-800">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <table className="min-w-full border-collapse">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left"></th>

                  <th className="px-4 py-3 text-left">Created At</th>
                  <th className="px-4 py-3 text-left">Ticket Id</th>
                  <th className="px-4 py-3 text-left">Subject</th>
                  <th className="px-4 py-3 text-left">Priority</th>
                  <th className="px-4 py-3 text-left">Category</th>

                  <th className="px-4 py-3 text-left">Resolved By</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Messages</th>
                </tr>
              </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="h-36 text-center text-slate-500">
                    Loading.....
                  </td>
                </tr>
              ) : errorMessage ? (
                <tr>
                  <td colSpan={9} className="h-36 text-center text-red-600">
                    {errorMessage}
                  </td>
                </tr>
              ) : tickets?.length === 0 ? (
                <tr>
                  <td colSpan={9} className="h-36 text-center text-slate-500">
                    No Tickets Found
                  </td>
                </tr>
              ) : (
                tickets?.map((t, idx) => (
                  <tr key={t._id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-sky-50 border-b border-gray-100`}> 
                    <td className="px-4 py-3 text-sm text-slate-500">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{t.createdAt}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{t.ticketId}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{t.subject}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${t.priority === 'High' ? 'bg-red-100 text-red-700' : t.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                        {t.priority || 'Normal'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{t.category}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{t.resolvedAt || '-'}</td>
                    <td className="px-4 py-3">
                      {/* Status badge */}
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${t.status === 'OPEN' ? 'bg-green-100 text-green-800' : t.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
                        {t.status || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-3">
                      <button
                        onClick={() => router.push(`/dashboard/message/${t._id}`)}
                        className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleViewTicketDelete(t._id)}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-sm"
                      >
                        {delloading === t._id ? "loading..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
          {allticketes?.totalItems === 4 && (
            <div className="flex items-center justify-center space-x-2 mt-6">
              {/* PREV BUTTON */}
              <button
                className="px-3 py-1 bg-gray-800 text-white rounded-lg disabled:opacity-40"
                disabled={PageLimit === 1}
                onClick={() => {
                  const newPage = PageLimit - 1;
                  setCurrentPage(newPage);
                  handleAllTickets(
                    newPage,
                    PageLimit,
                    searchInput,
                    status,
                    userId
                  );
                }}
              >
                Prev
              </button>

              {/* SHOW CURRENT PAGE / TOTAL PAGE */}
              <span className="px-3 py-1 bg-gray-700 text-white rounded-lg">
                {allticketes?.totalPage}
              </span>

              {/* NEXT BUTTON */}
              <button
                className="px-3 py-1 bg-gray-800 text-white rounded-lg disabled:opacity-40"
                disabled={PageLimit === allticketes?.totalPage}
                onClick={() => {
                  const newPage = PageLimit + 1;
                  setCurrentPage(newPage);
                  handleAllTickets(
                    newPage,
                    PageLimit,
                    searchInput,
                    status,
                    userId
                  );
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
