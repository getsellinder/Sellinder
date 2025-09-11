import Header from "../../components/Header";
import Footer from "../../components/Footer";

const PrivacyPolicy = () => {
  return (
  <>
       <Header/>
  <div className="max-w-4xl mx-auto py-10 px-6">
 
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Introduction</h2>
        <p>
          This Privacy Policy describes how <strong>Sellinder</strong>, operated by 
          Neonflake Enterprises OPC Pvt Ltd, collects, uses, and protects personal 
          data in compliance with applicable laws, including the Digital Personal Data 
          Protection Act (DPDP) and the General Data Protection Regulation (GDPR).
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Data We Collect</h2>
        <p>
          We collect customer account information, billing details, usage logs, and 
          limited information from publicly available sources (such as LinkedIn) to 
          generate buyer intelligence reports.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Purpose & Legal Basis</h2>
        <p>
          Customer data is processed based on consent provided at registration and 
          through continued use. Publicly available data is processed under the basis 
          of legitimate interest for the purpose of generating insights requested by 
          the customer.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Right to Delete</h2>
        <p>
          Customers have the right to request deletion of their account and 
          associated data at any time. Such requests will be honored within a 
          reasonable period. Requests from non-customers for deletion of analyzed 
          profile data cannot be honored, as the platform does not maintain 
          independent datasets of such individuals.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Security Measures</h2>
        <p>
          We implement industry-standard technical and organizational measures to 
          protect personal data against unauthorized access, alteration, disclosure, 
          or destruction.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
        <p>
          For privacy-related inquiries, please contact us at:{" "}
          <a href="mailto:legal@sellinder.com" className="text-blue-600 underline">
            legal@sellinder.com
          </a>
        </p>
        <p>
          Neonflake Enterprises OPC Pvt Ltd <br />
          303, 3rd floor, Meridian Plaza, Greenlands, Ameerpet, Hyderabad <br />
          Telangana, India 500016 <br />
          Phone: +91 8977002747
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Jurisdiction</h2>
        <p>
          Only the courts in Hyderabad, India will have exclusive jurisdiction.
        </p>
      </section>
   
    </div>
       <Footer/>
    </>
  )
}

export default PrivacyPolicy