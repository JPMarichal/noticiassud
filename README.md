# Noticias SUD

Una plataforma de agregación y análisis de noticias con soporte multilingüe y análisis impulsado por IA.

## Características

- 📰 Agregación de noticias de múltiples fuentes
- 🤖 Análisis y resúmenes generados por IA
- 🌍 Soporte multilingüe (Español e Inglés)
- 📱 Diseño responsivo con Bootstrap
- 🔍 Búsqueda y filtrado avanzado
- 📊 Análisis de datos y tendencias

## Requisitos

- Node.js >= 18
- PostgreSQL
- Clave API de OpenAI

## Configuración

1. Clonar el repositorio:
```bash
git clone https://github.com/JPMarichal/noticiassud.git
cd noticiassud
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
   - Copiar `.env.example` a `.env`
   - Completar las variables requeridas

4. Inicializar la base de datos:
```bash
npm run db:push
```

5. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

## Estructura del Proyecto

```
├── client/              # Frontend React
│   ├── src/            
│   │   ├── components/ # Componentes React
│   │   ├── lib/        # Utilidades y configuración
│   │   └── pages/      # Páginas de la aplicación
├── server/             # Backend Express
│   ├── config/        # Configuración
│   ├── lib/           # Utilidades del servidor
│   └── routes.ts      # Rutas de la API
└── db/                # Esquemas y migraciones
```

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
