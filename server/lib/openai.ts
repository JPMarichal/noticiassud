import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateNewsSummary(headlines: string[]): Promise<string> {
  const prompt = `Analiza y resume los siguientes titulares de noticias, agrupándolos por tema y proporcionando un resumen coherente en español:

Titulares:
${headlines.join('\n')}

Por favor, proporciona un resumen bien estructurado que:
1. Agrupe noticias relacionadas
2. Destaque temas principales
3. Proporcione contexto cuando sea relevante
4. Mantenga un tono neutral
5. Sea fácil de leer y entender

Responde en formato narrativo en español.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 1000
  });

  return response.choices[0].message.content || "No se pudo generar el resumen";
}