'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, MapPin, Tag, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { CategoryIcon, CATEGORY_COLORS } from '@/components/icons/CategoryIcon';

const URGENCY_STYLES: Record<Urgency, string> = {
  faible: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  moyen: 'bg-amber-50 text-amber-700 border border-amber-200',
  urgent: 'bg-red-50 text-red-700 border border-red-200',
};

const URGENCY_DOT: Record<Urgency, string> = {
  faible: 'bg-emerald-500',
  moyen: 'bg-amber-500',
  urgent: 'bg-red-500',
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
  const categoryColor = CATEGORY_COLORS[mission.category];
  const creatorInitial = mission.creator?.displayName?.charAt(0).toUpperCase() ?? 'U';

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
      {/* Gradient header card */}
      <FadeIn>
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${categoryColor}1a 0%, ${categoryColor}0a 100%)`,
            border: `1px solid ${categoryColor}33`,
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="rounded-xl p-3 flex-shrink-0"
              style={{ background: `${categoryColor}22` }}
            >
              <CategoryIcon category={mission.category} size={36} />
            </div>
            <div className="flex-1 min-w-0">
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: `${categoryColor}22`, color: categoryColor }}
                >
                  {CATEGORY_LABELS[mission.category]}
                </span>
                <Badge className={`${URGENCY_STYLES[mission.urgency]} text-xs font-semibold`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${URGENCY_DOT[mission.urgency]}`} />
                  {URGENCY_LABELS[mission.urgency]}
                </Badge>
                <Badge variant="outline" className="text-xs font-medium">
                  {HELP_TYPE_LABELS[mission.helpType]}
                </Badge>
                {!isOpen && (
                  <Badge variant="secondary" className="text-xs font-medium">
                    {mission.status === MissionStatus.RESOLUE ? 'Resolue' : 'Expiree'}
                  </Badge>
                )}
              </div>
              {/* Title */}
              <h1 className="text-2xl font-bold leading-tight mb-3 font-display">
                {mission.title}
              </h1>
              <p className="text-sm font-elegant text-muted-foreground/70 -mt-1 mb-2">
                {mission.contributionsCount > 0
                  ? `${mission.contributionsCount} personne${mission.contributionsCount > 1 ? 's' : ''} solidaire${mission.contributionsCount > 1 ? 's' : ''}`
                  : 'En attente de solidarité…'}
              </p>
              {/* Creator */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Avatar
                  className="h-6 w-6 border-2"
                  style={{ borderColor: `${categoryColor}66` }}
                >
                  <AvatarFallback
                    className="text-xs font-semibold"
                    style={{ background: `${categoryColor}22`, color: categoryColor }}
                  >
                    {creatorInitial}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground">{mission.creator?.displayName}</span>
                <span>&middot;</span>
                <span>{timeAgo(mission.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Description */}
      <FadeIn delay={0.1}>
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
              {mission.description}
            </p>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Info row */}
      <FadeIn delay={0.15}>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground px-1">
          {mission.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" style={{ color: categoryColor }} />
              {mission.location}
            </div>
          )}
          {mission.tags && mission.tags.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Tag className="h-4 w-4" style={{ color: categoryColor }} />
              {mission.tags.join(', ')}
            </div>
          )}
          {isOpen && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" style={{ color: categoryColor }} />
              Expire dans {daysLeft} jour{daysLeft !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </FadeIn>

      <Separator />

      {/* Contribution section */}
      {isOpen && (
        <FadeIn delay={0.25}>
          <div>
            <h2 className="text-lg font-semibold mb-4">Contribuer</h2>
            <ContributionButtons missionId={mission.id} />
          </div>
        </FadeIn>
      )}

      {/* Creator actions */}
      {isCreator && (
        <FadeIn delay={0.3}>
          <div className="flex flex-wrap gap-2">
            {isOpen && <CloseMissionDialog missionId={mission.id} />}
            <EditMissionDialog mission={mission} />
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={deleteMission.isPending}
              className="border-destructive/30 text-destructive hover:bg-destructive hover:text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleteMission.isPending ? 'Suppression...' : 'Supprimer'}
            </Button>
          </div>
        </FadeIn>
      )}

      <Separator />

      {/* Contributions list */}
      <FadeIn delay={0.35}>
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Contributions ({contributions?.length ?? 0})
          </h2>
          {contributions && contributions.length > 0 ? (
            <StaggerContainer className="space-y-3">
              {contributions.map((contribution) => (
                <StaggerItem key={contribution.id}>
                  <Card className="shadow-sm border-border/60">
                    <CardHeader className="py-3 px-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
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
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <p className="text-sm text-muted-foreground">
              Aucune contribution pour le moment. Soyez le premier !
            </p>
          )}
        </div>
      </FadeIn>
    </div>
  );
}
