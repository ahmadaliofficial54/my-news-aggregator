'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-blue-600">
          My News Aggregator
        </Link>

        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:text-gray-900 focus:outline-none md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                isOpen
                  ? 'M6 18L18 6M6 6l12 12'
                  : 'M4 6h16M4 12h16M4 18h16'
              }
            />
          </svg>
        </button>

        <div className={`md:flex md:items-center ${isOpen ? 'block' : 'hidden'}`}>
          <Link
            href="/search"
            className="block px-3 py-2 text-gray-700 hover:text-blue-600 md:mx-2"
          >
            Search
          </Link>
          <Link
            href="/feed"
            className="block px-3 py-2 text-gray-700 hover:text-blue-600 md:mx-2"
          >
            Feed
          </Link>
          <Link
            href="/settings"
            className="block px-3 py-2 text-gray-700 hover:text-blue-600 md:mx-2"
          >
            Settings
          </Link>
        </div>
      </nav>
    </header>
  );
}
