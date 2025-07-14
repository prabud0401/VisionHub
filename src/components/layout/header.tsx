'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bot, LogOut, Menu, User, Settings, LayoutDashboard, Brush, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import HeaderUnauthenticated from './header-unauthenticated';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
  { href: '/gallery', label: 'Gallery', icon: <ImageIcon className="mr-2 h-4 w-4" /> },
  { href: '/background-remover', label: 'Background Remover', icon: <Brush className="mr-2 h-4 w-4" /> },
];

export default function Header() {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <header className="fixed top-0 left-0 z-50 w-full bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 text-xl font-bold">
            <Bot className="h-8 w-8 text-primary" />
            <span>VisionHub</span>
          </div>
        </div>
      </header>
    );
  }

  if (!user) {
    return <HeaderUnauthenticated />;
  }
  
  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold">
            <Bot className="h-8 w-8 text-primary" />
            <span className="hidden sm:inline">VisionHub AI</span>
          </Link>
          <nav className="hidden items-center gap-2 text-sm font-medium md:flex">
            {navLinks.map((link) => (
              <Button variant="ghost" asChild key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
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
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
                  <Link href="/dashboard" className="flex items-center gap-2 text-lg font-bold">
                    <Bot className="h-7 w-7 text-primary" />
                    <span>VisionHub AI</span>
                  </Link>
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                       <Button variant="ghost" className="justify-start" asChild key={link.href}>
                         <Link href={link.href}>{link.icon}{link.label}</Link>
                       </Button>
                    ))}
                     <Button variant="ghost" className="justify-start" asChild>
                         <Link href='/settings'><Settings className="mr-2 h-4 w-4" />Settings</Link>
                       </Button>
                  </nav>
                  <Button onClick={handleLogout} variant="outline" className="mt-4">
                    <LogOut className="mr-2 h-5 w-5" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
