'use client';

import { useState } from 'react';
import { HandHelping, Lightbulb, Coins, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCreateContribution } from '@/hooks/useCreateContribution';
import {
  ContributionType,
  CONTRIBUTION_TYPE_LABELS,
} from '@/lib/types';
import { toast } from 'sonner';

const CONTRIBUTION_CONFIG: Record<
  ContributionType,
  {
    icon: typeof HandHelping;
    gradient: string;
    hoverGradient: string;
    glow: string;
    emoji: string;
  }
> = {
  [ContributionType.PARTICIPE]: {
    icon: HandHelping,
    gradient: 'linear-gradient(135deg, oklch(0.55 0.16 260), oklch(0.5 0.18 280))',
    hoverGradient: 'linear-gradient(135deg, oklch(0.5 0.18 260), oklch(0.45 0.2 280))',
    glow: '0 4px 20px oklch(0.55 0.16 260 / 30%)',
    emoji: '🤝',
  },
  [ContributionType.PROPOSE]: {
    icon: Lightbulb,
    gradient: 'linear-gradient(135deg, oklch(0.55 0.18 280), oklch(0.5 0.16 320))',
    hoverGradient: 'linear-gradient(135deg, oklch(0.5 0.2 280), oklch(0.45 0.18 320))',
    glow: '0 4px 20px oklch(0.55 0.18 280 / 30%)',
    emoji: '💡',
  },
  [ContributionType.FINANCE]: {
    icon: Coins,
    gradient: 'linear-gradient(135deg, oklch(0.55 0.14 170), oklch(0.5 0.16 150))',
    hoverGradient: 'linear-gradient(135deg, oklch(0.5 0.16 170), oklch(0.45 0.18 150))',
    glow: '0 4px 20px oklch(0.55 0.14 170 / 30%)',
    emoji: '💰',
  },
  [ContributionType.CONSEILLE]: {
    icon: MessageCircle,
    gradient: 'linear-gradient(135deg, oklch(0.6 0.14 80), oklch(0.55 0.16 60))',
    hoverGradient: 'linear-gradient(135deg, oklch(0.55 0.16 80), oklch(0.5 0.18 60))',
    glow: '0 4px 20px oklch(0.6 0.14 80 / 30%)',
    emoji: '🧭',
  },
};

interface ContributionButtonsProps {
  missionId: string;
}

export function ContributionButtons({ missionId }: ContributionButtonsProps) {
  const [openType, setOpenType] = useState<ContributionType | null>(null);
  const [message, setMessage] = useState('');
  const [hoveredType, setHoveredType] = useState<ContributionType | null>(null);
  const mutation = useCreateContribution();

  const handleSubmit = () => {
    if (!openType) return;
    mutation.mutate(
      { type: openType, missionId, message: message || undefined },
      {
        onSuccess: () => {
          toast.success('Contribution ajoutée !');
          setOpenType(null);
          setMessage('');
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {Object.values(ContributionType).map((type) => {
          const config = CONTRIBUTION_CONFIG[type];
          const Icon = config.icon;
          const isHovered = hoveredType === type;
          return (
            <button
              key={type}
              onClick={() => setOpenType(type)}
              onMouseEnter={() => setHoveredType(type)}
              onMouseLeave={() => setHoveredType(null)}
              className="group relative overflow-hidden rounded-xl px-4 py-3.5 text-white font-semibold text-sm transition-all duration-300 ease-out cursor-pointer"
              style={{
                background: isHovered ? config.hoverGradient : config.gradient,
                boxShadow: isHovered ? config.glow : '0 2px 8px oklch(0.5 0.1 280 / 10%)',
                transform: isHovered ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
              }}
            >
              {/* Shimmer overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
                  backgroundSize: '200% 100%',
                  animation: isHovered ? 'shimmer-slide 1.5s ease-in-out infinite' : 'none',
                }}
              />
              <div className="relative flex items-center justify-center gap-2">
                <span className="text-lg">{config.emoji}</span>
                <Icon className="h-4 w-4 opacity-80" />
                <span>{CONTRIBUTION_TYPE_LABELS[type]}</span>
              </div>
            </button>
          );
        })}
      </div>

      <Dialog open={!!openType} onOpenChange={(open) => !open && setOpenType(null)}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              {openType && `${CONTRIBUTION_CONFIG[openType].emoji} ${CONTRIBUTION_TYPE_LABELS[openType]}`}
            </DialogTitle>
            <DialogDescription>
              Ajoutez un message optionnel pour accompagner votre contribution.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="contribution-message">Message (optionnel)</Label>
            <Textarea
              id="contribution-message"
              placeholder="Votre message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="backdrop-blur-sm bg-card/50"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenType(null)}>
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="gradient-primary text-white border-0"
            >
              {mutation.isPending ? 'Envoi...' : 'Confirmer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
