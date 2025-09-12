import React, { useState } from "react";

export default function WhatSellinderDoes() {
   const [open, setOpen] = useState({
    ex1: false,
    ex2: false,
    ex3: false,
    ex4: false,
  });

  const toggle = (id) => {
    setOpen((s) => ({ ...s, [id]: !s[id] }));
  };

  return (
    <section className="mt-6 bg-orange-50 border rounded-2xl p-6">
      {/* Header */}
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-extrabold">🔍 What Sellinder Does</h2>
        <p className="mt-2 text-slate-600 max-w-3xl">
          We analyze a prospect’s LinkedIn activity and produce a short buyer report that tells you:
          should you reach out, what to say, and how to reply if they push back — fast and practical.
        </p>
      </div>

      {/* Sample product + persona */}
      <div className="mt-6 bg-white border rounded-lg p-4 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🧪</div>
          <div>
            <div className="font-semibold">Sample product (for this demo):</div>
            <div className="text-sm text-slate-700">
              Onboardly — a SaaS tool that automates and shortens customer onboarding for mid-market B2B SaaS
              companies.
            </div>

            <div className="mt-3 font-semibold">Target customer (persona):</div>
            <div className="text-sm text-slate-700">
              Priya — Head of Customer Success at a mid-market SaaS (50–200 employees). Focused on reducing
              time-to-value and improving retention.
            </div>

            <div className="mt-3 text-sm text-slate-500 italic">
              <strong>How Sellinder helps:</strong> we scan Priya’s LinkedIn activity (posts, likes, comments)
              and create tailored messages that reference her recent work, pain points, and tone — so outreach
              feels personal and relevant.
            </div>
          </div>
        </div>
      </div>

      {/* Balanced cards grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {/* Card 1 */}
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🔮</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Interest Prediction</h3>
                <button
                  onClick={() => toggle("ex1")}
                  id="btn-ex1"
                  className="text-sm text-orange-600 hover:underline"
                >
                  {open.ex1 ? "Hide example" : "View example"}
                </button>
              </div>
              <p className="text-sm text-slate-600 mt-2">
                We tell you if Priya is likely to be interested in Onboardly and why — using signals from her LinkedIn behavior.
              </p>

              {open.ex1 && (
                <div className="mt-3 p-3 bg-slate-50 border rounded text-sm text-slate-700">
                  1) Signal: Priya recently shared an article about speeding up customer onboarding.<br />
                  2) Signal: She commented on a post about reducing churn through faster activation.<br />
                  3) Inference: High chance of interest — her focus aligns with Onboardly's core benefit.<br />
                  4) Recommendation: Prioritize messaging around <em>time-to-value</em> and quick wins in the first outreach.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="text-3xl">💡</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Buyer Insights</h3>
                <button
                  onClick={() => toggle("ex2")}
                  id="btn-ex2"
                  className="text-sm text-orange-600 hover:underline"
                >
                  {open.ex2 ? "Hide example" : "View example"}
                </button>
              </div>
              <p className="text-sm text-slate-600 mt-2">
                We highlight topics Priya cares about and suggest the right language and tone to use.
              </p>

              {open.ex2 && (
                <div className="mt-3 p-3 bg-slate-50 border rounded text-sm text-slate-700">
                  1) Observed: Priya engages with posts about onboarding metrics and customer success playbooks.<br />
                  2) Tone: She uses practical, outcomes-focused language (metrics and process).<br />
                  3) Messaging tip: Use numbers and outcomes — e.g., “reduce onboarding time by X days” or “improve activation rate by Y%.”<br />
                  4) Do not: Avoid purely vendor-y buzzwords — she prefers clear ROI-oriented statements.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="text-3xl">📖</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Conversation Playbook</h3>
                <button
                  onClick={() => toggle("ex3")}
                  id="btn-ex3"
                  className="text-sm text-orange-600 hover:underline"
                >
                  {open.ex3 ? "Hide example" : "View example"}
                </button>
              </div>
              <p className="text-sm text-slate-600 mt-2">
                Ready-to-use openers and brief scripts for LinkedIn, email, and calls — tailored to Priya's interests.
              </p>

              {open.ex3 && (
                <div className="mt-3 p-3 bg-slate-50 border rounded text-sm text-slate-700 whitespace-pre-wrap">
                  LinkedIn opener (4–5 lines):<br />
                  “Hi Priya — loved your recent post on reducing onboarding time. We helped a similar team cut activation from 14 to 6 days by automating the first-week checklist. If you’re open, I can share a short case study showing exactly how we did it. Would that be useful?”<br /><br />
                  Email opener (4–5 lines):<br />
                  “Subject: Quick idea to reduce onboarding time at [Company]<br />Hi Priya — I saw your focus on onboarding metrics. Onboardly helped [peer company] speed new-customer setup by automating tasks and nudges. Could we do a 10-min call so I can share the exact approach?”
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🛡️</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Objection Handling</h3>
                <button
                  onClick={() => toggle("ex4")}
                  id="btn-ex4"
                  className="text-sm text-orange-600 hover:underline"
                >
                  {open.ex4 ? "Hide example" : "View example"}
                </button>
              </div>
              <p className="text-sm text-slate-600 mt-2">
                Predicts likely objections (price, fit, existing tools) and gives short responses you can use immediately.
              </p>

              {open.ex4 && (
                <div className="mt-3 p-3 bg-slate-50 border rounded text-sm text-slate-700">
                  Typical objection & reply (4–5 lines):<br />
                  Buyer: “This looks expensive.”<br />
                  You (Sellinder-guided): “Totally understand. Most teams we speak to worry about cost — then they find the onboarding time and support-effort savings pay back the tool inside 3–4 months. If you want, I can show a short example with numbers from a similar company.”<br />
                  Why this works: it acknowledges, gives social proof, and offers a concrete next step.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Templates / Playbook block */}
      <div className="mt-6 bg-white border rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Conversation Playbook Created by Sellinder</h4>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {/* LinkedIn */}
          <div className="p-3 bg-slate-50 rounded">
            <div className="font-medium">LinkedIn Note</div>
            <div className="mt-2 text-sm text-slate-700">
              Hi <strong>Priya</strong>, I loved your post about speeding up customer onboarding — especially your point about early activation. I recently helped a peer company reduce activation time by automating the first-week steps. If you're open, I can share a quick example that might apply to <strong>[Company]</strong>. Would you like that?
            </div>
          </div>

          {/* Email */}
          <div className="p-3 bg-slate-50 rounded">
            <div className="font-medium">Email</div>
            <div className="mt-2 text-sm text-slate-700">
              <div className="font-medium">Subject:</div> Quick idea to shorten onboarding at <strong>[Company]</strong><br /><br />
              Hi <strong>Priya</strong>, I saw your focus on onboarding metrics. Onboardly helped another SaaS cut activation from 14 to 6 days by automating early tasks and nudges — we saw improvements to retention as well. Could we do a 10-minute call so I can share what worked?
            </div>
          </div>

          {/* Phone */}
          <div className="p-3 bg-slate-50 rounded">
            <div className="font-medium">Phone Call</div>
            <div className="mt-2 text-sm text-slate-700">
              “Hi Priya, this is <strong>[You]</strong>. I noticed your post about onboarding. We worked with a SaaS to reduce time-to-value by automating the first-week tasks, which helped retention. Quick question — how are you currently tracking activation?”
            </div>
          </div>

          {/* Short Message */}
          <div className="p-3 bg-slate-50 rounded">
            <div className="font-medium">Short Message (SMS/WhatsApp)</div>
            <div className="mt-2 text-sm text-slate-700">
              Hi Priya — I help CS teams shorten onboarding and improve retention using quick LinkedIn-sourced insights. I can send a 1-paragraph example from a similar company — want it?
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}




          // <section id="home" className="grid md:grid-cols-2 gap-8 items-center">
          //   <div>
          //     <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          //       Know your customer <span className="text-orange-500">before you meet</span>
          //     </h1>
          //     <p className="mt-4 text-lg text-slate-600">
          //       Stop guessing—start selling smarter. Sellinder analyzes your prospect's LinkedIn profile and activity to
          //       generate a concise buyer intelligence report tailored for every meeting.
          //     </p>

          //     <div className="mt-6 flex gap-3">
          //       <a href="#start" className="inline-flex items-center gap-2 bg-orange-500 text-white px-5 py-3 rounded-2xl font-semibold shadow hover:opacity-95">Get Started</a>
          //       <a href="#features" className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-200">See Features</a>
          //     </div>

          //     <div className="mt-6 text-sm text-slate-500">Trusted by sales teams and founders who sell with confidence.</div>
          //   </div>




          //   <div className="flex justify-center md:justify-end">
          //     {/* Mockup card */}
          //     <div className="w-full max-w-md bg-gradient-to-b from-white to-slate-50 border border-slate-100 rounded-2xl p-5 shadow">
          //       <div className="flex items-center justify-between mb-4">
          //         <div>
          //           <div className="text-xs text-slate-400">Buyer: Priya K.</div>
          //           <div className="font-semibold">Interest: Likely</div>
          //         </div>
          //         <div className="text-xs text-slate-400">Profile: LinkedIn</div>
          //       </div>

          //       <div className="bg-white border border-slate-100 rounded-lg p-4">
          //         <div className="text-sm font-medium">Conversation Playbook</div>
          //         <ul className="mt-2 text-sm text-slate-600 space-y-1">
          //           <li>• Lead with recent post about product-market fit</li>
          //           <li>• Talk about streamlining onboarding</li>
          //           <li>• Avoid pricing talk early</li>
          //         </ul>
          //       </div>

          //       <div className="mt-4 text-xs text-slate-500">Generated from LinkedIn activity • Confidential</div>
          //     </div>
          //   </div>
          // </section>