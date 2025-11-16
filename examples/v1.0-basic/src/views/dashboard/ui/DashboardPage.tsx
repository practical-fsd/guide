// Dashboard page view
// ✅ Demonstrates page composition with different widgets/features
'use client';

import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';

export function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back! Here's your learning progress.
            </p>
          </div>

          {/* Dashboard grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stat card 1 */}
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Enrolled Courses</h3>
                <span className="text-3xl">📚</span>
              </div>
              <div className="text-3xl font-bold text-blue-600">12</div>
              <p className="text-sm text-gray-500 mt-2">
                3 in progress
              </p>
            </div>

            {/* Stat card 2 */}
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Completed</h3>
                <span className="text-3xl">✅</span>
              </div>
              <div className="text-3xl font-bold text-green-600">8</div>
              <p className="text-sm text-gray-500 mt-2">
                +2 this month
              </p>
            </div>

            {/* Stat card 3 */}
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Learning Hours</h3>
                <span className="text-3xl">⏱️</span>
              </div>
              <div className="text-3xl font-bold text-purple-600">156</div>
              <p className="text-sm text-gray-500 mt-2">
                This month
              </p>
            </div>
          </div>

          {/* Recent activity */}
          <div className="mt-8 bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Recent Activity</h2>

            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0">
                  <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center text-xl">
                    📖
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Completed: React Fundamentals</h3>
                    <p className="text-sm text-gray-600">
                      You completed lesson {i} - Great job!
                    </p>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
