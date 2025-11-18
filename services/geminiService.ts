import { GoogleGenAI } from "@google/genai";
import { Sale } from '../types';

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askSalesAssistant = async (question: string, salesData: Sale[]): Promise<string> => {
  try {
    // We limit context to recent sales to avoid token limits if the DB grows huge,
    // though 3-pro has a massive context window, it's good practice for client-side.
    // For this app, we'll pass up to 500 recent sales.
    const recentSales = salesData.slice(0, 500);
    
    const context = JSON.stringify(recentSales);
    
    const prompt = `
      You are a helpful data analyst assistant for "Boom Art", a 3D printing business.
      Here is the raw JSON data of the recent sales:
      ${context}

      Rules:
      1. Answer the user's question based strictly on this data.
      2. If the answer requires calculation (sum, average, profit margin), perform it accurately.
      3. Format currency in Soles (S/).
      4. Be concise and professional.
      5. If you can't find the answer in the data, say so.

      User Question: ${question}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 2048 }, // Enable thinking for math/reasoning
      }
    });

    return response.text || "Lo siento, no pude generar una respuesta.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Hubo un error al conectar con el asistente inteligente. Por favor verifica tu conexión o intenta más tarde.";
  }
};