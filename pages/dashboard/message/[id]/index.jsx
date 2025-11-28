"use client";

import { useEffect, useState } from "react";

import { useTicket } from "../../../../components/SupportContext";

import { useRouter } from "next/router";
import DashboardLayout from "../../../../components/dashboard/DashboardLayout";
import { isAutheticated } from "../../../../components/isAuthticated";
import axios from "axios";
import toast from "react-hot-toast";

export default function TicketDetails() {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const [msgloading, setMsgLoading] = useState(false);
  const [sentMessage, setSentMessage] = useState("");
  const token = isAutheticated();
  const { allmessages, handleViewTicketMessages, loading, userId } =
    useTicket();
  const Router = useRouter();
  let { id } = Router.query;

  console.log("userParams Id", id);

  let messsage = allmessages?.messages;
  const receiverId = allmessages?.userId?._id;
  let ticketId = allmessages?._id;

  const handleMessages = async (id) => {
    const data = {
      receiverId: receiverId,
      message: sentMessage,
    };
    try {
      setMsgLoading(true);
      let resp = await axios.post(`${url}/api/support/message/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = resp.data.message;
      toast.success(result || "message sent");
      handleViewTicketMessages(id);
      setSentMessage("");
    } catch (error) {
      let message = error?.response?.data?.message;
      console.log("handleViewTicket.message", message);
      console.log("handleViewTicket.error", error);
    } finally {
      setMsgLoading(false);
    }
  };

  useEffect(() => {
    handleViewTicketMessages(id);
  }, [id]);

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
              <p>
                <span className="font-semibold">Title:</span>{" "}
                {allmessages?.subject}
              </p>
              <p>
                <span className="font-semibold">Created By:</span>{" "}
                {allmessages?.userId?.name}
              </p>
              <p>
                <span className="font-semibold">Priority:</span>{" "}
                <span className="text-red-500 font-bold">
                  {allmessages?.priority}
                </span>
              </p>
              <p>
                <span className="font-semibold">Category:</span>
                {allmessages?.category}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span className="text-green-600 font-medium">
                  {allmessages?.status}
                </span>
              </p>
              <p>
                <span className="font-semibold">Created At:</span>{" "}
                {allmessages?.createdAt}
              </p>
            </div>
          </div>

          {/* RIGHT : Messages Section */}
          {/* RIGHT : Messages Section */}
          <div className="lg:col-span-2 bg-white shadow rounded-lg flex flex-col h-[80vh]">
            {/* HEADER */}
            <div className="px-5 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-700">Messages</h2>
            </div>

            {/* CHAT AREA */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                </div>
              ) : messsage?.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <span>Start Conversation</span>
                </div>
              ) : (
                messsage?.map((val, index) => {
                  const isSender =  String(val?.senderId?._id) === String(userId);
                  console.log("isSender",      String(val?.senderId?._id) === String(userId));

                  return (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        isSender ? "justify-end" : "justify-start"
                      }`}
                    >
                      {/* RECEIVER AVATAR (Left side only if NOT sender) */}
                      {!isSender && (
                        <div className="w-10 h-10 rounded-full bg-blue-500"></div>
                      )}

                      {/* MESSAGE CONTENT */}
                      <div className="max-w-[70%]">
                        <p className="text-sm font-medium text-gray-700">
                          {isSender ? "You" : val?.senderId?.name} •{" "}
                          {val?.createdAt}
                        </p>

                        {/* CHAT BUBBLE */}
                        <div
                          className={`mt-1 p-3 rounded-lg ${
                            isSender
                              ? "bg-blue-600 text-white" // YOU → SENDER → BLUE
                              : "bg-gray-200 text-black" // RECEIVER → GRAY
                          }`}
                        >
                          {val?.message}
                        </div>
                      </div>

                      {/* SENDER AVATAR (Right side only if sender) */}
                      {isSender && (
                        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* MESSAGE INPUT */}
            <div className="p-4 border-t bg-gray-50 flex items-center gap-3">
              <input
                value={sentMessage}
                onChange={(e) => setSentMessage(e.target.value)}
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 bg-white border rounded-lg outline-none"
              />
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                onClick={() => handleMessages(allmessages?._id)}
              >
                {msgloading ? "loading.." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
