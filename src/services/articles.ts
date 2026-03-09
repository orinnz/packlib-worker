// focus on read the link and extract the content

import { GoogleGenAI } from "@google/genai";
import type { Context } from "hono";
import type { AppContext } from "../fetch";

export async function readArticle(url: string, c: Context<AppContext>) {
  const ai = new GoogleGenAI({ apiKey: c.env.GEMINI_API_KEYS });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
    You are an expert in reading and extracting content from articles.
    Your task is to read the article at the given URL and extract the content.
    
    URL: ${url}
    
    Please extract the following information:
    - Title
    - Author
    - Date
    - Content
    
    Please return the information in the following format:
    {
      "title": "title",
      "author": "author",
      "date": "date",
      "content": "content"
    }
    `,
  });
  console.log(response.text);
  return response.text;
}
