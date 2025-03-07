import { FilterParams, News } from './types';

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/noticias/iglesia'
  : '';

export async function fetchNews(filters: FilterParams): Promise<News[]> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  const response = await fetch(`${BASE_URL}/api/news?${params}`);
  if (!response.ok) throw new Error('Failed to fetch news');
  return response.json();
}

export async function fetchSummary(startDate?: string, endDate?: string): Promise<string> {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = await fetch(`${BASE_URL}/api/summary?${params}`);
  if (!response.ok) throw new Error('Failed to fetch summary');
  const data = await response.json();
  return data.summary;
}

export async function fetchLanguages(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/api/languages`);
  if (!response.ok) throw new Error('Failed to fetch languages');
  return response.json();
}

export async function fetchSources(language?: string): Promise<string[]> {
  const params = new URLSearchParams();
  if (language) params.append('language', language);

  const response = await fetch(`${BASE_URL}/api/sources?${params}`);
  if (!response.ok) throw new Error('Failed to fetch sources');
  return response.json();
}

export async function fetchSections(source?: string): Promise<string[]> {
  const params = new URLSearchParams();
  if (source) params.append('source', source);

  const response = await fetch(`${BASE_URL}/api/sections?${params}`);
  if (!response.ok) throw new Error('Failed to fetch sections');
  return response.json();
}

export async function fetchCountries(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/api/countries`);
  if (!response.ok) throw new Error('Failed to fetch countries');
  return response.json();
}