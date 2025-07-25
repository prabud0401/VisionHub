
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
  '/images/0 (1).png',
  '/images/0 (2).png',
  '/images/0 (5).png',
  '/images/0 (8).png',
  '/images/0 (10).png',
  '/images/0 (11).png',
  '/images/0 (13).png',
  '/images/0. (14).png',
  '/images/Text-to-Image Generation.png',
  '/images/Image-to-Image Transformation.png',
  '/images/AI Inpainting & Outpainting.png',
  '/images/AI Video Generation.png',
];

export default function LandingPage() {
  // Pass the static list of paths to the Client Component as a prop.
  return <LandingPageClient imagePaths={imagePaths} />;
}
