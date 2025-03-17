// services/nytAPI.ts
import axios from 'axios';

interface FilterOptions {
  from?: string;       // e.g. "2023-01-01"
  to?: string;         // e.g. "2023-12-31"
  category?: string;   // might be news_desk for advanced usage
  author?: string;     // can do advanced "byline:()"
  sources?: string[];  // not typically supported
}

export async function fetchNYTArticles(
  query: string,
  filters?: FilterOptions
) {
  const apiKey = process.env.NYTIMES_API_KEY;
  const url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';

  const params: any = {
    q: query,
    'api-key': apiKey,
  };

  // Begin/End date in YYYYMMDD
  if (filters?.from) {
    params.begin_date = filters.from.replaceAll('-', '');
  }
  if (filters?.to) {
    params.end_date = filters.to.replaceAll('-', '');
  }

  // Category => might do fq=news_desk:("Business") etc.
  if (filters?.category) {
    params.fq = `news_desk:("${filters.category}")`;
  }

  // Author => combine with existing fq
  if (filters?.author) {
    if (params.fq) {
      params.fq += ` AND byline:("${filters.author}")`;
    } else {
      params.fq = `byline:("${filters.author}")`;
    }
  }

  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching from NYT:', error);
    return null;
  }
}