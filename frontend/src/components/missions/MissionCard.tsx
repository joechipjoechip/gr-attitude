'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScaleOnHover } from '@/components/ui/motion';
import { CategoryIcon, CATEGORY_COLORS } from '@/components/icons/CategoryIcon';
import {
  type IMission,
  CATEGORY_LABELS,
  URGENCY_LABELS,
  type Urgency,
} from '@/lib/types';

const URGENCY_COLORS: Record<Urgency, string> = {
  faible: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
  moyen: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  urgent: 'bg-red-100 text-red-800 hover:bg-red-100',
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

interface MissionCardProps {
  mission: IMission;
}

export function MissionCard({ mission }: MissionCardProps) {
  const categoryColor = CATEGORY_COLORS[mission.category] ?? '#6b7280';

  return (
    <Link href={`/missions/${mission.id}`} className="h-full block">
      <ScaleOnHover className="h-full">
        <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow relative overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full w-1"
            aria-hidden="true"
            style={{
              background: `linear-gradient(180deg, ${categoryColor}, ${categoryColor}55)`,
            }}
          />
          <CardHeader className="pb-2 pl-5">
            <div className="flex items-center gap-2 mb-1">
              <CategoryIcon category={mission.category} size={18} />
              <Badge variant="outline">{CATEGORY_LABELS[mission.category]}</Badge>
              <Badge className={URGENCY_COLORS[mission.urgency]}>
                {URGENCY_LABELS[mission.urgency]}
              </Badge>
            </div>
            <CardTitle className="text-base line-clamp-2">
              {mission.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pl-5">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {mission.description}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{mission.creator?.displayName}</span>
              <span>{timeAgo(mission.createdAt)}</span>
            </div>
          </CardContent>
        </Card>
      </ScaleOnHover>
    </Link>
  );
}
