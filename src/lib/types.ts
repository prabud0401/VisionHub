export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  promptId: string;
  model: string;
  createdAt: string;
  userId: string;
}

export interface GeneratedVideo {
  id: string;
  url: string;
  prompt: string;
  promptId: string;
  model: string;
  createdAt: string;
  userId: string;
}

/**
 * Custom error for credit-related issues.
 */
export class CreditError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CreditError';
  }
}
