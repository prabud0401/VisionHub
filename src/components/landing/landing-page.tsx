'use client';
import HeaderUnauthenticated from '@/components/layout/header-unauthenticated';
import HeroSection from './hero-section';
import GalleryPreview from './gallery-preview';
import ToolsSuite from './tools-suite';
import Partners from './partners';
import Pricing from './pricing';
import Testimonials from './testimonials';
import FaqSection from './faq-section';
import SocialCta from './social-cta';
import Footer from '../layout/footer';
import { AuthModal } from '../auth-modal';

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
          <HeaderUnauthenticated />
          <main>
            <HeroSection />
            <GalleryPreview />
            <ToolsSuite />
            <Partners />
            <Pricing />
            <Testimonials />
            <FaqSection />
            <SocialCta />
          </main>
          <Footer />
          <AuthModal />
        </div>
    );
}
