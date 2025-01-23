import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import NewsFilters from '../components/NewsFilters';
import NewsSummary from '../components/NewsSummary';
import { fetchSummary } from '../lib/api';
import type { FilterParams } from '../lib/types';

export default function SummaryPage() {
  const [filters, setFilters] = useState<FilterParams>({
    startDate: new Date().toISOString().split('T')[0]
  });

  const { data: summary = '', isLoading } = useQuery({
    queryKey: ['/api/summary', filters.startDate, filters.endDate],
    queryFn: () => fetchSummary(filters.startDate, filters.endDate),
    enabled: !!(filters.startDate || filters.endDate)
  });

  return (
    <div className="container py-4">
      <h1 className="mb-4">
        <i className="fas fa-robot me-2"></i>
        Resumen de noticias
      </h1>

      <NewsFilters onFilterChange={setFilters} />
      <NewsSummary summary={summary} loading={isLoading} />
    </div>
  );
}