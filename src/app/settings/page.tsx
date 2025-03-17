'use client';

import { useState, useEffect } from 'react';
import { FiSettings } from 'react-icons/fi';

// 1) Import from react-hot-toast
import { Toaster, toast } from 'react-hot-toast';

export default function SettingsPage() {
  const [preferredSources, setPreferredSources] = useState<string[]>([]);
  const [preferredCategories, setPreferredCategories] = useState<string[]>([]);
  const [preferredAuthors, setPreferredAuthors] = useState<string[]>([]);
  const [preferredFromDate, setPreferredFromDate] = useState('');
  const [preferredToDate, setPreferredToDate] = useState('');

  useEffect(() => {
    // Load from localStorage on mount
    const storedSources = localStorage.getItem('preferredSources');
    const storedCategories = localStorage.getItem('preferredCategories');
    const storedAuthors = localStorage.getItem('preferredAuthors');
    const storedFrom = localStorage.getItem('preferredFromDate');
    const storedTo = localStorage.getItem('preferredToDate');

    if (storedSources) setPreferredSources(JSON.parse(storedSources));
    if (storedCategories) setPreferredCategories(JSON.parse(storedCategories));
    if (storedAuthors) setPreferredAuthors(JSON.parse(storedAuthors));
    if (storedFrom) setPreferredFromDate(storedFrom);
    if (storedTo) setPreferredToDate(storedTo);
  }, []);

  // Toggle a source
  function handleSourceChange(source: string) {
    setPreferredSources((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
    );
  }

  // Toggle a category
  function handleCategoryChange(category: string) {
    setPreferredCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  }

  // Toggle an author
  function handleAuthorChange(author: string) {
    setPreferredAuthors((prev) =>
      prev.includes(author) ? prev.filter((a) => a !== author) : [...prev, author]
    );
  }

  function savePreferences() {
    // 2) Simple required field check: at least one source must be selected
    if (preferredSources.length === 0) {
      toast.error('Please select at least one source.');
      return;
    }

    // Save everything to localStorage
    localStorage.setItem('preferredSources', JSON.stringify(preferredSources));
    localStorage.setItem('preferredCategories', JSON.stringify(preferredCategories));
    localStorage.setItem('preferredAuthors', JSON.stringify(preferredAuthors));
    localStorage.setItem('preferredFromDate', preferredFromDate);
    localStorage.setItem('preferredToDate', preferredToDate);

    // 3) Display success toast
    toast.success('Preferences saved!');
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      {/* React Hot Toast container - can also be placed in a Layout */}
      <Toaster position="top-right" />

      {/* Page title */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold text-gray-800 sm:text-4xl">
          User Settings
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Customize your news feed by selecting sources, categories, authors, and
          optionally a date range.
        </p>
      </div>

      {/* Settings card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {/* Optional heading row with icon */}
        <div className="mb-4 flex items-center space-x-2 border-b border-gray-200 pb-2">
          <FiSettings className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-700">Preferences</h2>
        </div>

        {/* Sources */}
        <div className="mb-6">
          <div className="mb-2 text-base font-medium text-gray-800">
            Preferred Sources
          </div>
          <p className="text-sm text-gray-500 mb-2">
            Choose one or more: Guardian, NewsAPI, NYTimes <span className="text-red-500">*</span>
          </p>
          <div className="mt-1 flex flex-wrap gap-4">
            {['guardianapis', 'newsapi', 'nytimes'].map((source) => (
              <label key={source} className="flex items-center space-x-1 text-sm">
                <input
                  type="checkbox"
                  checked={preferredSources.includes(source)}
                  onChange={() => handleSourceChange(source)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="capitalize text-gray-700">{source}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <div className="mb-2 text-base font-medium text-gray-800">
            Preferred Categories
          </div>
          <p className="text-sm text-gray-500 mb-2">
            For example: technology, business, sports, health
          </p>
          <div className="mt-1 flex flex-wrap gap-4">
            {['technology', 'business', 'sports', 'health'].map((cat) => (
              <label key={cat} className="flex items-center space-x-1 text-sm">
                <input
                  type="checkbox"
                  checked={preferredCategories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="capitalize text-gray-700">{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Authors */}
        <div className="mb-6">
          <div className="mb-2 text-base font-medium text-gray-800">
            Preferred Authors
          </div>
          <p className="text-sm text-gray-500 mb-2">
            Example authors (adjust as needed).
          </p>
          <div className="mt-1 flex flex-wrap gap-4">
            {['Ian Carlos Campbell', 'Andrew J. Hawkins', 'Nena Farrell','James Whitbrook'].map((author) => (
              <label key={author} className="flex items-center space-x-1 text-sm">
                <input
                  type="checkbox"
                  checked={preferredAuthors.includes(author)}
                  onChange={() => handleAuthorChange(author)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{author}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div className="mb-6">
          <div className="mb-2 text-base font-medium text-gray-800">
            Preferred Date Range
          </div>
          <p className="text-sm text-gray-500 mb-2">
            Fetch news within this timeframe, if supported by the source APIs.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-semibold text-gray-700">
                From Date
              </label>
              <input
                type="date"
                value={preferredFromDate}
                onChange={(e) => setPreferredFromDate(e.target.value)}
                className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-semibold text-gray-700">
                To Date
              </label>
              <input
                type="date"
                value={preferredToDate}
                onChange={(e) => setPreferredToDate(e.target.value)}
                className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 text-right">
          <button
            onClick={savePreferences}
            className="inline-block rounded bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </main>
  );
}
