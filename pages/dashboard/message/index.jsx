"use client";

import DashboardLayout from "../../../components/dashboard/DashboardLayout";

export default function ChatPage() {
  return (
    <DashboardLayout>
    <div className="h-screen w-full flex bg-gray-100">
      {/* LEFT SIDEBAR */}
      <div className="w-1/4 bg-white shadow-lg p-4 flex flex-col">
        {/* User Profile */}
        <div className="flex items-center gap-3 mb-5">
          <img
            src="https://i.pravatar.cc/48?img=1"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h2 className="font-semibold text-gray-800">David Peters</h2>
            <p className="text-sm text-gray-500">Senior Developer</p>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search Here..."
          className="bg-gray-100 px-3 py-2 rounded-full text-sm outline-none mb-4"
        />

        {/* Users List */}
        <div className="flex flex-col gap-3 overflow-y-auto">
          {[
            "Lisa Roy",
            "Jamie Taylor",
       
          ].map((name, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              <img
                src={`https://i.pravatar.cc/48?img=${i + 2}`}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-700">{name}</p>
                <p className="text-xs text-gray-500">10:35 AM</p>
              </div>
              <span className="text-xs text-blue-500">1</span>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/48?img=4"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h2 className="font-semibold text-gray-800">Dianne Jhonson</h2>
              <p className="text-green-500 text-sm">● Online</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {/* Left message */}
          <div className="flex items-start gap-3 mb-4">
            <img src="https://i.pravatar.cc/40?img=4" className="w-9 h-9 rounded-full" />
            <div className="bg-blue-100 text-gray-800 p-3 rounded-lg max-w-md">
              Hi David, have you got the project report pdf?
            </div>
          </div>

          {/* Right message */}
          <div className="flex items-start gap-3 mb-4 justify-end">
            <div className="bg-blue-500 text-white p-3 rounded-lg max-w-md">
              NO. I did not get it.
            </div>
            <img src="https://i.pravatar.cc/40?img=1" className="w-9 h-9 rounded-full" />
          </div>

          {/* Left message + File */}
          <div className="flex items-start gap-3 mb-4">
            <img src="https://i.pravatar.cc/40?img=4" className="w-9 h-9 rounded-full" />
            <div>
              <div className="bg-blue-100 text-gray-800 p-3 rounded-lg max-w-md mb-2">
                Ok, I will just send it here. Please be sure to fill the details by today.
              </div>

              {/* File Preview */}
              {/* <div className="bg-white border p-3 rounded-lg max-w-xs shadow-sm">
                <img
                  src="https://dummyimage.com/200x120/ccc/fff&text=Project+Report"
                  className="rounded mb-2"
                />
                <p className="text-blue-600 font-medium cursor-pointer">
                  project_report.pdf
                </p>
              </div> */}
            </div>
          </div>

          {/* Right message */}
          <div className="flex items-start gap-3 mb-4 justify-end">
            <div className="bg-blue-500 text-white p-3 rounded-lg max-w-md">
              Ok. Should I send it over email as well after filling the details?
            </div>
            <img src="https://i.pravatar.cc/40?img=1" className="w-9 h-9 rounded-full" />
          </div>

          {/* Left message */}
          <div className="flex items-start gap-3 mb-4">
            <img src="https://i.pravatar.cc/40?img=4" className="w-9 h-9 rounded-full" />
            <div className="bg-blue-100 text-gray-800 p-3 rounded-lg max-w-md">
              Ya. I’ll be adding more team members to it.
            </div>
          </div>

          {/* Right last message */}
          <div className="flex items-start gap-3 mb-4 justify-end">
            <div className="bg-blue-500 text-white p-3 rounded-lg max-w-md">OK</div>
            <img src="https://i.pravatar.cc/40?img=1" className="w-9 h-9 rounded-full" />
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t">
          <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-full">
            <input
              type="text"
              placeholder="Write Something..."
              className="flex-1 bg-transparent outline-none px-2"
            />

            <button className="text-gray-600 text-xl">📎</button>
            <button className="text-gray-600 text-xl">📷</button>
            <button className="text-gray-600 text-xl">😊</button>

            <button className="bg-blue-500 text-white px-4 py-2 rounded-full">
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}
