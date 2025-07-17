import { config } from 'dotenv';
config();

import '@/ai/flows/remove-image-background.ts';
import '@/ai/flows/generate-image.ts';
import '@/ai/flows/enhance-prompt.ts';
import '@/ai/flows/image-to-prompt.ts';
import '@/ai/flows/upscale-image.ts';
import '@/ai/flows/generate-video.ts';
