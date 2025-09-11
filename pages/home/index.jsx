

import Link from "next/link";
import React, { useState } from "react";
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import WhatSellinderDoes from "../../components/WhatSellinderDoes";


const HomePage = () => {
      const [yearly, setYearly] = useState(false);
      const togglePricing = () => setYearly((v) => !v);

       const features = [
    { title: "Interest Prediction", desc: ["Will they likely be interested?","Reasoning behind the prediction","Confidence score and signals"], icon: "🔮" },
    { title: "Buyer Insights", desc: ["What they like and engage with","Topics to open the conversation","Tone and communication cues"], icon: "💡" },
    { title: "Conversation Playbook", desc: ["Suggested opening lines","Suggested story / value hooks","What to avoid in early conversations"], icon: "📖" },
    { title: "Objection Handling", desc: ["Likely objections to expect","Suggested responses and reframes","Short ROI-focused rebuttals"], icon: "🛡️" },
  ];

  const testimonials = [
    { quote: "Sellinder gave me the confidence to walk into meetings already knowing what would click with my prospects.", name: "Rohit Sharma", role: "Head of Sales, Acme Corp" },
    { quote: "Our conversion rate improved in 6 weeks — Sellinder made our outreach smarter and far more personal.", name: "Priya Menon", role: "Revenue Ops, Stellar SAAS" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      {/* Header */}
     
      <Header/>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Hero */}
          <section id="home" className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Know your customer <span className="text-orange-500">before you meet</span>
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                Stop guessing—start selling smarter. Sellinder analyzes your prospect's LinkedIn profile and activity to
                generate a concise buyer intelligence report tailored for every meeting.
              </p>

              <div className="mt-6 flex gap-3">
                <a href="/pricing" className="inline-flex items-center gap-2 bg-orange-500 text-white px-5 py-3 rounded-2xl font-semibold shadow hover:opacity-95">Get Started</a>
                <a href="#features" className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-200">See Features</a>
              </div>

              <div className="mt-6 text-sm text-slate-500">Trusted by sales teams and founders who sell with confidence.</div>
            </div>

            <div className="flex justify-center md:justify-end">
              {/* Mockup card */}
              <div className="w-full max-w-md bg-gradient-to-b from-white to-slate-50 border border-slate-100 rounded-2xl p-5 shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs text-slate-400">Buyer: Priya K.</div>
                    <div className="font-semibold">Interest: Likely</div>
                  </div>
                  <div className="text-xs text-slate-400">Profile: LinkedIn</div>
                </div>

                <div className="bg-white border border-slate-100 rounded-lg p-4">
                  <div className="text-sm font-medium">Conversation Playbook</div>
                  <ul className="mt-2 text-sm text-slate-600 space-y-1">
                    <li>• Lead with recent post about product-market fit</li>
                    <li>• Talk about streamlining onboarding</li>
                    <li>• Avoid pricing talk early</li>
                  </ul>
                </div>

                <div className="mt-4 text-xs text-slate-500">Generated from LinkedIn activity • Confidential</div>
              </div>
            </div>
          </section>

          {/* Problem */}
          <section id="problem" className="mt-12 bg-orange-50 rounded-2xl p-6">
            <div className="md:flex md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-semibold">The old way: guesswork</h3>
                <p className="mt-2 text-slate-600">Cold outreach, uncertain meetings, and lost opportunities because you didn't know what would resonate.</p>
              </div>

              <div className="mt-4 md:mt-0">
                <h3 className="text-xl font-semibold">The new way: Sellinder</h3>
                <p className="mt-2 text-slate-600">Walk into meetings prepared — with clear insights, suggested talking points, and objection responses.</p>
              </div>
            </div>
          </section>

          {/* What Sellinder Does - standout background */}
          {/* <section id="features" className="mt-10 bg-orange-50 border rounded-2xl p-8">
            <div className="md:grid md:grid-cols-2 gap-8 items-start">
              <div>
                <h2 className="text-2xl font-bold">What Sellinder Does</h2>
                <p className="mt-3 text-slate-600">Sellinder analyzes LinkedIn to produce a personality-driven buyer report that helps you connect faster.</p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((f) => (
                    <div key={f.title} className="p-4 border rounded-xl bg-white">
                      <div className="text-2xl">{f.icon}</div>
                      <div className="mt-2 font-semibold">{f.title}</div>
                      <div className="mt-2 text-sm text-slate-600 space-y-1">
                        {f.desc.map((d, i) => (
                          <div key={i}>• {d}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="bg-white border border-slate-100 rounded-2xl p-6">
                  <div className="mb-4">
                    <div className="text-sm text-slate-500">Report Preview</div>
                    <div className="font-semibold text-lg">Buyer Intelligence Summary</div>
                  </div>

                  <div className="space-y-3 text-sm text-slate-700">
                    <div>
                      <div className="text-xs text-slate-500">Interest</div>
                      <div className="font-medium">Likely — Prefers product-led, values speed</div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-500">Talking Points</div>
                      <div className="font-medium">Onboarding, small wins, case studies</div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-500">Objections</div>
                      <div className="font-medium">Price sensitivity — respond with ROI-focused story</div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <a href="#start" className="inline-block px-4 py-2 rounded-lg border border-slate-200">Download sample</a>
                  </div>
                </div>
              </div>
            </div>
          </section> */}
          <WhatSellinderDoes/>

          {/* Value Proposition */}
          <section id="value" className="mt-12">
            <h3 className="text-xl font-bold">Why Sales Teams Love Sellinder</h3>
            <ul className="mt-4 grid sm:grid-cols-2 gap-4">
              <li className="p-4 border rounded-lg">Get an unprecedented peek into your buyer's mind</li>
              <li className="p-4 border rounded-lg">Walk in with confidence, not guesswork</li>
              <li className="p-4 border rounded-lg">Boost conversions with smarter conversations</li>
              <li className="p-4 border rounded-lg">Empower your entire revenue team to close faster</li>
            </ul>
          </section>

          {/* Pricing Plans with toggle and CTAs */}
         

          {/* Chrome Extension Section */}
          <section id="extension" className="mt-12 bg-slate-50 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold">🔌 Install the Sellinder Chrome Extension</h3>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              To unlock the full power of Sellinder, install our official Google Chrome extension. It seamlessly integrates with LinkedIn, analyzes profiles in real-time, and generates your buyer intelligence report directly inside your workflow.
            </p>
            <div className="mt-6">
              <a href="https://chrome.google.com/webstore" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-2xl font-semibold shadow hover:opacity-95">Go to Chrome Web Store</a>
            </div>
          </section>

          {/* Target Users */}
          {/* <section id="users" className="mt-12">
            <h3 className="text-xl font-bold">Built for Growth-Minded Teams</h3>
            <div className="mt-4 flex gap-4 flex-wrap">
              <div className="p-4 border rounded-lg min-w-[180px]">Sales Professionals</div>
              <div className="p-4 border rounded-lg min-w-[180px]">Revenue Teams</div>
              <div className="p-4 border rounded-lg min-w-[180px]">Founders & Entrepreneurs</div>
            </div>
          </section> */}

          {/* Social Proof */}
          <section id="social" className="mt-12">
            <h3 className="text-xl font-bold">Trusted by smart sellers</h3>
            <div className="mt-4 grid sm:grid-cols-2 gap-6">
              {testimonials.map((t) => (
                <div key={t.name} className="p-4 border rounded-lg bg-white">
                  <div className="text-slate-600 italic">"{t.quote}"</div>
                  <div className="mt-3 font-semibold">{t.name}</div>
                  <div className="text-sm text-slate-500">{t.role}</div>
                </div>
              ))}
            </div>

          
          </section>
        </div>
      </main>

      {/* Footer */}
     <Footer/>
    </div>
  )
}

export default HomePage
