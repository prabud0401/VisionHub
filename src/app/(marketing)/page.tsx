
import LandingPageClient from '@/components/landing/landing-page-client';
import { Metadata } from 'next';

const siteUrl = process.env.NODE_ENV === 'production' 
  ? 'https://visionhub.pics' 
  : 'http://localhost:9002';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'VisionHub AI | The Ultimate AI Toolkit for Creators',
  description: 'Generate stunning AI images and videos from text prompts. Featuring a full suite of tools including background removal, image upscaling, and a prompt enhancer.',
  alternates: {
    canonical: '/',
  },
}

// Statically define the image paths to ensure the component is fully pre-rendered at build time.
const imagePaths = [
  '/images/1.png',
  '/images/2.png',
  '/images/3.png',
  '/images/4.png',
  '/images/5.png',
  '/images/6.png',
  '/images/7.png',
  '/images/8.png',
  '/images/9.png',
  '/images/10.png',
  '/images/11.png',
  '/images/12.png',
];

export default function LandingPage() {
  // Pass the static list of paths to the Client Component as a prop.
  return <LandingPageClient imagePaths={imagePaths} />;
}
