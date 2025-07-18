
'use client';

/**
 * @fileoverview Centralized configuration for ad placements.
 * This file manages the ad code for different slots in the application.
 * You can update the ad units here to change them across the site.
 */

import Script from 'next/script';
import { Card } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';

// Define the structure for an ad slot
export interface AdSlotConfig {
  id: string;
  description: string;
  active: boolean; // Control whether the ad is globally active
  component: React.ReactNode;
}

const AdPlaceholder = ({ title }: { title: string }) => (
    <Card className="w-full h-full flex items-center justify-center bg-muted/50 rounded-lg border-dashed">
        <div className="text-center p-4 text-muted-foreground">
            <Newspaper className="h-8 w-8 mx-auto mb-2" />
            <p className="font-semibold">{title}</p>
            <p className="text-xs">Ad Slot</p>
        </div>
    </Card>
);


/**
 * A map of all ad slots available in the application.
 * The key is a unique identifier for the ad slot.
 * The value is a React component that renders the ad.
 * 
 * To add a new ad, simply add a new entry to this object.
 * To disable an ad, set `active: false`.
 * 
 * Example AdSense Code:
 * <ins className="adsbygoogle"
 *      style={{ display: 'block' }}
 *      data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
 *      data-ad-slot="yyyyyyyyyy"
 *      data-ad-format="auto"
 *      data-full-width-responsive="true"></ins>
 */
export const adSlots: { [key: string]: AdSlotConfig } = {
  'image-generation-modal-ad': {
    id: 'image-generation-modal-ad',
    description: "Displays in the modal pop-up while images are generating.",
    active: true,
    component: (
       <AdPlaceholder title="Generation Modal Ad" />
    ),
  },
  'dashboard-result-placeholder-ad': {
    id: 'dashboard-result-placeholder-ad',
    description: "Displays in the result panel on the dashboard before an image is generated.",
    active: true,
    component: (
        <AdPlaceholder title="Dashboard Placeholder Ad" />
    ),
  },
  'community-gallery-ad': {
    id: 'community-gallery-ad',
    description: "An in-feed ad that appears within the community gallery grid.",
    active: true,
    component: (
        <AdPlaceholder title="Community In-Feed Ad" />
    )
  },
   'user-gallery-ad': {
    id: 'user-gallery-ad',
    description: "An in-feed ad that appears within a user's personal gallery grid.",
    active: true,
    component: (
        <AdPlaceholder title="User Gallery In-Feed Ad" />
    )
  },
  'rewarded-ad-for-credits': {
    id: 'rewarded-ad-for-credits',
    description: "A rewarded ad that users can watch to earn credits. (Requires ad network integration).",
    active: false, // Disabled until a provider is integrated
    component: (
        <AdPlaceholder title="Rewarded Ad (Integration needed)" />
    )
  }
};

/**
 * A helper component to render an ad slot by its ID, checking user's ad preference.
 * @param {string} slotId - The ID of the ad slot to render.
 * @param {boolean} showAds - Whether the current user should see ads.
 */
export const AdSlot = ({ slotId, showAds }: { slotId: string; showAds: boolean }) => {
  const adConfig = adSlots[slotId];
  
  if (!adConfig || !adConfig.active || !showAds) {
    return null;
  }
  
  return <>{adConfig.component}</>;
};
