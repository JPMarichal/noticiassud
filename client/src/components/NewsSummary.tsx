interface Props {
  summary: string;
  loading: boolean;
}

export default function NewsSummary({ summary, loading }: Props) {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-grow text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="text-muted mt-2">Generando resumen con IA...</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="alert alert-info" role="alert">
        <i className="fas fa-info-circle me-2"></i>
        Selecciona un rango de fechas para generar un resumen de noticias.
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex align-items-center mb-4">
          <div className="flex-shrink-0">
            <i className="fas fa-robot fa-2x text-primary"></i>
          </div>
          <div className="flex-grow-1 ms-3">
            <h5 className="card-title mb-0">Resumen de Noticias</h5>
            <small className="text-muted">Generado por IA</small>
          </div>
        </div>
        <div className="mt-3 lh-lg" style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}>
          {summary}
        </div>
      </div>
      <div className="card-footer bg-light">
        <small className="text-muted">
          <i className="fas fa-info-circle me-1"></i>
          Este resumen fue generado automáticamente utilizando inteligencia artificial.
        </small>
      </div>
    </div>
  );
}