// services/newsAPI.ts
import axios from 'axios';

interface FilterOptions {
  from?: string;       // e.g. "2023-01-01"
  to?: string;         // e.g. "2023-12-31"
  category?: string;   // typically only works with /top-headlines
  author?: string;     // no direct param, might do q=someAuthor
  sources?: string[];
}

export async function fetchNewsApiArticles(
  query: string,
  filters?: FilterOptions
) {
  const apiKey = process.env.NEWS_API_KEY;
  const url = 'https://newsapi.org/v2/everything'; 
  // Note: for categories, consider /top-headlines

  const params: any = {
    q: query,
    apiKey,
  };

  if (filters?.from) params.from = filters.from;
  if (filters?.to) params.to = filters.to;

  if (filters?.sources && filters.sources.length > 0) {
    params.sources = filters.sources.join(',');
  }

  // For categories, maybe skip or handle differently
  // For authors, you might do: params.q += ` ${filters.author}`

  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching from NewsAPI:', error);
    return null;
  }
}