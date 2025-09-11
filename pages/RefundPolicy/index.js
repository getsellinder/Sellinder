import Header from "../../components/Header";
import Footer from "../../components/Footer";

const RefundPolicy = () => {
  return (
  <>
       <Header/>
 <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Eligibility</h2>
        <p>
          Sellinder subscriptions are eligible for a refund within seven (7) days of purchase,
          provided that the customer has not exceeded the usage threshold defined in the
          subscription plan.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Non-Refundable</h2>
        <p>
          Refunds will not be issued if the services have been substantially used, reports
          generated beyond the trial quota, or if the cancellation request is made after the
          seven (7) day period.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Requesting a Refund</h2>
        <p>
          To request a refund, customers must contact us at{" "}
          <a href="mailto:legal@sellinder.com" className="text-blue-600 underline">
            legal@sellinder.com
          </a>
          . All requests will be processed within ten (10) business days.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Processing</h2>
        <p>
          Approved refunds will be credited to the original payment method within a
          reasonable time frame.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Jurisdiction</h2>
        <p>
          Only the courts in Hyderabad, India will have exclusive jurisdiction.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Contact</h2>
        <p>
          Neonflake Enterprises OPC Pvt Ltd <br />
          303, 3rd floor, Meridian Plaza, Greenlands, Ameerpet, Hyderabad <br />
          Telangana, India 500016 <br />
          Email:{" "}
          <a href="mailto:legal@sellinder.com" className="text-blue-600 underline">
            legal@sellinder.com
          </a>{" "}
          <br />
          Phone: +91 8977002747
        </p>
      </section>
    </div>
       <Footer/>
    </>
  )
}

export default RefundPolicy