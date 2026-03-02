'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MobileNav } from './MobileNav';
import { NotificationBell } from './NotificationBell';

const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/missions', label: 'Missions' },
  { href: '/offers', label: 'Offres' },
  { href: '/faq', label: 'FAQ' },
];

function NavLink({ href, label, pathname }: { href: string; label: string; pathname: string }) {
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
  return (
    <Link href={href} className="relative flex flex-col items-center gap-0.5 pb-0.5">
      <span
        className={`text-sm font-medium transition-colors ${
          isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {label}
      </span>
      {isActive && (
        <motion.span
          layoutId="nav-underline"
          className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full gradient-primary"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </Link>
  );
}

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold font-display gradient-text-primary">
            GR attitude
          </Link>
          <nav className="hidden items-center gap-5 md:flex">
            {NAV_LINKS.map(({ href, label }) => (
              <NavLink key={href} href={href} label={label} pathname={pathname} />
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <>
              <NotificationBell />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user?.displayName?.charAt(0).toUpperCase() ?? 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="outline" asChild className="h-9">
                <Link href="/login">Connexion</Link>
              </Button>
              <Button asChild className="h-9 gradient-primary text-white border-0 hover:opacity-90">
                <Link href="/register">Inscription</Link>
              </Button>
            </>
          )}
        </div>

        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
