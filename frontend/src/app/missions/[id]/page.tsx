'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, MapPin, Tag, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MissionProgress } from '@/components/missions/MissionProgress';
import { ContributionButtons } from '@/components/missions/ContributionButtons';
import { CloseMissionDialog } from '@/components/missions/CloseMissionDialog';
import { EditMissionDialog } from '@/components/missions/EditMissionDialog';
import { useMission } from '@/hooks/useMission';
import { useContributions } from '@/hooks/useContributions';
import { useAuth } from '@/hooks/useAuth';
import { missionsApi } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  CATEGORY_LABELS,
  URGENCY_LABELS,
  HELP_TYPE_LABELS,
  CONTRIBUTION_TYPE_LABELS,
  MissionStatus,
  type Urgency,
} from '@/lib/types';

const URGENCY_COLORS: Record<Urgency, string> = {
  faible: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
  moyen: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  urgent: 'bg-red-100 text-red-800 hover:bg-red-100',
};

function daysUntil(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr);
  const diffMs = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

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

export default function MissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: mission, isLoading } = useMission(id);
  const { data: contributions } = useContributions(id);

  const deleteMission = useMutation({
    mutationFn: () => missionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
      toast.success('Mission supprimee !');
      router.push('/missions');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erreur');
    },
  });

  const handleDelete = () => {
    if (window.confirm('Supprimer cette mission ? Cette action est irreversible.')) {
      deleteMission.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8 text-center text-muted-foreground">
        Chargement...
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8 text-center text-muted-foreground">
        Mission introuvable.
      </div>
    );
  }

  const isCreator = user?.id === mission.creatorId;
  const isOpen = mission.status === MissionStatus.OUVERTE || mission.status === MissionStatus.EN_COURS;
  const daysLeft = daysUntil(mission.expiresAt);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
      {/* Header badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline">{CATEGORY_LABELS[mission.category]}</Badge>
        <Badge className={URGENCY_COLORS[mission.urgency]}>
          {URGENCY_LABELS[mission.urgency]}
        </Badge>
        <Badge variant="outline">{HELP_TYPE_LABELS[mission.helpType]}</Badge>
        {!isOpen && (
          <Badge variant="secondary">
            {mission.status === MissionStatus.RESOLUE ? 'Resolue' : 'Expiree'}
          </Badge>
        )}
      </div>

      {/* Title + creator */}
      <div>
        <h1 className="text-2xl font-bold">{mission.title}</h1>
        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {mission.creator?.displayName?.charAt(0).toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
          <span>{mission.creator?.displayName}</span>
          <span>&middot;</span>
          <span>{timeAgo(mission.createdAt)}</span>
        </div>
      </div>

      {/* Description */}
      <Card>
        <CardContent className="pt-6">
          <p className="whitespace-pre-wrap">{mission.description}</p>
        </CardContent>
      </Card>

      {/* Info row */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        {mission.location && (
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {mission.location}
          </div>
        )}
        {mission.tags && mission.tags.length > 0 && (
          <div className="flex items-center gap-1">
            <Tag className="h-4 w-4" />
            {mission.tags.join(', ')}
          </div>
        )}
        {isOpen && (
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Expire dans {daysLeft} jour{daysLeft !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Progress */}
      <div>
        <p className="text-sm font-medium mb-2">Progression</p>
        <MissionProgress percent={mission.progressPercent} />
      </div>

      <Separator />

      {/* Contribution section */}
      {isOpen && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Contribuer</h2>
          <ContributionButtons missionId={mission.id} />
        </div>
      )}

      {/* Creator actions */}
      {isCreator && (
        <div className="flex flex-wrap gap-2">
          {isOpen && <CloseMissionDialog missionId={mission.id} />}
          <EditMissionDialog mission={mission} />
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleteMission.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleteMission.isPending ? 'Suppression...' : 'Supprimer'}
          </Button>
        </div>
      )}

      <Separator />

      {/* Contributions list */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Contributions ({contributions?.length ?? 0})
        </h2>
        {contributions && contributions.length > 0 ? (
          <div className="space-y-3">
            {contributions.map((contribution) => (
              <Card key={contribution.id}>
                <CardHeader className="py-3 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {contribution.user?.displayName?.charAt(0).toUpperCase() ?? 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {contribution.user?.displayName}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {CONTRIBUTION_TYPE_LABELS[contribution.type]}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {timeAgo(contribution.createdAt)}
                    </span>
                  </div>
                </CardHeader>
                {contribution.message && (
                  <CardContent className="pt-0 px-4 pb-3">
                    <p className="text-sm text-muted-foreground">
                      {contribution.message}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Aucune contribution pour le moment. Soyez le premier !
          </p>
        )}
      </div>
    </div>
  );
}
