'use client';

import { useEffect, useState } from 'react';
import ArticleCard from '@/components/ArticleCard';

export default function FeedPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load preferences from localStorage
    const storedSources = localStorage.getItem('preferredSources');
    const storedCategories = localStorage.getItem('preferredCategories');
    const storedAuthors = localStorage.getItem('preferredAuthors');
    const storedFrom = localStorage.getItem('preferredFromDate');
    const storedTo = localStorage.getItem('preferredToDate');

    const preferredSources = storedSources ? JSON.parse(storedSources) : [];
    const preferredCategories = storedCategories ? JSON.parse(storedCategories) : [];
    const preferredAuthors = storedAuthors ? JSON.parse(storedAuthors) : [];
    const from = storedFrom || '';
    const to = storedTo || '';

    // Build query string
    // e.g. /api/feed?category=business&from=2023-01-01&source=cnn&source=bbc-news...
    const params = new URLSearchParams();

    // Basic keyword
    params.set('q', 'latest');

    if (from) params.set('from', from);
    if (to) params.set('to', to);

    // If user picks a single category, or multiple
    if (preferredCategories.length > 0) {
      // We'll just pick the first
      params.set('category', preferredCategories[0]);
    }

    // If user picks a single author for demonstration
    if (preferredAuthors.length > 0) {
      // We'll pick the first
      params.set('author', preferredAuthors[0]);
    }

    // If user picks multiple sources
    for (const src of preferredSources) {
      params.append('source', src); // e.g. source=cnn, source=bbc-news
    }

    async function fetchFeed() {
      try {
        setLoading(true);
        setError(null);

        // Fetch from our Next.js API route
        const res = await fetch(`/api/feed?${params.toString()}`);
        if (!res.ok) {
          throw new Error(`Failed with status ${res.status}`);
        }

        // shape: { articles: [...] }
        const data = await res.json();

        // You can do further client-side filtering here if needed
        if (!data.articles) {
          setArticles([]);
        } else {
          setArticles(data.articles);
        }
      } catch (err) {
        console.error('Error fetching feed:', err);
        setError('Unable to load feed. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchFeed();
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-2 text-2xl font-bold text-gray-700">Your Personalized Feed</h1>
      <p className="text-sm text-gray-600">
        Fetching from /api/feed (server-to-server calls).
      </p>

      {loading && <p className="mt-6">Loading feed...</p>}

      {error && (
        <div className="mt-6 rounded bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <p className="mt-6 text-gray-500">No articles found based on your preferences.</p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article: any, i: number) => (
          <ArticleCard key={i} article={article} />
        ))}
      </div>
    </main>
  );
}