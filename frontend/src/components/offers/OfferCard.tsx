'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScaleOnHover } from '@/components/ui/motion';
import { CategoryIcon } from '@/components/icons/CategoryIcon';
import {
  type IOffer,
  type OfferType,
  OFFER_TYPE_LABELS,
  CATEGORY_LABELS,
  MissionCategory,
} from '@/lib/types';

const OFFER_TYPE_COLORS: Record<OfferType, string> = {
  don: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  competence: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  materiel: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
  service: 'bg-green-100 text-green-800 hover:bg-green-100',
  ecoute: 'bg-pink-100 text-pink-800 hover:bg-pink-100',
};

const OFFER_TYPE_BORDER: Record<OfferType, string> = {
  don: '#3b82f6',
  competence: '#a855f7',
  materiel: '#f97316',
  service: '#22c55e',
  ecoute: '#ec4899',
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
  const borderColor = OFFER_TYPE_BORDER[offer.offerType];
  return (
    <ScaleOnHover className="h-full">
      <Link href={`/offers/${offer.id}`} className="block h-full">
        <Card
          className="h-full cursor-pointer overflow-hidden border-l-4"
          style={{ borderLeftColor: borderColor }}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge className={OFFER_TYPE_COLORS[offer.offerType]}>
                {OFFER_TYPE_LABELS[offer.offerType]}
              </Badge>
              {offer.category && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <CategoryIcon category={offer.category as MissionCategory} size={12} />
                  {CATEGORY_LABELS[offer.category as MissionCategory]}
                </Badge>
              )}
            </div>
            <CardTitle className="text-base line-clamp-2">
              {offer.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {offer.description}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{offer.creator?.displayName}</span>
              <span>{timeAgo(offer.createdAt)}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </ScaleOnHover>
  );
}
