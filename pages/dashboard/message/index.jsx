"use client";

import DashboardLayout from "../../../components/dashboard/DashboardLayout";

export default function TicketDetails() {
  return (
    <DashboardLayout>
    <div className="p-6 bg-gray-100 ">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT : Ticket Details */}
        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Ticket Details
          </h2>

          <div className="space-y-2 text-sm">
            <p><span className="font-semibold">Title:</span> Payment Credit Rewards Issue</p>
            <p><span className="font-semibold">Created By:</span> John</p>
            <p><span className="font-semibold">Priority:</span> <span className="text-red-500 font-bold">Critical</span></p>
            <p><span className="font-semibold">Category:</span> Billing</p>
            <p><span className="font-semibold">Status:</span> <span className="text-green-600 font-medium">Open</span></p>
            <p><span className="font-semibold">Created At:</span> Dec 4, 2025</p>
          </div>
        </div>

        {/* RIGHT : Messages Section */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg flex flex-col">
          
          {/* HEADER */}
          <div className="px-5 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-700">Messages</h2>
          </div>

          {/* CHAT AREA */}
          <div  style={{height:"70vh"}}>

            {/* Message Left */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
              <div>
                <p className="text-sm font-medium text-gray-700">John • just now</p>
                <div className="mt-1 bg-gray-100 p-3 rounded-lg max-w-xl">
                  Dear Jack,  
                  <br />
                  We do accept credit cards for mortgage payment.
                </div>
              </div>
            </div>

            {/* Message Right */}
            <div className="flex items-start justify-end gap-3">
              <div>
                <p className="text-sm font-medium text-gray-700 text-right">Jack Smith • 2 mins ago</p>
                <div className="mt-1 bg-blue-500 text-white p-3 rounded-lg max-w-xl">
                  Will I earn credit rewards if I pay the instalment using my credit card?
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            </div>
          </div>

          {/* MESSAGE INPUT */}
          <div className="p-4 border-t bg-gray-50 flex items-center gap-3">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 bg-white border rounded-lg outline-none"
            />
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
    </DashboardLayout>
  );
}
