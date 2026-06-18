import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function listModels() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    console.log("Fetching available models for your API key...");
    
    // In @google/genai, ai.models doesn't have list() exposed identically in all versions, 
    // but typically we can try to fetch them or just try another model name.
    // Let's try imagen-3.0-generate-002
    console.log("Trying imagen-4.0-fast-generate-001...");
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-fast-generate-001',
      prompt: 'A test photo of a single slice of pizza',
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1'
      }
    });
    console.log("Success! Got image bytes length:", response.generatedImages?.[0]?.image?.imageBytes?.length);
  } catch (e: any) {
    console.error("API Error with imagen-4.0-fast-generate-001:", e.message);
  }
}

listModels();
