import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FurnishAI | AI Furniture Planning for Airbnb',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <span className="text-xl font-bold text-gray-900">
          Furnish<span className="text-blue-600">AI</span>
        </span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Sign in</Link>
          <Link href="/register" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h1 className="text-5xl font-bold text-gray-900 leading-tight">
          Furnish your Airbnb<br />
          <span className="text-blue-600">with AI, in minutes</span>
        </h1>
        <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto">
          Upload your floor plan, set your style and budget. Our AI automatically finds matching furniture and generates complete room layout plans — with a shopping list and total price.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/register" className="rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 transition-colors">
            Start for free
          </Link>
          <Link href="/login" className="rounded-lg border border-gray-300 px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '🗺️',
              title: 'Upload Your Floor Plan',
              desc: 'Upload an image or manually enter room dimensions. AI extracts rooms, doors, and windows automatically.',
            },
            {
              icon: '🛋️',
              title: 'AI Picks the Furniture',
              desc: 'Set your style (modern, cozy, minimalist...) and budget. AI matches furniture from IKEA, Wayfair, and more.',
            },
            {
              icon: '📐',
              title: 'Get a Ready Layout',
              desc: 'Receive 2–3 complete layout plans with a 2D floor view, furniture placement, and a full shopping list.',
            },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-gray-200 p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA bottom */}
      <section className="bg-blue-600 py-16 text-center">
        <h2 className="text-3xl font-bold text-white">Ready to furnish smarter?</h2>
        <p className="mt-3 text-blue-100">Join Airbnb hosts who plan faster with AI.</p>
        <Link href="/register" className="mt-6 inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
          Get started for free
        </Link>
      </section>
    </div>
  )
}
