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

const ALL_VALUE = '__all__';

const OFFER_TYPE_CHIP_COLORS: Record<OfferType, string> = {
  [OfferType.DON]: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200',
  [OfferType.COMPETENCE]: 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200',
  [OfferType.MATERIEL]: 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200',
  [OfferType.SERVICE]: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200',
  [OfferType.ECOUTE]: 'bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200',
};

const OFFER_TYPE_ACTIVE: Record<OfferType, string> = {
  [OfferType.DON]: 'bg-blue-500 text-white border-blue-500',
  [OfferType.COMPETENCE]: 'bg-purple-500 text-white border-purple-500',
  [OfferType.MATERIEL]: 'bg-orange-500 text-white border-orange-500',
  [OfferType.SERVICE]: 'bg-emerald-500 text-white border-emerald-500',
  [OfferType.ECOUTE]: 'bg-pink-500 text-white border-pink-500',
};

interface FilterChipProps {
  label: string;
  active: boolean;
  inactiveClass: string;
  activeClass: string;
  onClick: () => void;
}

function FilterChip({ label, active, inactiveClass, activeClass, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
        active ? activeClass : inactiveClass
      }`}
    >
      {label}
    </button>
  );
}

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
    <div className="container mx-auto max-w-6xl px-4 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold font-display gradient-text-primary">Offres</h1>
        <Button asChild className="w-full sm:w-auto h-11 sm:h-10 gradient-primary text-white border-0 hover:opacity-90">
          <Link href="/offers/new">
            <Plus className="mr-2 h-4 w-4" />
            Proposer une Offre
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-6 sm:mb-8">
        <Input
          placeholder="Rechercher..."
          value={filters.search || ''}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="max-w-sm"
        />

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Type d'offre</p>
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

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Catégorie</p>
          <div className="flex flex-wrap gap-2">
            {Object.values(MissionCategory).map((cat) => (
              <FilterChip
                key={cat}
                label={CATEGORY_LABELS[cat]}
                active={filters.category === cat}
                inactiveClass="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                activeClass="bg-slate-700 text-white border-slate-700"
                onClick={() => toggleFilter('category', cat)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Offer grid */}
      {isLoading ? (
        <div className="text-center py-16 text-muted-foreground">
          <div className="text-4xl mb-3">⏳</div>
          <p>Chargement des offres...</p>
        </div>
      ) : data?.data && data.data.length > 0 ? (
        <>
          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.data.map((offer) => (
              <StaggerItem key={offer.id}>
                <OfferCard offer={offer} />
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={data.page <= 1}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))
                }
              >
                Précédent
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {data.page} sur {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
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
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🤝</div>
          <h3 className="text-lg font-semibold mb-2">Aucune offre trouvée</h3>
          <p className="text-muted-foreground mb-6">
            Soyez le premier à proposer votre aide à la communauté.
          </p>
          <Button asChild className="gradient-primary text-white border-0 hover:opacity-90">
            <Link href="/offers/new">
              <Plus className="mr-2 h-4 w-4" />
              Proposer la première offre
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
