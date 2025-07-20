import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://visionhub.pics' 
    : 'http://localhost:9002';

  const marketingPages = [
    '/',
    '/about',
    '/services',
    '/pricing',
    '/faq',
    '/blog',
    '/contact',
    '/documentation',
    '/get-api',
    '/terms',
    '/privacy',
    '/tutorials',
  ];

  const sitemapEntries = marketingPages.map(page => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: page === '/' ? 1 : 0.8,
  }));

  return sitemapEntries;
}
