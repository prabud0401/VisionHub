
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, LayoutDashboard, Gem } from 'lucide-react';
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
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/faq', label: 'FAQ' },
];

export default function Header() {
  const { user, setAuthModalOpen, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <Link href="/">
             <Image src="/visionhub.png" alt="VisionHub Logo" width={180} height={45} className="w-[150px] md:w-[180px]" />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-primary">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-4 md:flex">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm font-medium border border-border/50 rounded-full px-3 py-1.5">
                    <Gem className="mr-2 h-4 w-4 text-primary" />
                    <span>{user.credits ?? 0} Credits</span>
                </div>
                <Button variant="outline" asChild>
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
                       <DropdownMenuItem onClick={() => router.push('/dashboard')}>Dashboard</DropdownMenuItem>
                       <DropdownMenuItem onClick={() => router.push('/gallery')}>Gallery</DropdownMenuItem>
                       <DropdownMenuItem onClick={() => router.push('/background-remover')}>Image Upgrade</DropdownMenuItem>
                       <DropdownMenuItem onClick={() => router.push('/settings')}>Settings</DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                     <DropdownMenuGroup>
                       <DropdownMenuLabel className="text-xs text-muted-foreground">Coming Soon</DropdownMenuLabel>
                       <DropdownMenuItem onClick={() => router.push('/image-to-image')}>Image-to-Image</DropdownMenuItem>
                       <DropdownMenuItem onClick={() => router.push('/inpainting')}>Inpainting</DropdownMenuItem>
                       <DropdownMenuItem onClick={() => router.push('/community')}>Community</DropdownMenuItem>
                       <DropdownMenuItem onClick={() => router.push('/video-generation')}>Video Generation</DropdownMenuItem>
                    </DropdownMenuGroup>
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
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-12 w-12">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                 <SheetTitle className="sr-only">Menu</SheetTitle>
                 <SheetDescription className="sr-only">Main navigation menu</SheetDescription>
                <div className="flex h-full flex-col gap-6 p-6 overflow-y-auto">
                  {user ? (
                    <div className="border-b pb-6">
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
                      <div className="flex items-center gap-2 text-sm font-medium border border-border/50 rounded-full px-3 py-1.5 w-fit mb-4">
                          <Gem className="mr-2 h-4 w-4 text-primary" />
                          <span>{user.credits ?? 0} Credits</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button asChild variant="outline" className="justify-start">
                          <Link href="/dashboard">Dashboard</Link>
                        </Button>
                        <Button asChild variant="ghost" className="justify-start">
                          <Link href="/settings">Settings</Link>
                        </Button>
                         <Button variant="ghost" className="justify-start" onClick={handleLogout}>Log Out</Button>
                      </div>
                    </div>
                  ) : (
                     <div className="flex flex-col gap-2 mt-4">
                        <Button variant="accent" onClick={() => setAuthModalOpen(true)}>Get Started</Button>
                     </div>
                  )}

                  <nav className="flex flex-col gap-4 text-lg">
                    {user && (
                      <>
                        <Link href="/gallery" className="transition-colors hover:text-primary">Gallery</Link>
                        <Link href="/background-remover" className="transition-colors hover:text-primary">Image Upgrade</Link>
                         <DropdownMenuSeparator />
                      </>
                    )}
                    {navLinks.map((link) => (
                      <Link key={link.href} href={link.href} className="transition-colors hover:text-primary">
                        {link.label}
                      </Link>
                    ))}
                    {user && (
                      <>
                        <DropdownMenuSeparator />
                        <p className="text-sm text-muted-foreground">Coming Soon</p>
                        <Link href="/image-to-image" className="transition-colors hover:text-primary">Image-to-Image</Link>
                        <Link href="/inpainting" className="transition-colors hover:text-primary">Inpainting</Link>
                        <Link href="/community" className="transition-colors hover:text-primary">Community</Link>
                        <Link href="/video-generation" className="transition-colors hover:text-primary">Video Generation</Link>
                      </>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
