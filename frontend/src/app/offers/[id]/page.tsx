'use client';

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
      toast.success('Offre cloturee !');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur');
    }
  };

  const deleteOffer = useMutation({
    mutationFn: () => offersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      toast.success('Offre supprimee !');
      router.push('/offers');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erreur');
    },
  });

  const handleDelete = () => {
    if (window.confirm("Supprimer cette offre ? Cette action est irreversible.")) {
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

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
      {/* Header badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge className={OFFER_TYPE_COLORS[offer.offerType]}>
          {OFFER_TYPE_LABELS[offer.offerType]}
        </Badge>
        {offer.category && (
          <Badge variant="outline">{CATEGORY_LABELS[offer.category]}</Badge>
        )}
        {!isOpen && (
          <Badge variant="secondary">
            {offer.status === OfferStatus.CLOTUREE ? 'Cloturee' : 'Expiree'}
          </Badge>
        )}
      </div>

      {/* Title + creator */}
      <div>
        <h1 className="text-2xl font-bold">{offer.title}</h1>
        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {offer.creator?.displayName?.charAt(0).toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
          <span>{offer.creator?.displayName}</span>
          <span>&middot;</span>
          <span>{timeAgo(offer.createdAt)}</span>
        </div>
      </div>

      {/* Description */}
      <Card>
        <CardContent className="pt-6">
          <p className="whitespace-pre-wrap">{offer.description}</p>
        </CardContent>
      </Card>

      {/* Availability */}
      {offer.availability && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Disponibilite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{offer.availability}</p>
          </CardContent>
        </Card>
      )}

      {/* Info row */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        {offer.location && (
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {offer.location}
          </div>
        )}
        {offer.tags && offer.tags.length > 0 && (
          <div className="flex items-center gap-1">
            <Tag className="h-4 w-4" />
            {offer.tags.join(', ')}
          </div>
        )}
      </div>

      {/* Creator actions */}
      {isCreator && (
        <div className="flex flex-wrap gap-2">
          {isOpen && (
            <Button variant="outline" onClick={handleClose}>
              Cloturer cette offre
            </Button>
          )}
          <EditOfferDialog offer={offer} />
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleteOffer.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleteOffer.isPending ? 'Suppression...' : 'Supprimer'}
          </Button>
        </div>
      )}

      <Separator />

      {/* Correlated missions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Missions correlees ({correlations?.length ?? 0})
        </h2>
        {correlations && correlations.length > 0 ? (
          <div className="space-y-3">
            {correlations.map((correlation) => (
              <Link
                key={correlation.id}
                href={`/missions/${correlation.missionId}`}
              >
                <Card className="transition-shadow hover:shadow-md cursor-pointer">
                  <CardHeader className="py-3 px-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">
                        {correlation.mission?.title}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        Score: {Math.round(correlation.score * 100)}%
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Aucune mission correlee pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}
