import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { IoLocationOutline } from "react-icons/io5";
import { HiOutlineMail } from "react-icons/hi";
import { IoCallOutline } from "react-icons/io5";
import { toast } from "react-hot-toast";
import { useState } from "react";
import axios from "axios";




const Contact = () => {
  const [contact, setContact] = useState({
    name: "",
    eamil: "",
    message: ""
  })
  const [loading, setLoading] = useState(false)
  const handleChange = (e) => {
    const { name, value } = e.target
    setContact((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handeleContactRequest = async (e) => {

    e.preventDefault();

    try {
      setLoading(true)
      const resp = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/request/new`, {
        ...contact,

      })
      toast.success(resp.data.message || "Request sent successfully!")
      setContact({
        name: "",
        eamil: "",
        message: ""
      })
    } catch (error) {
      let msg = error?.
        response?.data?.message
      toast.error(msg)
      setContact({
        name: "",
        eamil: "",
        message: ""
      })
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="bg-white min-h-screen ">
      <Header />
      <h2 class="text-5xl font-bold text-gray-700 mb-2 text-center my-3">
        Contact Us
      </h2>
      <p class="  font-medium text-center text-gray-500 dark:text-gray-500 sm:text-xl mt-5">
        We'd love to hear from you. Send a message and we’ll respond soon.
      </p>

      <div className="bg-white flex items-center justify-center p-6">
        <div className="max-w-7xl w-full bg-white shadow-lg rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side - Form */}
          <div>
            <form className="space-y-4 p-10 border rounded-md">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input onChange={handleChange} value={contact.name}
                  name="name"
                  type="text"
                  placeholder="Your name"
                  className="w-full px-4 py-3 border rounded-lg 
                  focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email or Phone number
                </label>
                <input onChange={handleChange} value={contact.eamil}
                  name="eamil"
                  type="text"
                  placeholder="you@example.com or +1 555 123 4567"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea onChange={handleChange}
                  value={contact.message}
                  name="message"
                  rows="4"
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                ></textarea>
              </div>

              {/* Button */}
              <button onClick={handeleContactRequest}
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition"
              >
                {loading ? "Loading....." : "Send Message"}

              </button>
            </form>
          </div>

          {/* Right side - Info */}
          <div className="space-y-6">
            <div className="p-4 border rounded-lg ">
              <div className="flex items-center gap-3 mb-3">
                <IoLocationOutline className="text-blue-600 text-2xl" />
                <span className="font-semibold text-gray-800">Address</span>
              </div>

              <p className="text-gray-600">
                Neonflake Enterprises OPC Pvt Ltd <br />
                303, 3rd Floor, Meridian Plaza <br />
                Greenlands, Ameerpet <br />
                Hyderabad, India 500016
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <HiOutlineMail className="text-blue-600 text-2xl" />
                <span className="font-semibold text-gray-800">Email</span>
              </div>


              <p className="text-gray-600">hello@smellika.com</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <IoCallOutline className="text-blue-600 text-2xl" />
                <span className="font-semibold text-gray-800">Contact</span>
              </div>

              <p className="text-gray-600">+91 8977002747</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
