import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateNewsSummary(headlines: string[]): Promise<string> {
  const prompt = `Analyze and summarize the following news headlines, grouping them by theme and providing a coherent narrative summary:

Headlines:
${headlines.join('\n')}

Please provide a well-structured summary that:
1. Groups related news items
2. Highlights key themes
3. Provides context where relevant
4. Maintains a neutral tone
5. Is easy to read and understand

Respond in a narrative format.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 1000
  });

  return response.choices[0].message.content || "Unable to generate summary";
}
