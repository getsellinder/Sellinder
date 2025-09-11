import Header from "../../components/Header";
import Footer from "../../components/Footer";

const ShippingPolicy = () => {
  return (
  <>
       <Header/>
  <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-6">Shipping Policy</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Nature of Services</h2>
        <p>
          Sellinder is a SaaS platform. No physical goods are shipped.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Service Delivery</h2>
        <p>
          Upon successful subscription, customers will receive immediate access to their
          account and services.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Issues with Access</h2>
        <p>
          If access is not granted within 24 hours of payment, please contact{" "}
          <a href="mailto:legal@sellinder.com" className="text-blue-600 underline">
            legal@sellinder.com
          </a>{" "}
          for resolution.
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

export default ShippingPolicy