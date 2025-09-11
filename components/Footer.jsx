import React from 'react'

const Footer = () => {
  return (
 
         <footer className="mt-12 bg-slate-900 text-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <img src="/assets/logo.svg" alt="Sellinder" className="h-10 w-auto mb-3 filter brightness-0 invert" />
            <div className="text-sm text-slate-300">Sellinder helps sales teams know their buyers before they meet — smarter conversations, better outcomes.</div>
          </div>

          <div>
            <div className="font-semibold mb-3">Links</div>
            <ul className="text-sm text-slate-300 space-y-2">
              <li><a href="#home" className="hover:underline">Home</a></li>
              <li><a href="#pricing" className="hover:underline">Pricing</a></li>
              <li><a href="#contact" className="hover:underline">Contact Us</a></li>
              <li><a href="#login" className="hover:underline">Login</a></li>
            </ul>
          </div>

          <div>
            <div className="font-semibold mb-3">Legal</div>
            <ul className="text-sm text-slate-300 space-y-2">
              <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Refund Policy</a></li>
              <li><a href="#" className="hover:underline">Shipping Policy</a></li>
            </ul>
          </div>

          <div>
            <div className="font-semibold mb-3">Follow Us</div>
            <div className="flex gap-3">
              <a href="#" aria-label="LinkedIn" className="text-slate-300 hover:underline">LinkedIn</a>
              <a href="#" aria-label="Instagram" className="text-slate-300 hover:underline">Instagram</a>
              <a href="#" aria-label="Facebook" className="text-slate-300 hover:underline">Facebook</a>
              <a href="#" aria-label="Twitter" className="text-slate-300 hover:underline">Twitter</a>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 text-slate-400 text-center text-sm py-4">
          © {new Date().getFullYear()} Sellinder. All rights reserved.
        </div>
      </footer>
   
  )
}

export default Footer