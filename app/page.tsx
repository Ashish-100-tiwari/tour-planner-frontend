'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-black dark:text-white">
                Tour Planner AI
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">
                How It Works
              </a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">
                Pricing
              </a>
              <button onClick={() => router.push('/auth/signin')} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">
                Sign In
              </button>
              <button onClick={() => router.push('/auth/signup')} className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm font-medium">
                Get Started
              </button>
            </div>
            <button className="md:hidden text-gray-600 dark:text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-800">
                Powered by AI
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-semibold mb-8 text-black dark:text-white leading-tight tracking-tight">
              Plan Your Perfect Trip
              <br />
              in Minutes
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              AI checks train, flight, and bus availability, finds hotels, and recommends top-rated food experiences and activities—all tailored to your preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button onClick={() => router.push('/auth/signup')} className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black text-base font-medium rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                Start Planning Free
              </button>
              <button className="px-8 py-3 bg-white dark:bg-black text-black dark:text-white text-base font-medium rounded-md border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Hero Visual Element */}
          <div className="mt-24 relative">
            <div className="relative max-w-5xl mx-auto">
              <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div className="text-2xl mb-3">✈️</div>
                    <h3 className="font-semibold text-black dark:text-white mb-2 text-sm">Transportation</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Real-time train, flight & bus availability</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div className="text-2xl mb-3">🏨</div>
                    <h3 className="font-semibold text-black dark:text-white mb-2 text-sm">Hotels</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Best available accommodations</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div className="text-2xl mb-3">🍽️</div>
                    <h3 className="font-semibold text-black dark:text-white mb-2 text-sm">Food & Activities</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Top-rated recommendations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body/Features Section */}
      <section id="features" className="py-24 px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-semibold text-black dark:text-white mb-4 tracking-tight">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
              Comprehensive travel planning powered by real-time data and AI recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-black p-8 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center mb-6 border border-gray-200 dark:border-gray-800">
                <span className="text-xl">✈️</span>
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3">Flight Availability</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Real-time flight search across all major airlines. Compare prices, schedules, and availability instantly.
              </p>
            </div>

            <div className="bg-white dark:bg-black p-8 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center mb-6 border border-gray-200 dark:border-gray-800">
                <span className="text-xl">🚂</span>
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3">Train Schedules</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Check train routes, timetables, and seat availability. Book tickets directly through our platform.
              </p>
            </div>

            <div className="bg-white dark:bg-black p-8 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center mb-6 border border-gray-200 dark:border-gray-800">
                <span className="text-xl">🚌</span>
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3">Bus Routes</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Find bus connections, check availability, and compare different bus operators for the best routes.
              </p>
            </div>

            <div className="bg-white dark:bg-black p-8 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center mb-6 border border-gray-200 dark:border-gray-800">
                <span className="text-xl">🏨</span>
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3">Hotel Availability</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Search hotels by location, price, and ratings. Real-time availability and instant booking options.
              </p>
            </div>

            <div className="bg-white dark:bg-black p-8 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center mb-6 border border-gray-200 dark:border-gray-800">
                <span className="text-xl">🍽️</span>
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3">Food Recommendations</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Discover new and highly-rated restaurants, cafes, and local food experiences curated by AI based on reviews and trends.
              </p>
            </div>

            <div className="bg-white dark:bg-black p-8 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center mb-6 border border-gray-200 dark:border-gray-800">
                <span className="text-xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3">Activity Suggestions</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Get personalized activity recommendations—from must-see attractions to hidden gems, all rated and reviewed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-semibold text-black dark:text-white mb-4 tracking-tight">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-light">
              Three simple steps to your perfect trip
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-8 rounded-lg">
              <div className="text-4xl font-semibold mb-4 text-gray-300 dark:text-gray-700">01</div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Share Your Preferences</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Tell us your destination, dates, budget, and interests. Our AI learns your travel style and preferences.
              </p>
            </div>

            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-8 rounded-lg">
              <div className="text-4xl font-semibold mb-4 text-gray-300 dark:text-gray-700">02</div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">AI Searches & Analyzes</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                We check train, flight, and bus availability, search hotels, and analyze millions of reviews for food and activities.
              </p>
            </div>

            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-8 rounded-lg">
              <div className="text-4xl font-semibold mb-4 text-gray-300 dark:text-gray-700">03</div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Get Your Plan</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Receive a complete itinerary with transportation, hotels, and top-rated food and activity recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black dark:bg-white text-gray-400 dark:text-gray-600 py-16 px-6 lg:px-8 border-t border-gray-800 dark:border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-lg font-semibold text-white dark:text-black mb-4">
                Tour Planner AI
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-500 leading-relaxed">
                AI-powered travel planning with real-time availability checks and personalized recommendations.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white dark:text-black mb-4 text-sm">Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm hover:text-white dark:hover:text-black transition-colors">Features</a></li>
                <li><a href="#" className="text-sm hover:text-white dark:hover:text-black transition-colors">Pricing</a></li>
                <li><a href="#" className="text-sm hover:text-white dark:hover:text-black transition-colors">API</a></li>
                <li><a href="#" className="text-sm hover:text-white dark:hover:text-black transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white dark:text-black mb-4 text-sm">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm hover:text-white dark:hover:text-black transition-colors">About</a></li>
                <li><a href="#" className="text-sm hover:text-white dark:hover:text-black transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm hover:text-white dark:hover:text-black transition-colors">Careers</a></li>
                <li><a href="#" className="text-sm hover:text-white dark:hover:text-black transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white dark:text-black mb-4 text-sm">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm hover:text-white dark:hover:text-black transition-colors">Privacy</a></li>
                <li><a href="#" className="text-sm hover:text-white dark:hover:text-black transition-colors">Terms</a></li>
                <li><a href="#" className="text-sm hover:text-white dark:hover:text-black transition-colors">Security</a></li>
                <li><a href="#" className="text-sm hover:text-white dark:hover:text-black transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 dark:border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-500">
              © 2024 Tour Planner AI. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white dark:hover:text-black transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="hover:text-white dark:hover:text-black transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="hover:text-white dark:hover:text-black transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
