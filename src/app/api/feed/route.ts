// app/api/feed/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchNewsApiArticles } from '@/services/newsAPI';
import { fetchGuardianArticles } from '@/services/guardianAPI';
import { fetchNYTArticles } from '@/services/nytAPI';

// We'll parse the query params from the request URL, then fetch from each service
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // We can retrieve user preferences from query params
    const q = searchParams.get('q') || 'latest';
    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';
    const category = searchParams.get('category') || '';
    const author = searchParams.get('author') || '';

    // sources could be multiple, e.g. ?source=bbc-news&source=cnn
    const sources = searchParams.getAll('source'); // array of strings

    // Make parallel requests
    const [newsData, guardianData, nytData] = await Promise.all([
      fetchNewsApiArticles(q, { from, to, category, author, sources }),
      fetchGuardianArticles(q, { from, to, category, author, sources }),
      fetchNYTArticles(q, { from, to, category, author, sources }),
    ]);

    // Combine and transform
    const combined = [
      ...transformNewsApiArticles(newsData),
      ...transformGuardianArticles(guardianData),
      ...transformNytArticles(nytData),
    ];

    // Return combined articles as JSON
    return NextResponse.json({ articles: combined });
  } catch (error) {
    console.error('Error in /api/feed route:', error);
    return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 });
  }
}

// Transformers
function transformNewsApiArticles(data: any) {
  if (!data || !data.articles) return [];
  return data.articles.map((item: any) => ({
    title: item.title,
    url: item.url,
    source: item.source?.name || 'Unknown',
    publishedAt: item.publishedAt,
    author: item.author || '',
  }));
}

function transformGuardianArticles(data: any) {
  if (!data || !data.response || !data.response.results) return [];
  return data.response.results.map((item: any) => ({
    title: item.webTitle,
    url: item.webUrl,
    source: 'The Guardian',
    publishedAt: item.webPublicationDate,
    author: '',
  }));
}

function transformNytArticles(data: any) {
  if (!data || !data.response || !data.response.docs) return [];
  return data.response.docs.map((item: any) => ({
    title: item.headline?.main,
    url: item.web_url,
    source: 'New York Times',
    publishedAt: item.pub_date,
    author: item.byline?.original || '',
  }));
}