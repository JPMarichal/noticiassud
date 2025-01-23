import { News } from '../lib/types';
import defaultNewsImage from '../assets/default-news.svg';

interface Props {
  news: News[];
  loading: boolean;
}

export default function NewsGrid({ news, loading }: Props) {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-grow text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="text-muted mt-2">Cargando noticias...</p>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        <i className="fas fa-info-circle me-2"></i>
        No se encontraron noticias con los filtros seleccionados.
      </div>
    );
  }

  // Ordenar noticias por fecha descendente
  const sortedNews = [...news].sort((a, b) => 
    new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime()
  );

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {sortedNews.map(item => (
        <div key={item.id} className="col">
          <div className="card h-100 shadow-sm hover-shadow transition-all">
            <div className="card-img-wrapper position-relative" style={{ height: '200px' }}>
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <img 
                  src={item.urlImagen || defaultNewsImage} 
                  className="card-img-top h-100 w-100 object-cover" 
                  alt={item.titulo}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = defaultNewsImage;
                  }}
                />
              </a>
            </div>
            <div className="card-body">
              <h5 className="card-title text-primary mb-3">
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                >
                  {item.titulo}
                </a>
              </h5>
              {item.resumen && (
                <p className="card-text text-muted mb-3" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: '3',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {item.resumen}
                </p>
              )}
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="badge bg-primary">
                  <i className="fas fa-newspaper me-1"></i>
                  {item.fuente}
                </span>
                {item.seccion && (
                  <span className="badge bg-secondary">
                    <i className="fas fa-bookmark me-1"></i>
                    {item.seccion}
                  </span>
                )}
                {item.pais && (
                  <span className="badge bg-info">
                    <i className="fas fa-globe-americas me-1"></i>
                    {item.pais}
                  </span>
                )}
              </div>
            </div>
            <div className="card-footer bg-transparent border-top-0">
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  <i className="fas fa-calendar-alt me-1"></i>
                  {new Date(item.fechaPublicacion).toLocaleDateString('es', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </small>
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-sm btn-outline-primary"
                >
                  <i className="fas fa-external-link-alt me-1"></i>
                  Leer más
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}