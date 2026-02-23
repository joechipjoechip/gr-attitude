'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useUserStats } from '@/hooks/useUserStats';
import { useMissions } from '@/hooks/useMissions';
import { useOffers } from '@/hooks/useOffers';
import {
  CATEGORY_LABELS,
  URGENCY_LABELS,
  OFFER_TYPE_LABELS,
  type Urgency,
  type OfferType,
  MissionStatus,
} from '@/lib/types';

const URGENCY_COLORS: Record<Urgency, string> = {
  faible: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
  moyen: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  urgent: 'bg-red-100 text-red-800 hover:bg-red-100',
};

const OFFER_TYPE_COLORS: Record<OfferType, string> = {
  don: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  competence: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  materiel: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
  service: 'bg-green-100 text-green-800 hover:bg-green-100',
  ecoute: 'bg-pink-100 text-pink-800 hover:bg-pink-100',
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

const STAT_CARDS = [
  { key: 'missionsCreated', label: 'Missions creees' },
  { key: 'missionsResolved', label: 'Missions resolues' },
  { key: 'contributionsGiven', label: 'Contributions donnees' },
  { key: 'offersCreated', label: 'Offres creees' },
] as const;

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: stats } = useUserStats();
  const { data: missionsData } = useMissions({ limit: 50 });
  const { data: offersData } = useOffers({ limit: 50 });
  const [tab, setTab] = useState('missions');

  if (!user) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8 text-center text-muted-foreground">
        Connectez-vous pour voir votre profil.
      </div>
    );
  }

  const myMissions = missionsData?.data?.filter((m) => m.creatorId === user.id) ?? [];
  const myOffers = offersData?.data?.filter((o) => o.creatorId === user.id) ?? [];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-8">
      {/* User info */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-xl">
            {user.displayName?.charAt(0).toUpperCase() ?? 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user.displayName}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <Separator />

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((stat) => (
          <Card key={stat.key}>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">
                {stats ? stats[stat.key] : '-'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="missions">Mes Missions</TabsTrigger>
          <TabsTrigger value="offers">Mes Offres</TabsTrigger>
        </TabsList>

        <TabsContent value="missions" className="mt-6">
          {myMissions.length > 0 ? (
            <div className="space-y-3">
              {myMissions.map((mission) => (
                <Link key={mission.id} href={`/missions/${mission.id}`}>
                  <Card className="transition-shadow hover:shadow-md cursor-pointer">
                    <CardHeader className="py-3 px-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <Badge variant="outline" className="flex-shrink-0">
                            {CATEGORY_LABELS[mission.category]}
                          </Badge>
                          <Badge className={`flex-shrink-0 ${URGENCY_COLORS[mission.urgency]}`}>
                            {URGENCY_LABELS[mission.urgency]}
                          </Badge>
                          <span className="text-sm font-medium truncate">
                            {mission.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant={mission.status === MissionStatus.RESOLUE ? 'default' : 'secondary'}>
                            {mission.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {timeAgo(mission.createdAt)}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              Vous n&apos;avez pas encore cree de mission.
            </p>
          )}
        </TabsContent>

        <TabsContent value="offers" className="mt-6">
          {myOffers.length > 0 ? (
            <div className="space-y-3">
              {myOffers.map((offer) => (
                <Link key={offer.id} href={`/offers/${offer.id}`}>
                  <Card className="transition-shadow hover:shadow-md cursor-pointer">
                    <CardHeader className="py-3 px-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <Badge className={`flex-shrink-0 ${OFFER_TYPE_COLORS[offer.offerType]}`}>
                            {OFFER_TYPE_LABELS[offer.offerType]}
                          </Badge>
                          {offer.category && (
                            <Badge variant="outline" className="flex-shrink-0">
                              {CATEGORY_LABELS[offer.category]}
                            </Badge>
                          )}
                          <span className="text-sm font-medium truncate">
                            {offer.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant="secondary">{offer.status}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {timeAgo(offer.createdAt)}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              Vous n&apos;avez pas encore cree d&apos;offre.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
