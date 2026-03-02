'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OfferCard } from '@/components/offers/OfferCard';
import { useOffers } from '@/hooks/useOffers';
import { StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { type IOfferFilters } from '@/lib/api';
import {
  MissionCategory,
  OfferType,
  CATEGORY_LABELS,
  OFFER_TYPE_LABELS,
} from '@/lib/types';
import { t } from '@/i18n';
import { FilterChip } from '@/components/ui/filter-chip';

const ALL_VALUE = '__all__';

const OFFER_TYPE_CHIP_COLORS: Record<OfferType, string> = {
  [OfferType.DON]: 'bg-blue-100/80 text-blue-700 border-blue-200/80 hover:bg-blue-200/80',
  [OfferType.COMPETENCE]: 'bg-purple-100/80 text-purple-700 border-purple-200/80 hover:bg-purple-200/80',
  [OfferType.MATERIEL]: 'bg-orange-100/80 text-orange-700 border-orange-200/80 hover:bg-orange-200/80',
  [OfferType.SERVICE]: 'bg-emerald-100/80 text-emerald-700 border-emerald-200/80 hover:bg-emerald-200/80',
  [OfferType.ECOUTE]: 'bg-pink-100/80 text-pink-700 border-pink-200/80 hover:bg-pink-200/80',
};

const OFFER_TYPE_ACTIVE: Record<OfferType, string> = {
  [OfferType.DON]: 'bg-blue-500 text-white border-blue-500',
  [OfferType.COMPETENCE]: 'bg-purple-500 text-white border-purple-500',
  [OfferType.MATERIEL]: 'bg-orange-500 text-white border-orange-500',
  [OfferType.SERVICE]: 'bg-emerald-500 text-white border-emerald-500',
  [OfferType.ECOUTE]: 'bg-pink-500 text-white border-pink-500',
};

export default function OffersPage() {
  const [filters, setFilters] = useState<IOfferFilters>({ page: 1, limit: 12 });
  const { data, isLoading } = useOffers(filters);

  const updateFilter = (key: keyof IOfferFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === ALL_VALUE ? undefined : value,
      page: 1,
    }));
  };

  const toggleFilter = (key: keyof IOfferFilters, value: string) => {
    const current = filters[key] as string | undefined;
    updateFilter(key, current === value ? ALL_VALUE : value);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Hero Section */}
      <div className="relative mb-12 overflow-hidden">
        {/* Background blobs */}
        <div
          className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-300/30 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-16 -left-16 w-64 h-64 bg-cyan-300/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Hero content */}
        <div className="relative glass-hero rounded-[3.5rem] p-12 text-center">
          <h1 className="text-6xl font-black tracking-tight mb-4">
            Propositions <span className="gradient-text-primary italic float-animation inline-block">d'aide</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Découvrez les talents et ressources partagés par notre communauté
          </p>
          <Button asChild className="h-12 px-8 rounded-2xl bg-purple-600 text-white hover:bg-purple-700 border-0 text-base font-semibold">
            <Link href="/offers/new">
              <Plus className="mr-2 h-5 w-5" />
              Proposer mon aide
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Layout: Sidebar + Grid */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="lg:w-72 shrink-0">
          <div className="glass-sidebar rounded-[2rem] p-6 sticky top-24 space-y-6">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-foreground mb-3 block flex items-center gap-2">
                🔍 Recherche
              </label>
              <Input
                placeholder="Rechercher..."
                value={filters.search || ''}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="bg-white/60"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-widest text-foreground mb-3 block flex items-center gap-2">
                💼 {t('propositions.typeLabel')}
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.values(OfferType).map((ot) => (
                  <FilterChip
                    key={ot}
                    label={OFFER_TYPE_LABELS[ot]}
                    active={filters.offerType === ot}
                    inactiveClass={OFFER_TYPE_CHIP_COLORS[ot]}
                    activeClass={OFFER_TYPE_ACTIVE[ot]}
                    onClick={() => toggleFilter('offerType', ot)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-widest text-foreground mb-3 block flex items-center gap-2">
                📂 Catégorie
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.values(MissionCategory).map((cat) => (
                  <FilterChip
                    key={cat}
                    label={CATEGORY_LABELS[cat]}
                    active={filters.category === cat}
                    inactiveClass="bg-slate-100/80 text-slate-600 border-slate-200/80 hover:bg-slate-200/80"
                    activeClass="bg-slate-700 text-white border-slate-700"
                    onClick={() => toggleFilter('category', cat)}
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Offer grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="text-center py-16 text-muted-foreground">
              <div className="text-4xl mb-3">⏳</div>
              <p>{t('propositions.loading')}</p>
            </div>
          ) : data?.data && data.data.length > 0 ? (
            <>
              <StaggerContainer className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {data.data.map((offer) => (
                  <StaggerItem key={offer.id}>
                    <OfferCard offer={offer} />
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-10">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    disabled={data.page <= 1}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))
                    }
                  >
                    Précédent
                  </Button>
                  <span className="text-sm text-muted-foreground px-3">
                    Page {data.page} sur {data.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    disabled={data.page >= data.totalPages}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))
                    }
                  >
                    Suivant
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 glass-hero rounded-[3rem] px-6">
              <div className="text-6xl mb-4">🤝</div>
              <h3 className="text-lg font-semibold mb-2">{t('propositions.none')}</h3>
              <p className="text-muted-foreground mb-6">
                Soyez le premier à proposer votre aide à la communauté.
              </p>
              <Button asChild className="rounded-xl bg-purple-600 text-white hover:bg-purple-700 border-0">
                <Link href="/offers/new">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('propositions.create')}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
