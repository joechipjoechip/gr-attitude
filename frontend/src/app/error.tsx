'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <AlertTriangle className="mx-auto h-16 w-16 text-destructive" />
        <h1 className="text-3xl font-bold">Erreur serveur</h1>
        <p className="text-muted-foreground">
          {error.message || "Une erreur inattendue s'est produite."}
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground">
            Référence: {error.digest}
          </p>
        )}
        <div className="flex gap-4 justify-center pt-4">
          <Button onClick={reset} variant="outline">
            Réessayer
          </Button>
          <Button onClick={() => (window.location.href = '/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
}
