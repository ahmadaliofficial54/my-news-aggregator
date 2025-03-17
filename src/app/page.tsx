export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mt-10 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-800">
          Welcome to My News Aggregator
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Browse the latest news from multiple sources, filter by category and date,
          or personalize your own feed to stay informed.
        </p>

        <div className="mt-8 flex justify-center space-x-4">
          <a
            href="/search"
            className="rounded bg-blue-600 px-5 py-3 text-base font-medium text-white hover:bg-blue-700"
          >
            Search
          </a>
          <a
            href="/feed"
            className="rounded bg-green-600 px-5 py-3 text-base font-medium text-white hover:bg-green-700"
          >
            Feed
          </a>
          <a
            href="/settings"
            className="rounded bg-gray-600 px-5 py-3 text-base font-medium text-white hover:bg-gray-700"
          >
            Settings
          </a>
        </div>
      </div>
    </main>
  );
}
