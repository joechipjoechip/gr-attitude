import Link from 'next/link';

export function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(to bottom, oklch(0.98 0.01 25), white)' }} className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div>
            <p className="font-bold font-display gradient-text-primary text-lg mb-2">GR attitude</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Une plateforme d'entraide structurée qui transforme les besoins en actions concrètes.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2">Explorer</p>
            <ul className="space-y-1">
              <li><Link href="/missions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Missions</Link></li>
              <li><Link href="/offers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Offres</Link></li>
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2">Compte</p>
            <ul className="space-y-1">
              <li><Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Connexion</Link></li>
              <li><Link href="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Inscription</Link></li>
              <li><Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Profil</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} GR attitude — fait avec ❤️ pour l'entraide mutuelle.
        </div>
      </div>
    </footer>
  );
}
