import { Toaster } from "react-hot-toast";
import "../styles/globals.css";
import { AppProvider } from "../components/PricingContext";
import { useEffect } from "react";
import { TicketProvider } from "../components/SupportContext";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <>
    <TicketProvider>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
      </TicketProvider>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}
