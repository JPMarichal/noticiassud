import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./config/database";
import { generateNewsSummary } from "./lib/openai";
import { desc, eq, and, or, sql } from "drizzle-orm";
import { news } from "@db/schema";

export function registerRoutes(app: Express): Server {
  // News retrieval endpoint
  app.get("/api/news", async (req, res) => {
    try {
      const {
        startDate,
        endDate,
        source,
        section,
        country,
        language
      } = req.query;

      let conditions = [];

      if (startDate && endDate) {
        conditions.push(and(
          sql`fecha_publicacion >= ${startDate}`,
          sql`fecha_publicacion <= ${endDate}`
        ));
      } else if (startDate) {
        conditions.push(sql`fecha_publicacion = ${startDate}`);
      }

      if (source) {
        conditions.push(eq(news.fuente, source as string));
      }

      if (section) {
        conditions.push(eq(news.seccion, section as string));
      }

      if (country) {
        conditions.push(eq(news.pais, country as string));
      }

      if (language) {
        conditions.push(eq(news.idioma, language as string));
      }

      const result = await db.select().from(news)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(news.fechaPublicacion));

      res.json(result);
    } catch (error) {
      console.error('Error in /api/news:', error);
      res.status(500).json({ 
        error: "Error fetching news",
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  });

  // News summary endpoint
  app.get("/api/summary", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      let conditions = [];

      if (startDate && endDate) {
        conditions.push(and(
          sql`fecha_publicacion >= ${startDate}`,
          sql`fecha_publicacion <= ${endDate}`
        ));
      } else if (startDate) {
        conditions.push(sql`fecha_publicacion = ${startDate}`);
      }

      const result = await db.select({
        titulo: news.titulo
      })
      .from(news)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(news.fechaPublicacion));

      const headlines = result.map(n => n.titulo);

      if (headlines.length === 0) {
        return res.json({ summary: "No hay noticias para resumir en el rango de fechas seleccionado." });
      }

      const summary = await generateNewsSummary(headlines);
      res.json({ summary });
    } catch (error) {
      console.error('Error in /api/summary:', error);
      res.status(500).json({ 
        error: "Error generating summary",
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  });

  // Metadata endpoints
  app.get("/api/languages", async (_req, res) => {
    try {
      const result = await db
        .select({ idioma: news.idioma })
        .from(news)
        .where(sql`idioma IS NOT NULL`)
        .groupBy(news.idioma)
        .orderBy(news.idioma);

      res.json(result.map(l => l.idioma));
    } catch (error) {
      console.error('Error in /api/languages:', error);
      res.status(500).json({ 
        error: "Error fetching languages",
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  });

  app.get("/api/sources", async (req, res) => {
    try {
      const { language } = req.query;
      let query = db
        .select({ fuente: news.fuente })
        .from(news)
        .where(sql`fuente IS NOT NULL`);

      if (language) {
        query = query.where(eq(news.idioma, language as string));
      }

      const result = await query
        .groupBy(news.fuente)
        .orderBy(news.fuente);

      res.json(result.map(s => s.fuente));
    } catch (error) {
      console.error('Error in /api/sources:', error);
      res.status(500).json({ 
        error: "Error fetching sources",
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  });

  app.get("/api/sections", async (req, res) => {
    try {
      const { source } = req.query;
      let query = db
        .select({ seccion: news.seccion })
        .from(news)
        .where(sql`seccion IS NOT NULL`);

      if (source) {
        query = query.where(eq(news.fuente, source as string));
      }

      const result = await query
        .groupBy(news.seccion)
        .orderBy(news.seccion);

      res.json(result.map(s => s.seccion));
    } catch (error) {
      console.error('Error in /api/sections:', error);
      res.status(500).json({ 
        error: "Error fetching sections",
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  });

  app.get("/api/countries", async (_req, res) => {
    try {
      const result = await db
        .select({ pais: news.pais })
        .from(news)
        .where(sql`pais IS NOT NULL`)
        .groupBy(news.pais)
        .orderBy(news.pais);

      res.json(result.map(c => c.pais));
    } catch (error) {
      console.error('Error in /api/countries:', error);
      res.status(500).json({ 
        error: "Error fetching countries",
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}