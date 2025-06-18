import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

const initializeGenAI = () => {
  if (!genAI) {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY environment variable is not set');
    }
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  }
  return genAI;
};

export const getModel = () => {
  const ai = initializeGenAI();
  return ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
}; 