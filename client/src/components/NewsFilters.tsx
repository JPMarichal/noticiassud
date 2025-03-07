import { useState, useEffect } from 'react';
import { FilterParams } from '../lib/types';
import { fetchSources, fetchSections, fetchCountries, fetchLanguages } from '../lib/api';

interface Props {
  onFilterChange: (filters: FilterParams) => void;
}

export default function NewsFilters({ onFilterChange }: Props) {
  const [languages, setLanguages] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterParams>({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    language: 'español',  // Valor por defecto
    source: '',  // "Todas las Fuentes"
    section: '', // "Todas las Secciones"
    country: ''  // "Todos los Países"
  });

  // Load languages and countries on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [languagesData, countriesData] = await Promise.all([
          fetchLanguages(),
          fetchCountries()
        ]);
        setLanguages(languagesData);
        setCountries(countriesData);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };
    loadInitialData();
  }, []);

  // Load sources when language changes
  useEffect(() => {
    const loadSources = async () => {
      if (filters.language) {
        try {
          const sourcesData = await fetchSources(filters.language);
          setSources(sourcesData);
          // Clear source and section when language changes
          if (filters.source) {
            const newFilters = { ...filters, source: '', section: '' };
            setFilters(newFilters);
            onFilterChange(newFilters);
          }
        } catch (error) {
          console.error('Error loading sources:', error);
        }
      }
    };
    loadSources();
  }, [filters.language]);

  // Load sections when source changes
  useEffect(() => {
    const loadSections = async () => {
      if (filters.source) {
        try {
          const sectionsData = await fetchSections(filters.source);
          setSections(sectionsData);
          if (sectionsData.length === 0) {
            // Si la fuente no tiene secciones, establecemos la sección por defecto
            const newFilters = { ...filters, section: '' };
            setFilters(newFilters);
            onFilterChange(newFilters);
          }
        } catch (error) {
          console.error('Error loading sections:', error);
        }
      } else {
        setSections([]);
        if (filters.section) {
          const newFilters = { ...filters, section: '' };
          setFilters(newFilters);
          onFilterChange(newFilters);
        }
      }
    };
    loadSections();
  }, [filters.source]);

  const handleFilterChange = (key: keyof FilterParams, value: string) => {
    const newFilters = { ...filters, [key]: value };
    // Clear dependent fields
    if (key === 'language') {
      newFilters.source = '';
      newFilters.section = '';
    } else if (key === 'source') {
      newFilters.section = '';
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePresetChange = (preset: string) => {
    const today = new Date();
    let startDate = today.toISOString().split('T')[0];
    let endDate = today.toISOString().split('T')[0];

    switch (preset) {
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        startDate = yesterday.toISOString().split('T')[0];
        endDate = startDate;
        break;
      case 'thisWeek':
        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(today.getDate() - today.getDay());
        startDate = thisWeekStart.toISOString().split('T')[0];
        break;
      case 'lastWeek':
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
        const lastWeekEnd = new Date(lastWeekStart);
        lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
        startDate = lastWeekStart.toISOString().split('T')[0];
        endDate = lastWeekEnd.toISOString().split('T')[0];
        break;
      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        break;
      case 'lastMonth':
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        startDate = lastMonthStart.toISOString().split('T')[0];
        endDate = lastMonthEnd.toISOString().split('T')[0];
        break;
      case 'thisYear':
        startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
        break;
      case 'lastYear':
        startDate = new Date(today.getFullYear() - 1, 0, 1).toISOString().split('T')[0];
        endDate = new Date(today.getFullYear() - 1, 11, 31).toISOString().split('T')[0];
        break;
    }

    const newFilters = { ...filters, startDate, endDate };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <div className="row g-2">
          <div className="col-12 col-md-6">
            <label className="form-label small fw-bold">
              <i className="fas fa-calendar-alt me-1"></i>
              Rangos Predefinidos
            </label>
            <select 
              className="form-select form-select-sm"
              onChange={(e) => handlePresetChange(e.target.value)}
            >
              <option value="">Seleccionar rango...</option>
              <option value="yesterday">Ayer</option>
              <option value="thisWeek">Esta Semana</option>
              <option value="lastWeek">Semana Pasada</option>
              <option value="thisMonth">Este Mes</option>
              <option value="lastMonth">Mes Pasado</option>
              <option value="thisYear">Este Año</option>
              <option value="lastYear">Año Pasado</option>
            </select>
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label small fw-bold">
              <i className="fas fa-calendar-day me-1"></i>
              Fecha Inicial
            </label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label small fw-bold">
              <i className="fas fa-calendar-check me-1"></i>
              Fecha Final
            </label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label small fw-bold">
              <i className="fas fa-language me-1"></i>
              Idioma
            </label>
            <select
              className="form-select form-select-sm"
              value={filters.language}
              onChange={(e) => handleFilterChange('language', e.target.value)}
            >
              <option value="">Todos los Idiomas</option>
              {languages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label small fw-bold">
              <i className="fas fa-newspaper me-1"></i>
              Fuente
            </label>
            <select
              className="form-select form-select-sm"
              value={filters.source}
              onChange={(e) => handleFilterChange('source', e.target.value)}
              disabled={!filters.language}
            >
              <option value="">Todas las Fuentes</option>
              {sources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label small fw-bold">
              <i className="fas fa-bookmark me-1"></i>
              Sección
            </label>
            <select
              className="form-select form-select-sm"
              value={filters.section}
              onChange={(e) => handleFilterChange('section', e.target.value)}
              disabled={!filters.source || sections.length === 0}
            >
              <option value="">Todas las Secciones</option>
              {sections.map(section => (
                <option key={section} value={section}>{section}</option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label small fw-bold">
              <i className="fas fa-globe-americas me-1"></i>
              País
            </label>
            <select
              className="form-select form-select-sm"
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
            >
              <option value="">Todos los Países</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}