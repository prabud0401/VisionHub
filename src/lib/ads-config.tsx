
'use client';

/**
 * @fileoverview Centralized configuration for ad placements.
 * This file manages the ad code for different slots in the application.
 * You can update the ad units here to change them across the site.
 */

import Script from 'next/script';

// Define the structure for an ad slot
interface AdSlot {
  id: string;
  component: React.ReactNode;
}

/**
 * A map of all ad slots available in the application.
 * The key is a unique identifier for the ad slot.
 * The value is a React component that renders the ad.
 * 
 * To add a new ad, simply add a new entry to this object.
 * The ad component can be a simple script tag or a more complex component.
 * 
 * Example AdSense Code:
 * <ins className="adsbygoogle"
 *      style={{ display: 'block' }}
 *      data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
 *      data-ad-slot="yyyyyyyyyy"
 *      data-ad-format="auto"
 *      data-full-width-responsive="true"></ins>
 */
export const adSlots: { [key: string]: AdSlot } = {
  'image-generation-modal-ad': {
    id: 'image-generation-modal-ad',
    component: (
      <div className="w-full h-full flex items-center justify-center bg-muted/50 rounded-lg">
        <div className="text-center p-4">
            <ins className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-4363233136452065"
                data-ad-slot="1234567890" // Replace with your actual ad slot ID
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
            <p className="text-xs text-muted-foreground mt-2">Advertisement</p>
            <Script id="adsense-pusher-modal" strategy="lazyOnload">
                {`(adsbygoogle = window.adsbygoogle || []).push({});`}
            </Script>
        </div>
      </div>
    ),
  },
  'gallery-page-banner-ad': {
    id: 'gallery-page-banner-ad',
    component: (
         <div className="w-full h-full flex items-center justify-center bg-muted/50 rounded-lg">
            <div className="text-center p-4">
                <ins className="adsbygoogle"
                    style={{ display: "block" }}
                    data-ad-client="ca-pub-4363233136452065"
                    data-ad-slot="0987654321" // Replace with your actual ad slot ID
                    data-ad-format="auto"
                    data-full-width-responsive="true"></ins>
                <p className="text-xs text-muted-foreground mt-2">Advertisement</p>
                <Script id="adsense-pusher-gallery" strategy="lazyOnload">
                    {`(adsbygoogle = window.adsbygoogle || []).push({});`}
                </Script>
            </div>
      </div>
    )
  }
};

/**
 * A helper component to render an ad slot by its ID.
 * @param {string} slotId - The ID of the ad slot to render.
 */
export const AdSlot = ({ slotId }: { slotId: string }) => {
  const ad = adSlots[slotId];
  if (!ad) {
    console.warn(`Ad slot with ID "${slotId}" not found.`);
    return null;
  }
  return <>{ad.component}</>;
};
