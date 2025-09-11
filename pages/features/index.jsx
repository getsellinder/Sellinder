import Head from "next/head";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const index=()=>{
   const features = [
    {
      id: "interest",
      title: "Interest Prediction",
      short:
        "We check a prospect’s LinkedIn activity and tell you whether they’re likely to be interested.",
      exampleTitle: "Example",
      example:
        "If they post about cutting support costs and you sell an automation tool, Sellinder flags them as ‘High chance’ and explains why.",
      icon: "🔮",
      color: "from-amber-50 to-white",
    },
    {
      id: "insights",
      title: "Buyer Insights",
      short:
        "Know what topics your prospect cares about — what they like, share, and comment on.",
      exampleTitle: "Example",
      example:
        "If they often like posts about “AI for productivity”, mention time-savings and AI in your pitch.",
      icon: "💡",
      color: "from-sky-50 to-white",
    },
    {
      id: "playbook",
      title: "Conversation Playbook",
      short:
        "Ready-to-use opening lines and talking points so you never start awkwardly.",
      exampleTitle: "Examples (LinkedIn / Call)",
      example:
        "LinkedIn: “Hi [Name], loved your post on remote teams — quick idea I think you'll like.”\nCall: “Hi [Name], I saw your post about hiring — many customers use our tool to speed onboarding.”",
      icon: "📖",
      color: "from-slate-50 to-white",
    },
    {
      id: "objections",
      title: "Objection Handling",
      short:
        "Predict likely pushbacks and get concise responses you can use instantly.",
      exampleTitle: "Example",
      example:
        'Buyer: "This is too expensive."\nYou: "I understand — other customers felt the same, then saw a 30% reduction in [cost/process]."',
      icon: "🛡️",
      color: "from-violet-50 to-white",
    },
  ];

  return (
    <>
      <Head>
        <title>Sellinder — Features</title>
        <meta name="description" content="Sellinder features — simple explanations and examples for sales reps." />
      </Head>

      <div className="min-h-screen bg-white text-slate-800">
        {/* Top Nav (small, consistent with main site header) */}
       
        <Header/>

        <main className="max-w-6xl mx-auto px-6 py-14">
          {/* Page header */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-extrabold">Features — Simple, Practical, Ready to Use</h1>
            <p className="mt-4 text-slate-600">
              Plain-language explanations and short examples so any sales rep can pick up the phone or send the message
              and start a high-quality conversation.
            </p>
          </div>

          {/* Feature cards grid */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {features.map((f) => (
              <article
                key={f.id}
                className="rounded-2xl border overflow-hidden bg-gradient-to-b p-0"
                aria-labelledby={`feature-${f.id}-title`}
              >
                <div className={`p-6 bg-gradient-to-r ${f.color}`}>
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{f.icon}</div>
                    <div>
                      <h3 id={`feature-${f.id}-title`} className="text-xl font-semibold">{f.title}</h3>
                      <p className="mt-2 text-slate-600">{f.short}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white border-t">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-500 font-medium">{f.exampleTitle}</div>
                    {/* <div className="text-xs text-slate-400">Simple example</div> */}
                  </div>

                  <pre className="mt-3 whitespace-pre-wrap text-sm text-slate-700 bg-slate-50 p-4 rounded-md border border-slate-100">
                    {f.example}
                  </pre>

                  <div className="mt-4 flex gap-3">
                    <a href="/pricing" className="inline-block px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold">See plans</a>
                    {/* <a href="/pricing" className="inline-block px-4 py-2 rounded-lg border text-sm">See plans</a> */}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Multi-channel quick templates section */}
          <section className="mt-12 bg-slate-50 border rounded-2xl p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Quick Templates — Copy & Paste</h2>
              {/* <div className="text-sm text-slate-500">Personalize with the prospect’s post or role</div> */}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-white border rounded-lg">
                <div className="font-semibold">LinkedIn Note</div>
                <div className="mt-2 text-sm text-slate-700 italic">
                  Hi <strong>[First Name]</strong>, I loved your post about <strong>[topic]</strong>. It resonated because <strong>[reason]</strong>. Would love to connect and share a quick idea.
                </div>
              </div>

              <div className="p-4 bg-white border rounded-lg">
                <div className="font-semibold">Email (Subject + Body)</div>
                <div className="mt-2 text-sm text-slate-700 italic">
                  <div className="font-medium">Subject:</div> Ideas for <strong>[Company]</strong> on <strong>[challenge]</strong>
                  <br />
                  <br />
                  Hi <strong>[First Name]</strong>, I noticed your focus on <strong>[initiative]</strong>. We help teams tailor conversations using LinkedIn insights so outreach is more relevant. Open to a 10-min chat?
                </div>
              </div>

              <div className="p-4 bg-white border rounded-lg">
                <div className="font-semibold">Phone Call Opener</div>
                <div className="mt-2 text-sm text-slate-700 italic">
                  “Hi <strong>[First Name]</strong>, this is <strong>[You]</strong>. I saw your post on <strong>[topic]</strong>. We help peers improve <strong>[metric/process]</strong>. How are you approaching this today?”
                </div>
              </div>

              <div className="p-4 bg-white border rounded-lg">
                <div className="font-semibold">Short Message (SMS / WhatsApp)</div>
                <div className="mt-2 text-sm text-slate-700 italic">
                  Hi <strong>[First Name]</strong>, I help teams improve <strong>[area]</strong> using quick LinkedIn-sourced insights. Can I send a short example?
                </div>
              </div>
            </div>
          </section>

          {/* Why it matters section */}
          <section className="mt-12 text-center">
            <div className="max-w-2xl mx-auto">
              {/* <h3 className="text-lg font-semibold">Why this helps you close more</h3> */}
<h3 className="text-lg font-semibold">
  <span className="text-xl font-bold">Features</span> That Help You Close More
</h3>

              <p className="mt-3 text-slate-600">
                Stop wasting time on generic outreach. Use Sellinder to make every first message feel personal and relevant —
                get faster responses and more qualified conversations.
              </p>
              <div className="mt-6">
                <a href="/pricing" className="inline-block px-5 py-3 bg-orange-500 text-white rounded-2xl font-semibold">Start free</a>
              </div>
            </div>
          </section>
        </main>

      
        <Footer/>
      </div>
    </>
  );
}

export default index