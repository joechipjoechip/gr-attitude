'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MissionCard } from '@/components/missions/MissionCard';
import { useMissions } from '@/hooks/useMissions';
import { StaggerContainer, StaggerItem } from '@/components/ui/motion';
import {
  MissionCategory,
  HelpType,
  Urgency,
  CATEGORY_LABELS,
  HELP_TYPE_LABELS,
  URGENCY_LABELS,
  type IMissionFilters,
} from '@/lib/types';

const ALL_VALUE = '__all__';

const HELP_TYPE_CHIP_COLORS: Record<HelpType, string> = {
  [HelpType.FINANCIERE]: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200',
  [HelpType.CONSEIL]: 'bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-200',
  [HelpType.MATERIEL]: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200',
  [HelpType.RELATION]: 'bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200',
};

const HELP_TYPE_ACTIVE: Record<HelpType, string> = {
  [HelpType.FINANCIERE]: 'bg-emerald-500 text-white border-emerald-500',
  [HelpType.CONSEIL]: 'bg-violet-500 text-white border-violet-500',
  [HelpType.MATERIEL]: 'bg-amber-500 text-white border-amber-500',
  [HelpType.RELATION]: 'bg-pink-500 text-white border-pink-500',
};

const URGENCY_CHIP_COLORS: Record<Urgency, string> = {
  [Urgency.FAIBLE]: 'bg-sky-100 text-sky-700 border-sky-200 hover:bg-sky-200',
  [Urgency.MOYEN]: 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200',
  [Urgency.URGENT]: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200',
};

const URGENCY_ACTIVE: Record<Urgency, string> = {
  [Urgency.FAIBLE]: 'bg-sky-500 text-white border-sky-500',
  [Urgency.MOYEN]: 'bg-orange-500 text-white border-orange-500',
  [Urgency.URGENT]: 'bg-red-500 text-white border-red-500',
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

export default function MissionsPage() {
  const [filters, setFilters] = useState<IMissionFilters>({ page: 1, limit: 12 });
  const { data, isLoading } = useMissions(filters);

  const updateFilter = (key: keyof IMissionFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === ALL_VALUE ? undefined : value,
      page: 1,
    }));
  };

  const toggleFilter = (key: keyof IMissionFilters, value: string) => {
    const current = filters[key] as string | undefined;
    updateFilter(key, current === value ? ALL_VALUE : value);
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold font-display gradient-text-primary">Missions</h1>
        <Button asChild className="w-full sm:w-auto h-11 sm:h-10 gradient-primary text-white border-0 hover:opacity-90">
          <Link href="/missions/new">
            <Plus className="mr-2 h-4 w-4" />
            <span className="sm:inline">Créer une Mission</span>
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
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Type d'aide</p>
          <div className="flex flex-wrap gap-2">
            {Object.values(HelpType).map((ht) => (
              <FilterChip
                key={ht}
                label={HELP_TYPE_LABELS[ht]}
                active={filters.helpType === ht}
                inactiveClass={HELP_TYPE_CHIP_COLORS[ht]}
                activeClass={HELP_TYPE_ACTIVE[ht]}
                onClick={() => toggleFilter('helpType', ht)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Urgence</p>
          <div className="flex flex-wrap gap-2">
            {Object.values(Urgency).map((u) => (
              <FilterChip
                key={u}
                label={URGENCY_LABELS[u]}
                active={filters.urgency === u}
                inactiveClass={URGENCY_CHIP_COLORS[u]}
                activeClass={URGENCY_ACTIVE[u]}
                onClick={() => toggleFilter('urgency', u)}
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

      {/* Mission grid */}
      {isLoading ? (
        <div className="text-center py-16 text-muted-foreground">
          <div className="text-4xl mb-3">⏳</div>
          <p>Chargement des missions...</p>
        </div>
      ) : data?.data && data.data.length > 0 ? (
        <>
          <StaggerContainer className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {data.data.map((mission) => (
              <StaggerItem key={mission.id}>
                <MissionCard mission={mission} />
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
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-lg font-semibold mb-2">Aucune mission trouvée</h3>
          <p className="text-muted-foreground mb-6">
            Soyez le premier à publier une mission et démarrer l'entraide.
          </p>
          <Button asChild className="gradient-primary text-white border-0 hover:opacity-90">
            <Link href="/missions/new">
              <Plus className="mr-2 h-4 w-4" />
              Créer la première mission
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
