import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <div className=" bg-white text-slate-800 flex flex-col">
    <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/assets/logo.svg" alt="Sellinder" className="h-10 w-auto" />
            <nav className="hidden md:flex gap-6 text-slate-600">
              <a href="#home" className="hover:text-slate-900">Home</a>
              {/* <a href="#pricing" className="hover:text-slate-900">Pricing</a> */}
                <Link href="/pricing">Pricing</Link>
              <Link href="/contact">Contact Us</Link>
              {/* <a href="#contact" className="hover:text-slate-900">Contact Us</a> */}
              {/* <a href="#login" className="hover:text-slate-900">Login</a> */}
              <Link href="/login">Login</Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">

            <button className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-2xl font-semibold">Get Started</button>
          </div>
        </div>
      </header>
      </div>
  )
}

export default Header