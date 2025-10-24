import { Toaster } from "react-hot-toast";
import "../styles/globals.css";
import { AppProvider } from "../components/PricingContext";
import { useEffect } from "react";

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
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}
