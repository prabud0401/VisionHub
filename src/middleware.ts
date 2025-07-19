
import { NextResponse, type NextRequest } from 'next/server';
import fetch from 'node-fetch';

const IPINFO_TOKEN = '6236b457796e9a';

interface IPInfoResponse {
  country?: string;
  asn?: {
    asn?: string;
  };
}

export async function middleware(request: NextRequest) {
  // Only run this middleware for the pricing page
  if (request.nextUrl.pathname !== '/pricing') {
    return NextResponse.next();
  }

  // Avoid running middleware for static files
  if (/\.(.*)$/.test(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  try {
    // Get IP address from request headers
    const ip = request.ip || request.headers.get('x-forwarded-for')?.split(',')[0] || '8.8.8.8';
    
    // Fetch geolocation data from ipinfo.io, including ASN details
    const response = await fetch(`https://ipinfo.io/${ip}?token=${IPINFO_TOKEN}`);
    if (!response.ok) {
        throw new Error(`IPInfo request failed with status ${response.status}`);
    }
    const data: IPInfoResponse = await response.json();
    
    const country = data.country;
    const asn = data.asn?.asn;

    const url = request.nextUrl.clone();

    // Set currency based on country or ASN
    if (country === 'LK' || asn === 'AS32') {
      url.searchParams.set('currency', 'LKR');
    } else {
      url.searchParams.set('currency', 'USD');
    }
    
    // Rewrite the URL to include the currency query parameter
    return NextResponse.rewrite(url);

  } catch (error) {
    console.error('Middleware error:', error);
    // If anything fails, default to USD but allow it to proceed
    return NextResponse.next();
  }
}

export const config = {
  matcher: '/pricing',
};
