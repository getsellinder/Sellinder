import React from "react";
import { Documents, Images, socialmedia } from "./images";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-12 bg-slate-900 text-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <Link href="/home">
          
          <img
            src={Images.logowhitebg}
            alt="Sellinder"
            className="h-10 w-auto mb-3 filter brightness-0 invert"
          /></Link>
          

          <div className="text-sm text-slate-300">
            Sellinder helps sales teams know their buyers before they meet —
            smarter conversations, better outcomes.
          </div>
        </div>

        <div>
          <div className="font-semibold mb-3">Links</div>
          <ul className="text-sm text-slate-300 space-y-2">
            <li>
              <Link href="/home" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:underline">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-3">Legal</div>
          <ul className="text-sm text-slate-300 space-y-2">
            <li>
              <a target="_blank"
                href="/TermsAndConditions"
                className="hover:underline"
              >
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="PrivacyPolicy" className="hover:underline" target="_blank">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/RefundPolicy" className="hover:underline" target="_blank">
                Refund Policy
              </a>
            </li>
            <li>
              <a href="ShippingPolicy"className="hover:underline" target="_blank">
                Shipping Policy
              </a>
            </li>
          </ul>
        </div>

        {/* <div>
            <div className="font-semibold mb-3">Follow Us</div>
            <div className=" gap-3">
              <a href="#" aria-label="LinkedIn" className="text-slate-300 hover:underline">LinkedIn</a>
              <a href="#" aria-label="Instagram" className="text-slate-300 hover:underline">Instagram</a>
              <a href="#" aria-label="Facebook" className="text-slate-300 hover:underline">Facebook</a>
              <a href="#" aria-label="Twitter" className="text-slate-300 hover:underline">Twitter</a>
            </div>
          </div> */}
        <div>
          <div className="font-semibold mb-3">Follow Us</div>
          <ul className="text-sm text-slate-300 space-y-2">
            <li>
              <a
                href={socialmedia.linkedin}
                target="_blank"
                className="hover:underline"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <Link href={socialmedia.instagram} className="hover:underline" target="_blank">
                Instagram
              </Link>
            </li>
            <li>
              <a href={socialmedia.facebook} className="hover:underline" target="_blank">
                Facebook
              </a>
            </li>
            <li>
              <a href={socialmedia.twitter} className="hover:underline" target="_blank">
                Twitter
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-800 text-slate-400 text-center text-sm py-4">
        © {new Date().getFullYear()} Neonflake Enterprises OPC Pvt Ltd. All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
