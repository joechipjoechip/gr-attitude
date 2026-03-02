'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/missions', label: 'Missions' },
  { href: '/offers', label: 'Offres' },
  { href: '/faq', label: 'FAQ' },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle className="font-display gradient-text-primary text-left">GR attitude</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 mt-6">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={close}
                className={`text-sm font-medium py-2.5 px-3 rounded-lg transition-all ${
                  isActive
                    ? 'gradient-primary text-white'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {label}
              </Link>
            );
          })}
          <Separator className="my-2" />
          {isAuthenticated ? (
            <>
              <div className="text-xs text-muted-foreground px-3 py-1">
                {user?.displayName}
              </div>
              <Link
                href="/profile"
                onClick={close}
                className={`text-sm font-medium py-2.5 px-3 rounded-lg transition-all ${
                  pathname === '/profile'
                    ? 'gradient-primary text-white'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                Profil
              </Link>
              <Button
                variant="ghost"
                className="justify-start px-3 text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => {
                  logout();
                  close();
                }}
              >
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={close}
                className="text-sm font-medium py-2.5 px-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                onClick={close}
                className="text-sm font-medium py-2.5 px-3 rounded-lg gradient-primary text-white mt-1 transition-all"
              >
                Inscription
              </Link>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
