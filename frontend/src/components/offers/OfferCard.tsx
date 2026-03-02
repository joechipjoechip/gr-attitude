'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { CategoryIcon, CATEGORY_COLORS } from '@/components/icons/CategoryIcon';
import {
  type IOffer,
  type OfferType,
  OFFER_TYPE_LABELS,
  CATEGORY_LABELS,
  MissionCategory,
} from '@/lib/types';

const OFFER_TYPE_COLORS: Record<OfferType, string> = {
  don: 'bg-blue-400 text-white',
  competence: 'bg-purple-400 text-white',
  materiel: 'bg-orange-400 text-white',
  service: 'bg-green-400 text-white',
  ecoute: 'bg-pink-400 text-white',
};

const CATEGORY_BG_COLORS: Record<string, string> = {
  demenagement: 'bg-indigo-400',
  bricolage: 'bg-orange-400',
  numerique: 'bg-cyan-400',
  administratif: 'bg-purple-400',
  garde_enfants: 'bg-pink-400',
  transport: 'bg-green-400',
  ecoute: 'bg-yellow-400',
  emploi: 'bg-blue-400',
  alimentation: 'bg-red-400',
  animaux: 'bg-teal-400',
  education: 'bg-violet-400',
  autre: 'bg-gray-400',
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "A l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Il y a ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 30) return `Il y a ${diffD}j`;
  return `Il y a ${Math.floor(diffD / 30)} mois`;
}

interface OfferCardProps {
  offer: IOffer;
}

export function OfferCard({ offer }: OfferCardProps) {
  const categoryBgColor = offer.category 
    ? CATEGORY_BG_COLORS[offer.category] ?? 'bg-gray-400'
    : 'bg-gray-400';

  return (
    <Link href={`/offers/${offer.id}`} className="block h-full">
      <div className="relative glass-card-stitch rounded-[3rem] p-8 pt-12 h-full cursor-pointer">
        {/* Floating category icon - top right */}
        {offer.category && (
          <div className={`absolute -top-6 -right-4 w-24 h-24 ${categoryBgColor} rounded-[2.5rem] flex items-center justify-center shadow-xl`}>
            <CategoryIcon category={offer.category as MissionCategory} size={40} className="text-white" />
          </div>
        )}

        {/* Offer type badge - top left */}
        <Badge className={`absolute -top-3 -left-3 ${OFFER_TYPE_COLORS[offer.offerType]} border-0 px-3 py-1 rounded-full shadow-lg font-semibold`}>
          {OFFER_TYPE_LABELS[offer.offerType]}
        </Badge>

        {/* Content */}
        <div className="space-y-4">
          <div>
            {offer.category && (
              <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: CATEGORY_COLORS[offer.category as MissionCategory] ?? '#6b7280' }}>
                {CATEGORY_LABELS[offer.category as MissionCategory]}
              </p>
            )}
            <h3 className="text-xl font-bold line-clamp-2 leading-tight">
              {offer.title}
            </h3>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {offer.description}
          </p>

          <div className="border-t border-white/60 pt-4 mt-auto">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold">
                  {offer.creator?.displayName?.charAt(0).toUpperCase() ?? 'U'}
                </div>
                <span className="font-medium">{offer.creator?.displayName}</span>
              </div>
              <span>{timeAgo(offer.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
