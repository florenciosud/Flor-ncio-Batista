import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;
// Initialize simply. If no key, we just won't return a fact, or return a default.
// We assume the environment provides the key as per instructions.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getNumberTrivia = async (number: number): Promise<string> => {
  if (!ai) return "Adicione sua API Key para ver curiosidades!";

  try {
    const model = "gemini-2.5-flash";
    const prompt = `Escreva uma frase curta, interessante e divertida (máximo 20 palavras) sobre o número ${number}. Pode ser uma curiosidade matemática, histórica ou uma mensagem de sorte. Responda em Português do Brasil.`;
    
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || `O número ${number} é muito especial!`;
  } catch (error) {
    console.error("Erro ao buscar curiosidade:", error);
    return `O número ${number} foi escolhido!`;
  }
};