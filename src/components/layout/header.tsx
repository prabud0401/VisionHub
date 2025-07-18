
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, LayoutDashboard, Gem, User, PlusCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useAuth } from '@/context/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const mainNavLinks = [
  { href: '/community', label: 'Community' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/faq', label: 'FAQ' },
];

const accountLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/gallery', label: 'My Gallery' },
  { href: '/settings', label: 'Settings' },
];

const aiToolsLinks = [
  { href: '/background-remover', label: 'Image Upgrade Suite' },
  { href: '/video-generation', label: 'Video Generation' },
];

const comingSoonLinks = [
  { href: '/image-to-image', label: 'Image-to-Image' },
  { href: '/inpainting', label: 'Inpainting Tool' },
];

export default function Header() {
  const { user, setAuthModalOpen, signOut } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const handleMobileNav = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  }

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <Link href="/">
             <Image src="/visionhub.png" alt="VisionHub Logo" width={180} height={45} className="w-[150px] md:w-[180px]" />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {mainNavLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-primary">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm font-medium border border-border/50 rounded-full px-3 py-1.5 bg-card/50">
                    <Gem className="mr-1 h-4 w-4 text-primary" />
                    <span>{user.credits ?? 0} Credits</span>
                     <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                        <Link href="/pricing"><PlusCircle /></Link>
                     </Button>
                </div>
                <Button asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 border-2 border-primary/50">
                        <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                        <AvatarFallback>{user.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">@{user.username}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      {accountLinks.map(link => (
                        <DropdownMenuItem key={link.href} onClick={() => router.push(link.href)}><User className="mr-2 h-4 w-4"/>{link.label}</DropdownMenuItem>
                      ))}
                      <DropdownMenuItem key={'/community'} onClick={() => router.push('/community')}><Users className="mr-2 h-4 w-4"/>Community</DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>AI Tools</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                {aiToolsLinks.map(link => (
                                    <DropdownMenuItem key={link.href} onClick={() => router.push(link.href)}>{link.label}</DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel className="text-xs text-muted-foreground">Coming Soon</DropdownMenuLabel>
                                {comingSoonLinks.map(link => (
                                    <DropdownMenuItem key={link.href} onClick={() => router.push(link.href)} disabled>{link.label}</DropdownMenuItem>
                                ))}
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button variant="accent" onClick={() => setAuthModalOpen(true)}>
                Get Started
              </Button>
            )}
          </div>
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-12 w-12">
                  <Menu className="h-8 w-8" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 flex flex-col">
                 <SheetTitle className="sr-only">Menu</SheetTitle>
                 <SheetDescription className="sr-only">Main navigation menu</SheetDescription>
                <div className="p-6 pb-0">
                  {user ? (
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-12 w-12 border-2 border-primary/50">
                            <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                            <AvatarFallback>{user.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{user.displayName}</p>
                            <p className="text-sm text-muted-foreground">@{user.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2 text-sm font-medium border border-border/50 rounded-full px-3 py-1.5 w-full mb-4 bg-card/50">
                          <div className="flex items-center gap-2">
                             <Gem className="mr-1 h-4 w-4 text-primary" />
                             <span>{user.credits ?? 0} Credits</span>
                          </div>
                         <Button variant="secondary" size="sm" asChild>
                            <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)}>Get More</Link>
                         </Button>
                      </div>
                    </div>
                  ) : (
                     <div className="flex flex-col gap-2 mt-4">
                        <Button variant="accent" onClick={() => { setAuthModalOpen(true); setIsMobileMenuOpen(false); }}>Get Started</Button>
                     </div>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto">
                    <Accordion type="multiple" className="w-full px-6">
                        {user && (
                            <AccordionItem value="account">
                                <AccordionTrigger>My Account</AccordionTrigger>
                                <AccordionContent>
                                    <nav className="flex flex-col gap-4 text-lg pt-2">
                                        {accountLinks.map(link => (
                                            <button key={link.href} onClick={() => handleMobileNav(link.href)} className="text-left transition-colors hover:text-primary">{link.label}</button>
                                        ))}
                                    </nav>
                                </AccordionContent>
                            </AccordionItem>
                        )}
                        <AccordionItem value="ai-tools">
                             <AccordionTrigger>AI Tools</AccordionTrigger>
                             <AccordionContent>
                                <nav className="flex flex-col gap-4 text-lg pt-2">
                                     {aiToolsLinks.map(link => (
                                        <button key={link.href} onClick={() => handleMobileNav(link.href)} className="text-left transition-colors hover:text-primary">{link.label}</button>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <p className="text-sm text-muted-foreground pt-2">Coming Soon</p>
                                    {comingSoonLinks.map(link => (
                                        <button key={link.href} onClick={() => handleMobileNav(link.href)} className="text-left transition-colors hover:text-primary text-muted-foreground" disabled>{link.label}</button>
                                    ))}
                                </nav>
                             </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="resources">
                             <AccordionTrigger>Resources</AccordionTrigger>
                             <AccordionContent>
                                <nav className="flex flex-col gap-4 text-lg pt-2">
                                    {mainNavLinks.map((link) => (
                                      <button key={link.href} onClick={() => handleMobileNav(link.href)} className="text-left transition-colors hover:text-primary">
                                        {link.label}
                                      </button>
                                    ))}
                                </nav>
                             </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
                 {user && (
                    <div className="p-6 mt-auto border-t">
                        <Button variant="ghost" className="w-full justify-start text-lg" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>Log Out</Button>
                    </div>
                 )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
