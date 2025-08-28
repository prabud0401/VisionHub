import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// IMPORTANT: Replace this with your actual Gemini API key if it changes.
const GEMINI_API_KEY = "AIzaSyDHNPNcQ98-iU0H-_EAzmeiRblkrVPzU64";

if (!GEMINI_API_KEY || GEMINI_API_KEY.includes("YOUR_GEMINI_API_KEY")) {
  throw new Error('GEMINI_API_KEY is not set correctly in src/ai/genkit.ts. Please add your key.');
}

export const ai = genkit({
  plugins: [googleAI({apiKey: GEMINI_API_KEY})],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
