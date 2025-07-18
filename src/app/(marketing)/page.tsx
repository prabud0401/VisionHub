
import fs from 'fs';
import path from 'path';

import { LandingPageClient } from '@/components/landing/landing-page-client';

// This is now a Server Component, allowing us to read from the filesystem.
export default function Home() {
  // Read images from the public directory
  const galleryDir = path.join(process.cwd(), 'public/images/gallery');
  let galleryImagePaths: string[] = [];
  try {
    const filenames = fs.readdirSync(galleryDir);
    galleryImagePaths = filenames.map(name => `/images/gallery/${name}`);
  } catch (error) {
    console.error("Could not read gallery images directory:", error);
    // Fallback to an empty array if the directory doesn't exist
  }

  // The LandingPageClient component contains all the original client-side logic ('use client')
  // We pass the server-fetched image paths as a prop.
  return <LandingPageClient galleryImagePaths={galleryImagePaths} />;
}
