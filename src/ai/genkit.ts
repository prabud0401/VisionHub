import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// IMPORTANT: Your Gemini API key has been hardcoded here.
// This is a security risk. It is strongly recommended to use environment variables.
const GEMINI_API_KEY = "AIzaSyDB4QMPn1sTKegSxv7FeeQ5JAvPRPjDEkk";

export const ai = genkit({
  plugins: [googleAI({apiKey: GEMINI_API_KEY})],
  model: 'googleai/gemini-2.0-flash',
});
