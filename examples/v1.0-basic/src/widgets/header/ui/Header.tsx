// Header widget
// ✅ Independent UI block, can be reused across pages
'use client';

import { useState } from 'react';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="text-2xl font-bold text-blue-600">
            Practical FSD
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </a>
            <a href="/dashboard" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </a>
            <a
              href="https://github.com/practical-fsd/guide"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-600"
            >
              GitHub
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-blue-600"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <a
                href="/"
                className="text-gray-700 hover:text-blue-600 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </a>
              <a
                href="https://github.com/practical-fsd/guide"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-600 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                GitHub
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
