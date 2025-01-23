import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./lib/db";
import { generateNewsSummary } from "./lib/openai";

export function registerRoutes(app: Express): Server {
  // News retrieval endpoint
  app.get("/api/news", async (req, res) => {
    try {
      const {
        startDate,
        endDate,
        source,
        section,
        country
      } = req.query;

      let conditions = [];
      const params: any[] = [];

      if (startDate && endDate) {
        conditions.push("fecha_publicacion BETWEEN ? AND ?");
        params.push(startDate, endDate);
      } else if (startDate) {
        conditions.push("fecha_publicacion = ?");
        params.push(startDate);
      }

      if (source) {
        conditions.push("fuente = ?");
        params.push(source);
      }

      if (section) {
        conditions.push("seccion = ?");
        params.push(section);
      }

      if (country) {
        conditions.push("pais = ?");
        params.push(country);
      }

      const whereClause = conditions.length > 0 
        ? `WHERE ${conditions.join(" AND ")}` 
        : "";

      const query = `
        SELECT 
          id, titulo, resumen, url, url_imagen, 
          fecha_publicacion, tipo, fuente, pais, 
          idioma, seccion, fecha_extraccion
        FROM noticias_iglesia
        ${whereClause}
        ORDER BY fecha_publicacion DESC
      `;

      const news = await db.query(query, params);
      res.json(news);
    } catch (error) {
      console.error('Error in /api/news:', error);
      res.status(500).json({ 
        error: "Error fetching news",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // News summary endpoint
  app.get("/api/summary", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      let conditions = [];
      const params: any[] = [];

      if (startDate && endDate) {
        conditions.push("fecha_publicacion BETWEEN ? AND ?");
        params.push(startDate, endDate);
      } else if (startDate) {
        conditions.push("fecha_publicacion = ?");
        params.push(startDate);
      }

      const whereClause = conditions.length > 0 
        ? `WHERE ${conditions.join(" AND ")}` 
        : "";

      const query = `
        SELECT titulo 
        FROM noticias_iglesia 
        ${whereClause}
        ORDER BY fecha_publicacion DESC
      `;

      const news = await db.query<{ titulo: string }[]>(query, params);
      const headlines = news.map(n => n.titulo);

      if (headlines.length === 0) {
        return res.json({ summary: "No hay noticias para resumir en el rango de fechas seleccionado." });
      }

      const summary = await generateNewsSummary(headlines);
      res.json({ summary });
    } catch (error) {
      console.error('Error in /api/summary:', error);
      res.status(500).json({ 
        error: "Error generating summary",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // Metadata endpoints with better error handling and type safety
  app.get("/api/sources", async (_req, res) => {
    try {
      const sources = await db.query<{ fuente: string }[]>(
        "SELECT DISTINCT fuente FROM noticias_iglesia ORDER BY fuente"
      );
      res.json(sources.map(s => s.fuente));
    } catch (error) {
      console.error('Error in /api/sources:', error);
      res.status(500).json({ 
        error: "Error fetching sources",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  app.get("/api/sections", async (_req, res) => {
    try {
      const sections = await db.query<{ seccion: string }[]>(
        "SELECT DISTINCT seccion FROM noticias_iglesia WHERE seccion IS NOT NULL ORDER BY seccion"
      );
      res.json(sections.map(s => s.seccion));
    } catch (error) {
      console.error('Error in /api/sections:', error);
      res.status(500).json({ 
        error: "Error fetching sections",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  app.get("/api/countries", async (_req, res) => {
    try {
      const countries = await db.query<{ pais: string }[]>(
        "SELECT DISTINCT pais FROM noticias_iglesia WHERE pais IS NOT NULL ORDER BY pais"
      );
      res.json(countries.map(c => c.pais));
    } catch (error) {
      console.error('Error in /api/countries:', error);
      res.status(500).json({ 
        error: "Error fetching countries",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}