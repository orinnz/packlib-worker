// focus on read the link and extract the content

import { GoogleGenAI, Type } from "@google/genai";
import type { Context } from "hono";
import type { AppContext } from "../fetch";

export async function readArticle(url: string, c: Context<AppContext>) {
  const ai = new GoogleGenAI({ apiKey: c.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
    You are an expert in reading and extracting content from articles.
    Your task is to read the article at the given URL and extract the content.
    
    URL: ${url}
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Title of the article" },
          author: { type: Type.STRING, description: "Author of the article" },
          date: { type: Type.STRING, description: "Published date of the article" },
          content: { type: Type.STRING, description: "Main content/body of the article" },
        },
      },
    }
  });

  const text = response.text || "{}";
  console.log("Extracted Article JSON:", text);
  
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse article JSON:", err);
    return null;
  }
}
