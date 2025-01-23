import { pgTable, text, serial, date, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const news = pgTable("noticias_iglesia", {
  id: serial("id").primaryKey(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  resumen: text("resumen"),
  url: varchar("url", { length: 2083 }).notNull(),
  urlImagen: varchar("url_imagen", { length: 2083 }),
  fechaPublicacion: date("fecha_publicacion"),
  tipo: text("tipo"),
  fuente: varchar("fuente", { length: 255 }).notNull(),
  pais: varchar("pais", { length: 100 }),
  idioma: varchar("idioma", { length: 50 }),
  seccion: varchar("seccion", { length: 255 }),
  fechaExtraccion: timestamp("fecha_extraccion").defaultNow()
});

export const insertNewsSchema = createInsertSchema(news);
export const selectNewsSchema = createSelectSchema(news);
export type News = typeof news.$inferSelect;
export type InsertNews = typeof news.$inferInsert;
