'use client';

import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AuthRequiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthRequiredModal({ open, onOpenChange }: AuthRequiredModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card sm:max-w-md">
        <DialogHeader className="text-center space-y-3">
          <div className="mx-auto text-5xl">🔐</div>
          <DialogTitle className="text-xl">
            <span className="font-display">Connectez-vous pour </span>
            <span className="font-elegant gradient-text-primary">continuer</span>
          </DialogTitle>
          <DialogDescription className="text-base">
            Créez un compte ou connectez-vous pour publier des missions et offres, contribuer, et rejoindre la communauté.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button
            asChild
            size="lg"
            className="gradient-primary text-white border-0 font-semibold shimmer"
          >
            <Link href="/register">Créer un compte</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/login">Se connecter</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
