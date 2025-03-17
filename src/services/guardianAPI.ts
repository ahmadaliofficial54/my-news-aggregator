// services/guardianAPI.ts
import axios from 'axios';

interface FilterOptions {
  from?: string;       // e.g. "2023-01-01"
  to?: string;         // e.g. "2023-12-31"
  category?: string;   // maps to section in Guardian
  author?: string;     // Guardian doesn't truly support author param
  sources?: string[];  // Guardian doesn't support "sources" param
}

export async function fetchGuardianArticles(
  query: string,
  filters?: FilterOptions
) {
  const apiKey = process.env.GUARDIAN_API_KEY;
  const url = 'https://content.guardianapis.com/search';

  const params: any = {
    q: query,
    'api-key': apiKey,
  };

  // Date range
  if (filters?.from) params['from-date'] = filters.from;
  if (filters?.to) params['to-date'] = filters.to;

  // Category => Guardian uses `section` param for categories (sport, business, etc)
  if (filters?.category) {
    // e.g., if user says "sports", that might be "sport" for Guardian
    // naive example:
    params.section = filters.category;
  }

  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching from The Guardian:', error);
    return null;
  }
}