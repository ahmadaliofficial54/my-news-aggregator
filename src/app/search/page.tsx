// app/search/page.tsx

import { fetchGuardianArticles } from '@/services/guardianAPI';
import { fetchNewsApiArticles } from '@/services/newsAPI';
import { fetchNYTArticles } from '@/services/nytAPI';
import ArticleCard from '@/components/ArticleCard';
import { FiFilter } from 'react-icons/fi';
import Link from 'next/link';

export default async function SearchPage(props: any) {
  // We destructure 'searchParams' from props, defaulting to an empty object
  const { searchParams = {} } = props;

  // 1. Extract query params or set defaults
  const q = searchParams.q?.toString().trim() || 'latest';
  const from = searchParams.from || '';
  const to = searchParams.to || '';
  const category = searchParams.category || '';

  // We'll default the page to 1 if not provided or invalid
  const currentPage = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const pageSize = 6; // how many articles per page

  // 2. Convert "source" into an array
  let selectedSources: string[] = [];
  if (searchParams.source) {
    selectedSources = Array.isArray(searchParams.source)
      ? searchParams.source
      : [searchParams.source];
  }

  // 3. Build a list of fetch promises based on the selected sources
  const requests: Promise<any>[] = [];

  if (selectedSources.includes('guardianapis')) {
    requests.push(fetchGuardianArticles(q, { from, to, category }));
  }
  if (selectedSources.includes('newsapi')) {
    requests.push(fetchNewsApiArticles(q, { from, to, category }));
  }
  if (selectedSources.includes('nytimes')) {
    requests.push(fetchNYTArticles(q, { from, to, category }));
  }

  // If no source was checked, let's fetch ALL by default
  if (requests.length === 0) {
    requests.push(fetchGuardianArticles(q, { from, to, category }));
    requests.push(fetchNewsApiArticles(q, { from, to, category }));
    requests.push(fetchNYTArticles(q, { from, to, category }));
  }

  // 4. Fetch all in parallel
  const results = await Promise.all(requests);

  // 5. Transform & Combine
  let combinedArticles: any[] = [];
  for (const res of results) {
    if (!res) continue;

    if (res?.response?.results) {
      // Guardian
      combinedArticles.push(...transformGuardian(res));
    } else if (res?.articles) {
      // NewsAPI
      combinedArticles.push(...transformNewsApi(res));
    } else if (res?.response?.docs) {
      // NYTimes
      combinedArticles.push(...transformNYT(res));
    }
  }

  // 6. Local Pagination
  const totalArticles = combinedArticles.length;
  const totalPages = Math.ceil(totalArticles / pageSize);
  const safePage = currentPage < 1 ? 1 : currentPage > totalPages ? totalPages : currentPage;

  const startIndex = (safePage - 1) * pageSize;
  const endIndex = safePage * pageSize;
  const paginatedArticles = combinedArticles.slice(startIndex, endIndex);

  // Render
  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      {/* Page heading */}
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-800">
        Search News
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Find articles by keywords, date, category, and source.
      </p>

      {/* Filter Panel */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center space-x-2 border-b border-gray-200 pb-2">
          <FiFilter className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-700">Filter Options</h2>
        </div>

        {/* SEARCH FORM */}
        <form className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Keyword */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Keyword
            </label>
            <input
              type="text"
              name="q"
              defaultValue={q === 'latest' ? '' : q}
              placeholder="e.g. technology"
              className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Date Range (From) */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              From Date
            </label>
            <input
              type="date"
              name="from"
              defaultValue={from}
              className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Date Range (To) */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              To Date
            </label>
            <input
              type="date"
              name="to"
              defaultValue={to}
              className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              defaultValue={category}
              className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="technology">Technology</option>
              <option value="business">Business</option>
              <option value="sports">Sports</option>
              <option value="health">Health</option>
            </select>
          </div>

          {/* Source (CheckBoxes) */}
          <div className="col-span-1 flex flex-col sm:col-span-2 lg:col-span-2">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Sources
            </label>
            <div className="mt-1 flex flex-wrap gap-4">
              {['guardianapis', 'newsapi', 'nytimes'].map((src) => (
                <label
                  key={src}
                  className="inline-flex items-center space-x-1 text-sm"
                >
                  <input
                    type="checkbox"
                    name="source"
                    value={src}
                    defaultChecked={
                      Array.isArray(selectedSources)
                        ? selectedSources.includes(src)
                        : selectedSources === src
                    }
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                  />
                  <span className="capitalize text-gray-700">{src}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-span-1 flex items-end justify-end sm:col-span-2 lg:col-span-2">
            <button
              type="submit"
              className="inline-block rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Display current query for reference */}
      <div className="mt-6 text-sm text-gray-500">
        Showing results for:{' '}
        <span className="font-medium text-gray-700">{q}</span> — Page {safePage} of {totalPages}
      </div>

      {/* Articles Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedArticles.map((article, index) => (
          <ArticleCard key={index} article={article} />
        ))}
      </div>

      {/* Pagination Controls */}
      <PaginationBar
        currentPage={safePage}
        totalPages={totalPages}
        currentParams={{ q, from, to, category, source: selectedSources }}
      />
    </main>
  );
}

/** Pagination bar component */
function PaginationBar({
  currentPage,
  totalPages,
  currentParams,
}: {
  currentPage: number;
  totalPages: number;
  currentParams: {
    q?: string;
    from?: string;
    to?: string;
    category?: string;
    source?: string[];
  };
}) {
  if (totalPages <= 1) return null;

  const getLink = (page: number) => {
    const params = new URLSearchParams();
    if (currentParams.q) params.set('q', currentParams.q);
    if (currentParams.from) params.set('from', currentParams.from);
    if (currentParams.to) params.set('to', currentParams.to);
    if (currentParams.category) params.set('category', currentParams.category);

    if (currentParams.source) {
      currentParams.source.forEach((src) => params.append('source', src));
    }

    params.set('page', page.toString());
    return `?${params.toString()}`;
  };

  return (
    <div className="mt-6 flex items-center justify-center space-x-4">
      {/* Previous */}
      {currentPage > 1 && (
        <Link
          href={getLink(currentPage - 1)}
          className="rounded bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-300"
        >
          Previous
        </Link>
      )}

      <span className="text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next */}
      {currentPage < totalPages && (
        <Link
          href={getLink(currentPage + 1)}
          className="rounded bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-300"
        >
          Next
        </Link>
      )}
    </div>
  );
}

/** Transform Guardian response */
function transformGuardian(data: any) {
  const results = data.response?.results || [];
  return results.map((item: any) => ({
    title: item.webTitle,
    url: item.webUrl,
    source: 'The Guardian',
    publishedAt: new Date(item.webPublicationDate).toLocaleString(),
    author: '',
  }));
}

/** Transform NewsAPI response */
function transformNewsApi(data: any) {
  const articles = data.articles || [];
  return articles.map((item: any) => ({
    title: item.title,
    url: item.url,
    source: item.source?.name || 'NewsAPI Source',
    publishedAt: new Date(item.publishedAt).toLocaleString(),
    author: item.author || '',
  }));
}

/** Transform NYTimes response */
function transformNYT(data: any) {
  const docs = data.response?.docs || [];
  return docs.map((item: any) => ({
    title: item.headline?.main,
    url: item.web_url,
    source: 'New York Times',
    publishedAt: new Date(item.pub_date).toLocaleString(),
    author: item.byline?.original || '',
  }));
}