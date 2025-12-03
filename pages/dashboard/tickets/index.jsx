import { useRouter } from "next/router";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useTicket } from "../../../components/SupportContext";
import { useEffect } from "react";

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
        {/* 
<div className="flex justify-end w-full">
  <button className="flex items-center gap-2 px-5 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition">
    🎫 Create Ticket
  </button>
</div> */}

        {/* Filters Row */}
        <div className="flex flex-wrap gap-4 mb-6 ">
          <input
            value={searchInput}
            onChange={(e) => {
              let val = e.target.value;
              setSearchInput(val);
              handleAllTickets(1, PageLimit, val, status, userId);
            }}
            type="text"
            placeholder="Search tickets..."
            className="bg-[#1a1c24] border border-gray-700 text-white p-3 rounded-lg w-64 outline-none focus:border-blue-500"
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
            className="bg-[#1a1c24] border border-gray-700 p-3 rounded-lg text-white w-48 outline-none"
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
        <div className="overflow-x-auto text-black">
          <table className="min-w-full border-collapse  rounded-lg overflow-hidden">
            <thead className="bg-[#1b1e27] text-gray-300">
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
                  <td
                    colSpan={8}
                    style={{ height: "150px", textAlign: "center" }}
                  >
                    <span>Loading.....</span>
                  </td>
                </tr>
              ) : errorMessage ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{ height: "150px", textAlign: "center" }}
                  >
                    <span>{errorMessage}</span>
                  </td>
                </tr>
              ) : tickets?.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{ height: "150px", textAlign: "center" }}
                  >
                    <span>No Tickets Found</span>
                  </td>
                </tr>
              ) : (
                tickets?.map((t) => (
                  <tr key={t._id} className="border-b border-gray-700">
                    <td className="px-4 py-3">{t.id}</td>
                    <td className="px-4 py-3">{t.createdAt}</td>
                    <td className="px-4 py-3">{t.ticketId}</td>
                    <td className="px-4 py-3">{t.subject}</td>
                    <td className="px-4 py-3">{t.priority}</td>
                    <td className="px-4 py-3">{t.category}</td>
                    <td className="px-4 py-3">{t.resolvedAt || "-"}</td>
                    <td className="px-4 py-3">{t.status}</td>
                    <td className="px-4 py-3 flex gap-3">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/message/${t._id}`)
                        }
                        className="w-32 bg-blue-500 text-white px-4 py-2 rounded-lg"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleViewTicketDelete(t._id)}
                        className="w-32 bg-red-500 text-white px-4 py-2 rounded-lg"
                      >
                        {delloading === t._id ? "loading..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
