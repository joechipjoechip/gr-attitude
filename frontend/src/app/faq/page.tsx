'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FadeIn } from '@/components/ui/motion';

const FAQ_SECTIONS = [
  {
    title: 'Général',
    icon: '💡',
    color: 'text-amber-500',
    bg: 'bg-amber-50 border-amber-100',
    items: [
      {
        question: "Qu'est-ce que GR attitude ?",
        answer:
          "GR attitude est une plateforme d'entraide structurée qui transforme les besoins en tickets d'action. Elle permet de publier des demandes d'aide (Missions) et des propositions d'aide (Offres), et de les mettre en relation intelligemment.",
      },
      {
        question: 'Comment ça marche ?',
        answer:
          "Créez une Mission pour exprimer un besoin (aide financière, conseil, matériel, mise en relation). D'autres membres peuvent contribuer en participant, proposant, finançant ou conseillant. Les Offres sont automatiquement corrélées aux Missions correspondantes selon les tags, la géographie et le type d'aide.",
      },
      {
        question: "C'est gratuit ?",
        answer:
          "Oui, GR attitude est entièrement gratuit. La plateforme est construite sur des principes d'entraide mutuelle, sans monétisation des relations humaines.",
      },
    ],
  },
  {
    title: 'Missions & Offres',
    icon: '🎯',
    color: 'text-coral-500',
    bg: 'bg-red-50 border-red-100',
    items: [
      {
        question: 'Comment créer une mission ?',
        answer:
          "Connectez-vous, puis cliquez sur \"Nouvelle mission\" depuis la page Missions. Renseignez le titre, la description, la catégorie, le type d'aide souhaité, l'urgence et optionnellement la localisation et des tags. La mission sera visible par la communauté dès sa publication.",
      },
      {
        question: "Qu'est-ce qu'une offre ?",
        answer:
          "Une offre est une proposition d'aide que vous publiez proactivement. Elle décrit ce que vous pouvez apporter (don, compétence, matériel, service, écoute) et est automatiquement corrélée aux missions correspondantes pour faciliter la mise en relation.",
      },
      {
        question: 'Comment clôturer une mission ?',
        answer:
          "En tant que créateur de la mission, vous pouvez la clôturer depuis la page de détail en cliquant sur \"Clôturer la mission\". Vous pouvez indiquer si elle a été résolue ou non, et laisser un message de remerciement aux contributeurs.",
      },
    ],
  },
  {
    title: 'IA & Matching',
    icon: '🔮',
    color: 'text-violet-500',
    bg: 'bg-violet-50 border-violet-100',
    items: [
      {
        question: 'Comment fonctionne le matching ?',
        answer:
          "L'algorithme de corrélation analyse les tags, la géographie, le type d'aide et la récence pour associer automatiquement les Offres aux Missions pertinentes. Un score de pertinence est calculé pour chaque correspondance et visible sur les pages de détail.",
      },
      {
        question: "Quelles données l'IA utilise-t-elle ?",
        answer:
          "Le système de matching utilise uniquement les données que vous avez publiées : tags, localisation, catégorie et type d'aide. Aucune donnée personnelle privée n'est utilisée dans l'algorithme de corrélation.",
      },
      {
        question: 'Mes données sont-elles en sécurité ?',
        answer:
          "Oui. GR attitude respecte le RGPD. Vous pouvez supprimer votre compte à tout moment depuis votre profil. Seules les informations que vous choisissez de rendre publiques sont visibles par les autres membres.",
      },
    ],
  },
  {
    title: 'Compte & Sécurité',
    icon: '🔐',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 border-emerald-100',
    items: [
      {
        question: 'Comment créer un compte ?',
        answer:
          "Cliquez sur \"Inscription\" en haut à droite. Vous pouvez vous inscrire avec une adresse email et un mot de passe, ou via votre compte Google ou Facebook pour une connexion rapide.",
      },
      {
        question: 'Comment supprimer mon compte ?',
        answer:
          "Rendez-vous sur votre page Profil et faites défiler jusqu'en bas. Un bouton \"Supprimer mon compte\" vous permettra d'effacer définitivement toutes vos données conformément au RGPD.",
      },
      {
        question: 'Mot de passe oublié ?',
        answer:
          'Sur la page de connexion, cliquez sur "Mot de passe oublié" et entrez votre adresse email. Vous recevrez un lien de réinitialisation. Si vous utilisez une connexion sociale (Google/Facebook), connectez-vous directement via ce fournisseur.',
      },
    ],
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b last:border-b-0">
      <button
        type="button"
        className="flex w-full items-center justify-between py-4 text-left font-medium hover:text-primary transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <span>{question}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-muted-foreground leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 space-y-10">
      <FadeIn>
        <h1 className="text-3xl font-bold font-display gradient-text-primary">Foire Aux Questions</h1>
        <p className="mt-2 text-muted-foreground">
          Tout ce que vous devez savoir sur GR attitude.
        </p>
      </FadeIn>

      {FAQ_SECTIONS.map((section, i) => (
        <FadeIn key={section.title} delay={i * 0.1}>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-2xl ${section.color}`}>{section.icon}</span>
              <h2 className="text-lg font-semibold">{section.title}</h2>
            </div>
            <div className={`border rounded-lg px-4 ${section.bg}`}>
              {section.items.map((item, index) => (
                <FaqItem key={index} question={item.question} answer={item.answer} />
              ))}
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
