import Link from 'next/link';
import { t } from '@/i18n';

export function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(to bottom, oklch(0.98 0.01 25), white)' }} className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div>
            <p className="font-bold font-display gradient-text-primary text-lg mb-2">{t('common.appName')}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('home.footerDesc')}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2">{t('common.explore')}</p>
            <ul className="space-y-1">
              <li><Link href="/missions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('nav.besoins')}</Link></li>
              <li><Link href="/offers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('nav.propositions')}</Link></li>
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('nav.faq')}</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2">{t('common.account')}</p>
            <ul className="space-y-1">
              <li><Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('nav.login')}</Link></li>
              <li><Link href="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('nav.register')}</Link></li>
              <li><Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('nav.profile')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {t('common.appName')} — {t('common.tagline')}
        </div>
      </div>
    </footer>
  );
}
