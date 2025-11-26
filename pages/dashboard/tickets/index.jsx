import { useRouter } from "next/router";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

export default function TicketsPage() {
    const router =useRouter()
  const tickets = [
    {
      id: 1,
      subject: "Dashboard related issue33",
      priority: "High",
      category: "Technical",
      business: "Impactvibes",
      createdAt: "Oct 29, 2025, 4:33 PM",
      resolvedAt: "-",
      status: "Open",
      ticketId:"258963147"
    },
    {
      id: 2,
      subject: "hghgghfghgf",
      priority: "Medium",
      category: "Technical",
      business: "Impactvibes",
      createdAt: "Oct 28, 2025, 6:11 PM",
      resolvedAt: "-",
      status: "Open",
         status: "Open",
      ticketId:"258963147"
    },
  ];

  return (
    <DashboardLayout>
    <div className="p-6 ">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-2">Ticketing System</h1>
      <p className="text-gray-400 mb-6">
        Log, track, and resolve issues reported by tenant admins.
      </p>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-4 mb-6 ">
        <input
          type="text"
          placeholder="Search tickets..."
          className="bg-[#1a1c24] border border-gray-700 text-white p-3 rounded-lg w-64 outline-none focus:border-blue-500"
        />

        <select className="bg-[#1a1c24] border border-gray-700 p-3 rounded-lg text-white w-48 outline-none">
          <option>All Priorities</option>
          <option>High</option>
          <option>Medium</option>
        </select>

        <select className="bg-[#1a1c24] border border-gray-700 p-3 rounded-lg text-white w-48 outline-none">
          <option>All Categories</option>
          <option>Technical</option>
          <option>Billing</option>
        </select>

        <select className="bg-[#1a1c24] border border-gray-700 p-3 rounded-lg text-white w-48 outline-none">
          <option>All Statuses</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Closed</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto text-white">
        <table className="min-w-full border-collapse bg-[#12141b] rounded-lg overflow-hidden">
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
            {tickets.map((t) => (
              <tr key={t.id} className="border-b border-gray-700">
                <td className="px-4 py-3">{t.id}</td>
                  <td className="px-4 py-3">{t.createdAt}</td>
                     <td className="px-4 py-3">{t.ticketId}</td>
                <td className="px-4 py-3">{t.subject}</td>
                <td className="px-4 py-3">{t.priority}</td>
                <td className="px-4 py-3">{t.category}</td>
            
               
                <td className="px-4 py-3">{t.resolvedAt}</td>

                {/* Status Dropdown */}
                <td className="px-4 py-3">
                  <select
                    defaultValue={t.status}
                    className="bg-[#1a1c24] border border-gray-600 px-2 py-1 rounded text-white"
                  >
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Closed</option>
                  </select>
                </td>

                {/* Messages Button */}
                <td className="px-4 py-3">
                  <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white" onClick={()=>router.push("/dashboard/message")}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </DashboardLayout>
  );
}
