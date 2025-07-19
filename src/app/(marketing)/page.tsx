
import fs from 'fs';
import path from 'path';
import LandingPageClient from '@/components/landing/landing-page-client';

// This is now a Server Component, which is the correct place to read files.
export default function LandingPage() {
  const imageDirectory = path.join(process.cwd(), 'public/images');
  
  let imagePaths: string[] = [];
  try {
    const imageFiles = fs.readdirSync(imageDirectory);
    imagePaths = imageFiles.map(file => `/images/${file}`);
  } catch (error) {
    console.error("Could not read gallery images:", error);
    // If there's an error, we'll pass an empty array to the client
    // so the page doesn't crash.
  }

  // We pass the list of paths to the Client Component as a prop.
  return <LandingPageClient imagePaths={imagePaths} />;
}
