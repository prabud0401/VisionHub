
import Link from "next/link";
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="w-full bg-card/80 backdrop-blur-sm border-t border-border/40 py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
        <div className="flex flex-col gap-4">
           <Link href="/">
            <Image src="/visionhub.png" alt="VisionHub Logo" width={180} height={45} />
          </Link>
          <p className="text-muted-foreground">
            The ultimate AI image generation platform for content creators.
          </p>
          <div className="flex gap-4 mt-2">
            <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook size={20} /></Link>
            <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter size={20} /></Link>
            <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram size={20} /></Link>
            <Link href="#" className="text-muted-foreground hover:text-primary"><Linkedin size={20} /></Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Platform</h4>
          <ul className="space-y-2">
            <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
            <li><Link href="/services" className="text-muted-foreground hover:text-primary">Services</Link></li>
            <li><Link href="/pricing" className="text-muted-foreground hover:text-primary">Pricing</Link></li>
            <li><Link href="/faq" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Resources</h4>
          <ul className="space-y-2">
            <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
            <li><Link href="/documentation" className="text-muted-foreground hover:text-primary">Documentation</Link></li>
            <li><Link href="/tutorials" className="text-muted-foreground hover:text-primary">Tutorials</Link></li>
            <li><Link href="/get-api" className="text-muted-foreground hover:text-primary">Get API</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Legal</h4>
          <ul className="space-y-2">
            <li><Link href="/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
            <li><Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
            <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
          </ul>
        </div>
      </div>
       <div className="container mx-auto mt-12 pt-8 border-t border-border/40 text-center">
         <p className="text-sm text-muted-foreground">
           &copy; 2025 VisionHub. All rights reserved.
         </p>
       </div>
    </footer>
  );
}
