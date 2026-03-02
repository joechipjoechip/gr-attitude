'use client';
import { t } from '@/i18n';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Tag, Calendar, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useOffer } from '@/hooks/useOffer';
import { useAuth } from '@/hooks/useAuth';
import { offersApi } from '@/lib/api';
import { EditOfferDialog } from '@/components/offers/EditOfferDialog';
import {
  OFFER_TYPE_LABELS,
  CATEGORY_LABELS,
  type OfferType,
  OfferStatus,
} from '@/lib/types';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { CategoryIcon, CATEGORY_COLORS } from '@/components/icons/CategoryIcon';

const OFFER_TYPE_HEX: Record<OfferType, string> = {
  don: '#3b82f6',
  competence: '#8b5cf6',
  materiel: '#f97316',
  service: '#10b981',
  ecoute: '#ec4899',
};

const OFFER_TYPE_LABEL_STYLE: Record<OfferType, string> = {
  don: 'bg-blue-50 text-blue-700 border border-blue-200',
  competence: 'bg-purple-50 text-purple-700 border border-purple-200',
  materiel: 'bg-orange-50 text-orange-700 border border-orange-200',
  service: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  ecoute: 'bg-pink-50 text-pink-700 border border-pink-200',
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

export default function OfferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: offer, isLoading } = useOffer(id);
  const { data: correlations } = useQuery({
    queryKey: ['offer-correlations', id],
    queryFn: () => offersApi.getCorrelations(id),
    enabled: !!id,
  });

  const handleClose = async () => {
    try {
      await offersApi.close(id);
      toast.success(t('propositions.confirmClose'));
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur');
    }
  };

  const deleteOffer = useMutation({
    mutationFn: () => offersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      toast.success(t('propositions.deleted'));
      router.push('/offers');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erreur');
    },
  });

  const handleDelete = () => {
    if (window.confirm(t('propositions.confirmDelete'))) {
      deleteOffer.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8 text-center text-muted-foreground">
        Chargement...
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8 text-center text-muted-foreground">
        Offre introuvable.
      </div>
    );
  }

  const isCreator = user?.id === offer.creatorId;
  const isOpen = offer.status === OfferStatus.OUVERTE || offer.status === OfferStatus.EN_COURS;
  const typeColor = OFFER_TYPE_HEX[offer.offerType];
  const categoryColor = offer.category ? CATEGORY_COLORS[offer.category] : typeColor;
  const headerColor = categoryColor ?? typeColor;
  const creatorInitial = offer.creator?.displayName?.charAt(0).toUpperCase() ?? 'U';

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
      {/* Gradient header card */}
      <FadeIn>
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${headerColor}1a 0%, ${headerColor}0a 100%)`,
            border: `1px solid ${headerColor}33`,
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="rounded-xl p-3 flex-shrink-0"
              style={{ background: `${typeColor}22` }}
            >
              {offer.category ? (
                <CategoryIcon category={offer.category} size={36} />
              ) : (
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ color: typeColor }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="currentColor" opacity="0.3"/>
                    <path d="M20.5 6l-9-4-9 4v2h2v10h14V8h2V6zm-4 10H7.5V8h9v8z" fill="currentColor"/>
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <Badge className={`${OFFER_TYPE_LABEL_STYLE[offer.offerType]} text-xs font-semibold`}>
                  {OFFER_TYPE_LABELS[offer.offerType]}
                </Badge>
                {offer.category && (
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: `${categoryColor}22`, color: categoryColor }}
                  >
                    {CATEGORY_LABELS[offer.category]}
                  </span>
                )}
                {!isOpen && (
                  <Badge variant="secondary" className="text-xs font-medium">
                    {offer.status === OfferStatus.CLOTUREE ? 'Cloturee' : 'Expiree'}
                  </Badge>
                )}
              </div>
              {/* Title */}
              <h1 className="text-2xl font-bold leading-tight mb-3 font-display">
                {offer.title}
              </h1>
              {/* Creator */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Avatar
                  className="h-6 w-6 border-2"
                  style={{ borderColor: `${typeColor}66` }}
                >
                  <AvatarFallback
                    className="text-xs font-semibold"
                    style={{ background: `${typeColor}22`, color: typeColor }}
                  >
                    {creatorInitial}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground">{offer.creator?.displayName}</span>
                <span>&middot;</span>
                <span>{timeAgo(offer.createdAt)}</span>
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
              {offer.description}
            </p>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Availability */}
      {offer.availability && (
        <FadeIn delay={0.15}>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" style={{ color: typeColor }} />
                Disponibilite
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{offer.availability}</p>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* Info row */}
      <FadeIn delay={0.2}>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground px-1">
          {offer.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" style={{ color: typeColor }} />
              {offer.location}
            </div>
          )}
          {offer.tags && offer.tags.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Tag className="h-4 w-4" style={{ color: typeColor }} />
              {offer.tags.join(', ')}
            </div>
          )}
        </div>
      </FadeIn>

      {/* Creator actions */}
      {isCreator && (
        <FadeIn delay={0.25}>
          <div className="flex flex-wrap gap-2">
            {isOpen && (
              <Button variant="outline" onClick={handleClose}>
                {t('besoins.close.title')}
              </Button>
            )}
            <EditOfferDialog offer={offer} />
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={deleteOffer.isPending}
              className="border-destructive/30 text-destructive hover:bg-destructive hover:text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleteOffer.isPending ? t('common.deleting') : t('common.delete')}
            </Button>
          </div>
        </FadeIn>
      )}

      <Separator />

      {/* Correlated missions */}
      <FadeIn delay={0.3}>
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Missions correlees ({correlations?.length ?? 0})
          </h2>
          {correlations && correlations.length > 0 ? (
            <StaggerContainer className="space-y-3">
              {correlations.map((correlation) => (
                <StaggerItem key={correlation.id}>
                  <Link href={`/missions/${correlation.missionId}`}>
                    <Card className="transition-all hover:shadow-md cursor-pointer border-border/60 hover:border-primary/30">
                      <CardHeader className="py-3 px-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">
                            {correlation.mission?.title}
                          </CardTitle>
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: `${typeColor}15`, color: typeColor }}
                          >
                            {Math.round(correlation.score * 100)}%
                          </span>
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <p className="text-sm text-muted-foreground">
              Aucune mission correlee pour le moment.
            </p>
          )}
        </div>
      </FadeIn>
    </div>
  );
}
