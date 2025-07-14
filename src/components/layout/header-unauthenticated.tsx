'use client';
import Link from 'next/link';
import { Bot, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/auth-context';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#contact', label: 'Contact' },
];

export default function HeaderUnauthenticated() {
  const { setAuthModalOpen } = useAuth();

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-headline text-xl font-bold">
            <Bot className="h-8 w-8 text-primary" />
            <span>VisionHub</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-primary">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" onClick={() => setAuthModalOpen(true)}>
              Login
            </Button>
            <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground" onClick={() => setAuthModalOpen(true)}>
              Join
            </Button>
          </div>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-6 p-6">
                  <Link href="/" className="flex items-center gap-2 font-headline text-lg font-bold">
                    <Bot className="h-7 w-7 text-primary" />
                    <span>VisionHub</span>
                  </Link>
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link key={link.href} href={link.href} className="text-lg transition-colors hover:text-primary">
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="flex flex-col gap-2 mt-4">
                     <Button variant="ghost" onClick={() => setAuthModalOpen(true)}>Login</Button>
                     <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground" onClick={() => setAuthModalOpen(true)}>Join</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
