import React from "react";

export default function WhatSellinderDoes() {
  return (
    <section id="features" className="mt-10 bg-orange-50 border rounded-2xl p-8">
      <div className="max-w-6xl mx-auto">
        <div className="md:grid md:grid-cols-2 gap-8 items-start">
          {/* Left column: headline + short summary + features */}
          <div>
            <h2 className="text-2xl font-bold">🔍 What Sellinder Does</h2>
            <p className="mt-3 text-slate-600">
              Sellinder analyzes your prospect’s <strong>LinkedIn profile and activity</strong> to generate a concise buyer intelligence
              report that helps you connect faster and sell smarter.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4">
              <div className="flex gap-3 items-start bg-white p-4 border rounded-lg">
                <div className="text-2xl">🔮</div>
                <div>
                  <div className="font-semibold">Interest Prediction</div>
                  <div className="text-sm text-slate-600">Will they likely be interested? With reasoning and confidence signals.</div>
                </div>
              </div>

              <div className="flex gap-3 items-start bg-white p-4 border rounded-lg">
                <div className="text-2xl">💡</div>
                <div>
                  <div className="font-semibold">Buyer Insights</div>
                  <div className="text-sm text-slate-600">What they like, topics to focus on, and tone cues to build trust.</div>
                </div>
              </div>

              <div className="flex gap-3 items-start bg-white p-4 border rounded-lg">
                <div className="text-2xl">📖</div>
                <div>
                  <div className="font-semibold">Conversation Playbook</div>
                  <div className="text-sm text-slate-600">Suggested approaches, opening lines, and what to avoid.</div>
                </div>
              </div>

              <div className="flex gap-3 items-start bg-white p-4 border rounded-lg">
                <div className="text-2xl">🛡️</div>
                <div>
                  <div className="font-semibold">Objection Handling</div>
                  <div className="text-sm text-slate-600">Likely pushbacks with tailored, concise rebuttals.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: How to use (communication guidance) */}
          <div>
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold">🗣️ How to Use These Insights</h3>
              <p className="mt-2 text-sm text-slate-600">Use the report to start relevant, high-conversion conversations — here are ready-to-use first-touch examples by channel.</p>

              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <div className="font-semibold">LinkedIn Note</div>
                  <blockquote className="mt-1 p-3 bg-slate-50 rounded text-slate-700 italic">
                    “Hi <strong>[First Name]</strong>, I noticed your work on <strong>[topic/post]</strong>. It resonated with me because <strong>[reason]</strong>. Would love to connect and share ideas on <strong>[area]</strong>.”
                  </blockquote>
                </div>

                <div>
                  <div className="font-semibold">Email (First Outreach)</div>
                  <div className="mt-1">
                    <div className="font-medium">Subject:</div>
                    <div className="text-slate-600">Ideas for <strong>[Company]</strong> on <strong>[challenge]</strong></div>

                    <blockquote className="mt-2 p-3 bg-slate-50 rounded text-slate-700">
                      Hi <strong>[First Name]</strong>,<br />
                      I noticed your focus on <strong>[initiative]</strong>. At Sellinder, we help teams tailor conversations using LinkedIn-derived buyer insights — so outreach is more relevant and trust builds faster. Would you be open to a quick 10-minute chat to explore this for <strong>[Company]</strong>?
                      <div className="mt-2 font-medium">— [Your Name]</div>
                    </blockquote>
                  </div>
                </div>

                <div>
                  <div className="font-semibold">Phone Call (Opener)</div>
                  <blockquote className="mt-1 p-3 bg-slate-50 rounded text-slate-700 italic">
                    “Hi <strong>[First Name]</strong>, this is <strong>[Your Name]</strong>. I saw your <strong>[post/comment]</strong> and wanted to connect — we help companies like <strong>[peer company]</strong> improve <strong>[metric/process]</strong>. Curious how you’re approaching <strong>[problem area]</strong> today.”
                  </blockquote>
                </div>

                <div>
                  <div className="font-semibold">Short Message (SMS / WhatsApp)</div>
                  <blockquote className="mt-1 p-3 bg-slate-50 rounded text-slate-700 italic">
                    “Hi <strong>[First Name]</strong>, I help teams improve <strong>[area]</strong> using quick LinkedIn-sourced insights. Can I send a short example?”
                  </blockquote>
                </div>
              </div>

              <div className="mt-6 text-xs text-slate-500">
                Tip: Personalize each snippet with a recent post, metric, or role-specific challenge — personalization is the key to getting a response.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
