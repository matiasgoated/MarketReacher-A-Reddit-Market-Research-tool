import { GoogleGenAI } from "@google/genai";
import { ScrapeResult, KeywordStat, GroundingSource } from "../types";

// Function to validate and parse the JSON block from the text response
const extractJsonBlock = (text: string): KeywordStat[] => {
  try {
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    }
    // Fallback if no code block but raw array
    const looseMatch = text.match(/\[\s*\{.*\}\s*\]/s);
    if (looseMatch) {
      return JSON.parse(looseMatch[0]);
    }
    return [];
  } catch (e) {
    console.error("Failed to parse JSON stats:", e);
    return [];
  }
};

export const analyzeRedditKeywords = async (
  topic: string,
  keywords: string[]
): Promise<ScrapeResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    I need you to act as a Reddit scraper and analyzer.
    
    1. SEARCH: Use Google Search to find recent Reddit threads, comments, and discussions regarding the topic: "${topic}".
    2. ANALYZE: Scan the content found in these search results for the following specific keywords: ${keywords.join(", ")}.
    3. REPORT:
       - Write a comprehensive summary of the sentiment and context in which these keywords appear on Reddit.
       - Count the approximate frequency or relevance score (0-100) of each keyword based on the search results.
    
    IMPORTANT OUTPUT FORMAT:
    Your response must contain a natural language summary FIRST.
    Then, AT THE VERY END of your response, strictly provide a JSON code block containing the stats in this format:
    
    \`\`\`json
    [
      { "keyword": "keyword1", "count": 10, "context": "Used mostly in positive contexts regarding features." },
      { "keyword": "keyword2", "count": 5, "context": "Mentioned as a bug." }
    ]
    \`\`\`
    
    Do not add any text after the JSON block.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Note: responseMimeType cannot be JSON when using googleSearch tools
      },
    });

    const text = response.text || "No text content generated.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Extract sources
    const sources: GroundingSource[] = groundingChunks
      .filter((chunk: any) => chunk.web || chunk.maps)
      .map((chunk: any) => ({
        web: chunk.web,
        maps: chunk.maps,
      }));

    // Extract stats from the text using regex
    const stats = extractJsonBlock(text);

    // Remove the JSON block from the summary for cleaner display
    const summary = text.replace(/```json[\s\S]*```/, "").trim();

    return {
      summary,
      stats,
      sources,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
