import axios from "axios";
import { isAutheticated } from "./isAuthticated";
import toast from "react-hot-toast";

const { createContext, useContext, useState, useEffect } = require("react");

const TicketContext = createContext();
export const TicketProvider = ({ children }) => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const [userId, setuserId] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  

  const [loading, setLoading] = useState(false);
  const [allticketes, setAllTicketes] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("");
  const [PageLimit, setPageLimit] = useState(4);
  const [page, setCurrentPage] = useState(1);
  const [allmessages, setAllmessage] = useState([]);
  const [delloading,setDelLoading]=useState(null)

  const token = isAutheticated();

  // get all the tickets for admin

  const handleAllTickets = async (
    page = 1,
    limit = PageLimit,
    sInput = searchInput,
    ticketStatus = status,
    userId
  ) => {
    try {
      setLoading(true);
      let resp = await axios.get(`${url}/api/support/userticket/${userId}`, {
        params: {
          page,
          limit,
          searchInput: sInput,
          status: ticketStatus,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = resp.data;
      console.log("result",result)
  

      setAllTicketes(result);
    } catch (error) {
      let message = error.response.data.message;
      setErrorMessage(message);
    } finally {
      setLoading(false);
      setErrorMessage("");
    }
  };
  const handleViewTicketMessages = async (id) => {
    console.log("userid stating",id)
    try {
      setLoading(true);
      let resp = await axios.get(`${url}/api/support/getOne/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = resp.data;
      setAllmessage(result);
    } catch (error) {
      let message = error.response.data.message;
      console.log("handleViewTicketMessages.message", message);
      console.log("handleViewTicketMessages.error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicketDelete = async (id) => {
    try {
      setDelLoading(id);
      let resp = await axios.delete(`${url}/api/support/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = resp?.data?.message;
      toast.success(result || "Ticket Deleted Successfully");
      handleAllTickets(1, PageLimit, searchInput, status,userId);
    } catch (error) {
        
      let message = error?.response?.data?.message;
      console.log("handleViewTicketDelete.message", message);
      console.log("handleViewTicketDelete.error", error);
    } finally {
      setDelLoading(null);
    }
  };
  useEffect(() => {

    let userId = localStorage.getItem("userId");
    handleAllTickets(1, PageLimit, searchInput, status,userId);
    setuserId(userId);
  }, []);
  return (
    <TicketContext.Provider
      value={{
        allticketes,
        loading,
        setSearchInput,
        searchInput,
        status,
        setStatus,
        handleAllTickets,
        page,
        setCurrentPage,
        handleViewTicketMessages,
        handleViewTicketDelete,
        allmessages,
        userId,
        PageLimit,
        errorMessage,
        delloading,
        setPageLimit,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};
export const useTicket = () => useContext(TicketContext);
