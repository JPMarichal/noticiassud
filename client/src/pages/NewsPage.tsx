import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import NewsFilters from '../components/NewsFilters';
import NewsGrid from '../components/NewsGrid';
import { fetchNews } from '../lib/api';
import type { FilterParams } from '../lib/types';

export default function NewsPage() {
  const [filters, setFilters] = useState<FilterParams>({
    startDate: new Date().toISOString().split('T')[0]
  });

  const { data: news = [], isLoading } = useQuery({
    queryKey: ['/api/news', filters],
    queryFn: () => fetchNews(filters)
  });

  return (
    <div className="container py-4">
      <h1 className="mb-4">
        <i className="fas fa-newspaper me-2"></i>
        Últimas noticias
      </h1>

      <NewsFilters onFilterChange={setFilters} />
      <NewsGrid news={news} loading={isLoading} />
    </div>
  );
}