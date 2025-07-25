// Environment variable validation and configuration
export const env = {
  // Firebase Client Configuration
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',

  // Server-side Configuration
  FIREBASE_SERVICE_ACCOUNT_KEY: process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  ADMIN_SECRET_CODE: process.env.ADMIN_SECRET_CODE || 'dev-secret-123',

  // App Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === 'production' ? 'https://visionhub.pics' : 'http://localhost:9002'),
} as const;

// Validation for required environment variables
export function validateEnv() {
  const requiredClientVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  ];

  const requiredServerVars = [
    'FIREBASE_SERVICE_ACCOUNT_KEY',
    'GEMINI_API_KEY',
  ];

  const missingVars: string[] = [];

  // Check client-side vars
  requiredClientVars.forEach(varName => {
    if (!env[varName as keyof typeof env]) {
      missingVars.push(varName);
    }
  });

  // Check server-side vars (only on server)
  if (typeof window === 'undefined') {
    requiredServerVars.forEach(varName => {
      if (!env[varName as keyof typeof env]) {
        missingVars.push(varName);
      }
    });
  }

  if (missingVars.length > 0) {
    const isProduction = env.NODE_ENV === 'production';
    const message = `Missing required environment variables: ${missingVars.join(', ')}`;
    
    if (isProduction) {
      throw new Error(message);
    } else {
      console.warn(`⚠️ ${message}`);
      console.warn('Please check your .env file and restart the development server.');
    }
  }

  return true;
}

// Auto-validate in production
if (env.NODE_ENV === 'production') {
  validateEnv();
} 