// Footer widget
// ✅ Reusable footer component
export function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-16 bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-blue-600 mb-4">Practical FSD</h3>
            <p className="text-gray-600 text-sm">
              Next.js 15 + React Compiler + Feature-Sliced Design guide
            </p>
          </div>

          {/* Documentation */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Documentation</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a
                  href="https://github.com/practical-fsd/guide"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-blue-600">Home</a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-blue-600">Dashboard</a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a
                  href="https://feature-sliced.design"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600"
                >
                  FSD Official
                </a>
              </li>
              <li>
                <a
                  href="https://nextjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600"
                >
                  Next.js
                </a>
              </li>
              <li>
                <a
                  href="https://react.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600"
                >
                  React
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
          © 2025 Practical FSD. Built with Next.js 15 + FSD v1.0
        </div>
      </div>
    </footer>
  );
}
