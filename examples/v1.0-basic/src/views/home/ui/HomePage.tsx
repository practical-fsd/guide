// Home page view
// ✅ Page composition: combines widgets + features
// ✅ This is FSD's "pages" layer, renamed to "views" to avoid conflict with Next.js
'use client';

import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { CourseList } from '@/features/course-list';

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header widget */}
      <Header />

      {/* Main content */}
      <main className="flex-1">
        {/* Hero section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Practical FSD
            </h1>
            <p className="text-xl mb-4 text-blue-100 max-w-2xl mx-auto">
              Next.js 15 + React Compiler + Feature-Sliced Design
            </p>
            <p className="text-lg mb-8 text-blue-200 max-w-3xl mx-auto">
              Example project demonstrating FSD 6-layer architecture with Next.js App Router
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="https://github.com/practical-fsd/guide"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                View on GitHub
              </a>
              <a
                href="/dashboard"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Try Dashboard
              </a>
            </div>
          </div>
        </section>

        {/* Featured courses section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-2 text-center text-gray-900">
              Example Courses
            </h2>
            <p className="text-gray-600 text-center mb-12">
              Demonstrating FSD features and entities layers
            </p>

            {/* CourseList feature */}
            <CourseList />
          </div>
        </section>

        {/* Architecture highlights */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">
              Architecture Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  6 Layers
                </div>
                <div className="text-gray-600 font-medium mb-2">FSD Architecture</div>
                <div className="text-sm text-gray-500">
                  views, widgets, features, entities, shared
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  Next.js 15
                </div>
                <div className="text-gray-600 font-medium mb-2">App Router</div>
                <div className="text-sm text-gray-500">
                  With React 19 + React Compiler
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  TypeScript
                </div>
                <div className="text-gray-600 font-medium mb-2">Type Safety</div>
                <div className="text-sm text-gray-500">
                  Full type coverage
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer widget */}
      <Footer />
    </div>
  );
}
