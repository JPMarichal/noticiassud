export interface News {
  id: number;
  titulo: string;
  resumen: string | null;
  url: string;
  urlImagen: string | null;
  fechaPublicacion: string;
  tipo: string;
  fuente: string;
  pais: string | null;
  idioma: string | null;
  seccion: string | null;
  fechaExtraccion: string;
}

export interface FilterParams {
  startDate?: string;
  endDate?: string;
  source?: string;
  section?: string;
  country?: string;
}
