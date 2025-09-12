import React from 'react'

const Hero = () => {
  return (
    <div>
       <section class="bg-[#f97316] text-white py-24">
      <div class="max-w-4xl mx-auto text-center px-6">
        <h1 class="text-5xl md:text-7xl font-extrabold leading-tight">
          <span class="text-yellow-300">Know your Customer</span><br />
          <span class="text-white">before you meet</span>
        </h1>
        <p class="mt-6 text-lg md:text-xl text-orange-100 max-w-3xl mx-auto">
          Stop guessing - start selling smarter. Sellinder analyzes your prospect's LinkedIn profile and activity, then creates a report showing what they like, what to talk about, and how to start the conversation.
        </p>

        <div class="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <a href="/pricing"
             class="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-orange-600 font-semibold shadow hover:opacity-90">
            Get Started
          </a>
          <a href="/pricing"
             class="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-white text-white font-semibold hover:bg-white/10">
            See Features
          </a>
        </div>
      </div>
    </section>
    </div>
  )
}

export default Hero