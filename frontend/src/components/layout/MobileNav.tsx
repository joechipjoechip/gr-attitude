'use client';

import { useState } from 'react';
import Link from 'next/link';
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

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

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
          <SheetTitle>GR attitude</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-3 mt-6">
          <Link href="/" onClick={close} className="text-sm font-medium py-2">
            Accueil
          </Link>
          <Link href="/missions" onClick={close} className="text-sm font-medium py-2">
            Missions
          </Link>
          <Link href="/offers" onClick={close} className="text-sm font-medium py-2">
            Offres
          </Link>
          <Link href="/faq" onClick={close} className="text-sm font-medium py-2">
            FAQ
          </Link>
          <Separator />
          {isAuthenticated ? (
            <>
              <div className="text-sm text-muted-foreground py-1">
                {user?.displayName}
              </div>
              <Link href="/profile" onClick={close} className="text-sm font-medium py-2">
                Profil
              </Link>
              <Button
                variant="ghost"
                className="justify-start px-0"
                onClick={() => {
                  logout();
                  close();
                }}
              >
                Deconnexion
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={close} className="text-sm font-medium py-2">
                Connexion
              </Link>
              <Link href="/register" onClick={close} className="text-sm font-medium py-2">
                Inscription
              </Link>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
