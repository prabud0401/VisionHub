'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, LayoutDashboard, Gem, User, PlusCircle, Users, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useAuth } from '@/context/auth-context';
import { useAppStore } from '@/stores/app-store';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, memo, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const mainNavLinks = [
  { href: '/community', label: 'Community' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/faq', label: 'FAQ' },
] as const;

const accountLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/gallery', label: 'My Gallery', icon: User },
  { href: '/settings', label: 'Settings', icon: User },
] as const;

const aiToolsLinks = [
  { href: '/background-remover', label: 'Image Upgrade Suite' },
  { href: '/video-generation', label: 'Video Generation' },
] as const;

const comingSoonLinks = [
  { href: '/inpainting', label: 'Inpainting Tool' },
] as const;

// Memoized logo component to prevent unnecessary re-renders
const Logo = memo(() => (
  <Link href="/" className="flex-shrink-0">
    <Image 
      src="/visionhub.png" 
      alt="VisionHub Logo" 
      width={180} 
      height={45} 
      className="w-[150px] md:w-[180px] header-logo-glow"
      priority
      sizes="(max-width: 768px) 150px, 180px"
      quality={90}
    />
  </Link>
));

Logo.displayName = 'Logo';

// Memoized navigation component
const MainNavigation = memo(({ isScrolled }: { isScrolled: boolean }) => (
  <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
    {mainNavLinks.map((link) => (
      <Link 
        key={link.href} 
        href={link.href} 
        className={`transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent rounded-sm px-2 py-1 backdrop-blur-sm header-element ${
          isScrolled 
            ? 'text-foreground hover:text-primary focus:ring-primary' 
            : 'text-white/90 hover:text-white focus:ring-white/50 hover:bg-white/10 header-text-shadow'
        }`}
        prefetch={false}
      >
        {link.label}
      </Link>
    ))}
  </nav>
));

MainNavigation.displayName = 'MainNavigation';

// Memoized credits display
const CreditsDisplay = memo(({ credits, isScrolled }: { credits: number; isScrolled: boolean }) => (
  <div className={`flex items-center gap-2 text-sm font-medium rounded-full px-3 py-1.5 backdrop-blur-md transition-colors ${
    isScrolled 
      ? 'border border-border bg-card text-foreground' 
      : 'border border-white/20 bg-black/20 text-white'
  }`}>
    <Gem className={`mr-1 h-4 w-4 ${isScrolled ? 'text-primary' : 'text-yellow-400'}`} />
    <span className="font-medium">{credits} Credits</span>
    <Button 
      variant="ghost" 
      size="icon" 
      className={`h-6 w-6 ${isScrolled ? 'hover:bg-muted text-foreground' : 'hover:bg-white/20 text-white'}`} 
      asChild
    >
      <Link href="/pricing" aria-label="Buy more credits">
        <PlusCircle className="h-4 w-4" />
      </Link>
    </Button>
  </div>
));

CreditsDisplay.displayName = 'CreditsDisplay';

// User dropdown menu component
const UserDropdown = memo(({ user, onLogout }: { user: any; onLogout: () => void }) => {
  const router = useRouter();

  const handleNavigation = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full focus:ring-2 focus:ring-primary focus:ring-offset-2">
          <Avatar className="h-10 w-10 border-2 border-primary/50">
            <AvatarImage 
              src={user?.photoURL || ''} 
              alt={user?.displayName || 'User'} 
              loading="lazy"
            />
            <AvatarFallback>
              {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.displayName || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              @{user?.username || 'username'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {accountLinks.map((link) => {
            const Icon = link.icon;
            return (
              <DropdownMenuItem 
                key={link.href} 
                onClick={() => handleNavigation(link.href)}
                className="cursor-pointer"
              >
                <Icon className="mr-2 h-4 w-4" />
                {link.label}
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuItem 
            onClick={() => handleNavigation('/community')}
            className="cursor-pointer"
          >
            <Users className="mr-2 h-4 w-4" />
            Community
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>AI Tools</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {aiToolsLinks.map((link) => (
                <DropdownMenuItem 
                  key={link.href} 
                  onClick={() => handleNavigation(link.href)}
                  className="cursor-pointer"
                >
                  {link.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Coming Soon
              </DropdownMenuLabel>
              {comingSoonLinks.map((link) => (
                <DropdownMenuItem 
                  key={link.href} 
                  disabled
                  className="cursor-not-allowed opacity-50"
                >
                  {link.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

UserDropdown.displayName = 'UserDropdown';

// Mobile menu component
const MobileMenu = memo(({ 
  isOpen, 
  onOpenChange, 
  user, 
  onLogout, 
  onAuthModalOpen 
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  onLogout: () => void;
  onAuthModalOpen: () => void;
}) => {
  const router = useRouter();

  const handleMobileNav = useCallback((path: string) => {
    router.push(path);
    onOpenChange(false);
  }, [router, onOpenChange]);

  const handleAuthClick = useCallback(() => {
    onAuthModalOpen();
    onOpenChange(false);
  }, [onAuthModalOpen, onOpenChange]);

  const handleLogoutClick = useCallback(() => {
    onLogout();
    onOpenChange(false);
  }, [onLogout, onOpenChange]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-12 w-12 md:hidden focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Open navigation menu"
        >
          <Menu className="h-8 w-8" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="p-0 flex flex-col">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">
          Main navigation menu for VisionHub
        </SheetDescription>
        
        {/* User Profile Section */}
        <div className="p-6 pb-0 border-b">
          {user ? (
            <>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12 border-2 border-primary/50">
                  <AvatarImage 
                    src={user.photoURL || ''} 
                    alt={user.displayName || 'User'} 
                    loading="lazy"
                  />
                  <AvatarFallback>
                    {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{user.displayName || 'User'}</p>
                  <p className="text-sm text-muted-foreground">
                    @{user.username || 'username'}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 text-sm font-medium border border-border/50 rounded-full px-3 py-1.5 w-full mb-4 bg-card/50">
                <div className="flex items-center gap-2">
                  <Gem className="mr-1 h-4 w-4 text-primary" />
                  <span>{user.credits ?? 0} Credits</span>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => handleMobileNav('/pricing')}
                >
                  Get More
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2 mt-4">
              <Button variant="accent" onClick={handleAuthClick}>
                Get Started
              </Button>
            </div>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {user && (
            <div>
              <h3 className="font-semibold mb-3">My Account</h3>
              <nav className="flex flex-col gap-3">
                {accountLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.href}
                      onClick={() => handleMobileNav(link.href)}
                      className="flex items-center gap-3 text-left text-lg transition-colors hover:text-primary focus:text-primary focus:outline-none"
                    >
                      <Icon className="h-5 w-5" />
                      {link.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-3">AI Tools</h3>
            <nav className="flex flex-col gap-3">
              {aiToolsLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleMobileNav(link.href)}
                  className="text-left text-lg transition-colors hover:text-primary focus:text-primary focus:outline-none"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-2">Coming Soon</p>
                {comingSoonLinks.map((link) => (
                  <button
                    key={link.href}
                    disabled
                    className="text-left text-lg text-muted-foreground opacity-50 cursor-not-allowed block"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </nav>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Resources</h3>
            <nav className="flex flex-col gap-3">
              {mainNavLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleMobileNav(link.href)}
                  className="text-left text-lg transition-colors hover:text-primary focus:text-primary focus:outline-none"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Logout Section */}
        {user && (
          <div className="p-6 mt-auto border-t">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-lg text-destructive hover:text-destructive hover:bg-destructive/10" 
              onClick={handleLogoutClick}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Log Out
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
});

MobileMenu.displayName = 'MobileMenu';

// Loading skeleton for header
const HeaderSkeleton = memo(() => (
  <header className="fixed top-0 left-0 w-full z-50 bg-transparent">
    <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
      <Skeleton className="w-[150px] md:w-[180px] h-[45px] bg-white/20" />
      <div className="hidden md:flex items-center gap-6">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-16 h-4 bg-white/20" />
        ))}
      </div>
      <div className="hidden md:flex items-center gap-2">
        <Skeleton className="w-32 h-9 bg-white/20" />
        <Skeleton className="w-24 h-9 bg-white/20" />
        <Skeleton className="w-10 h-10 rounded-full bg-white/20" />
      </div>
      <Skeleton className="w-12 h-12 md:hidden bg-white/20" />
    </div>
  </header>
));

HeaderSkeleton.displayName = 'HeaderSkeleton';

// Main Header Component
export default function ImprovedHeader() {
  const { user, setAuthModalOpen, signOut } = useAuth();
  const { ui, setMobileMenuOpen } = useAppStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const lastScrollY = useRef(0);

  // Handle hydration issues
  useEffect(() => {
    setIsClient(true);
    // Add a small delay to ensure proper hydration
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroHeight = window.innerHeight; // Assume hero is full viewport height
      
      // Determine if we've scrolled past the hero
      const hasScrolledPastHero = currentScrollY > heroHeight * 0.8; // 80% of hero height
      setIsScrolled(hasScrolledPastHero);
      
      if (hasScrolledPastHero) {
        // Show/hide based on scroll direction
        if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
          // Scrolling down - hide header
          setIsVisible(false);
        } else {
          // Scrolling up - show header
          setIsVisible(true);
        }
      } else {
        // Always show header when in hero section
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    // Throttle scroll events for performance
    let throttleTimer: NodeJS.Timeout | null = null;
    const throttledHandleScroll = () => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        handleScroll();
        throttleTimer = null;
      }, 16); // ~60fps
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [signOut, router]);

  const handleAuthModalOpen = useCallback(() => {
    setAuthModalOpen(true);
  }, [setAuthModalOpen]);

  // Show skeleton during SSR and initial hydration
  if (!isClient || !isHydrated) {
    return <HeaderSkeleton />;
  }

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          isScrolled 
            ? 'bg-background/95 backdrop-blur-md border-b border-border/50 shadow-lg' 
            : 'bg-transparent hero-header'
        }`}
      >
                  <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
            <Logo />
            <MainNavigation isScrolled={isScrolled} />
          
          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                <CreditsDisplay credits={user.credits ?? 0} isScrolled={isScrolled} />
                <Button asChild className={`backdrop-blur-sm transition-colors ${
                  isScrolled 
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                    : 'bg-primary/90 hover:bg-primary text-primary-foreground'
                }`}>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <UserDropdown user={user} onLogout={handleLogout} />
              </>
            ) : (
              <Button 
                variant="accent" 
                onClick={handleAuthModalOpen}
                className={`backdrop-blur-sm transition-colors ${
                  isScrolled 
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground border border-primary/20' 
                    : 'bg-primary/90 hover:bg-primary text-primary-foreground border border-primary/20'
                }`}
              >
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-12 w-12 focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent transition-colors ${
                isScrolled 
                  ? 'text-foreground hover:bg-muted focus:ring-primary' 
                  : 'text-white hover:bg-white/20 focus:ring-white/50'
              }`}
              aria-label="Open navigation menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-8 w-8" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </div>
          
          <MobileMenu
            isOpen={ui.isMobileMenuOpen}
            onOpenChange={setMobileMenuOpen}
            user={user}
            onLogout={handleLogout}
            onAuthModalOpen={handleAuthModalOpen}
          />
        </div>
      </header>
      
      {/* No spacer needed for fixed transparent header */}
    </>
  );
} 