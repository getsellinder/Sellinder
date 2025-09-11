
import Header from "../../components/Header";
import Footer from "../../components/Footer";


const TermsAndConditions = () => {
  
  return (
    <>
       <Header/>
   <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Introduction</h2>
        <p>
          Welcome to <strong>sellinder.com</strong>. These Terms and Conditions govern your
          use of the services provided by Sellinder, a brand owned and operated by
          Neonflake Enterprises OPC Pvt Ltd. By accessing or using our services,
          including by clicking the 'Analyze' button, you agree to be bound by these Terms.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Services</h2>
        <p>
          Sellinder provides AI-powered buyer intelligence reports derived from
          publicly available data, such as LinkedIn profiles, for the exclusive use of its
          registered customers.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">User Responsibilities</h2>
        <p>
          Users must provide accurate information, use the service for lawful purposes
          only, and agree not to misuse or attempt to exploit the platform.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Data Usage</h2>
        <p>
          Customers retain the right to request deletion of their account data at any time.
          With respect to third-party profiles analyzed, the platform processes publicly
          available data on a legitimate interest basis and does not maintain independent
          datasets on such individuals. Requests for deletion from such individuals cannot
          be honored as no independent data is maintained.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Intellectual Property</h2>
        <p>
          All intellectual property in Sellinder, including but not limited to software,
          algorithms, and generated reports, remains the sole property of Neonflake
          Enterprises OPC Pvt Ltd. Customers are granted a limited, non-transferable
          license to use reports solely for business purposes.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Payments & Subscriptions</h2>
        <p>
          All fees must be paid in accordance with the subscription plan selected.
          Services will be suspended for non-payment.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Limitation of Liability</h2>
        <p>
          Neonflake Enterprises OPC Pvt Ltd shall not be held liable for any indirect,
          incidental, or consequential damages arising out of the use of Sellinder.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Governing Law & Jurisdiction</h2>
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

export default TermsAndConditions