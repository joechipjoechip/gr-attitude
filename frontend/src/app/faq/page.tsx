'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ_SECTIONS = [
  {
    title: 'General',
    items: [
      {
        question: "Qu'est-ce que GR attitude ?",
        answer:
          "GR attitude est une plateforme d'entraide structuree qui transforme les besoins en tickets d'action. Elle permet de publier des demandes d'aide (Missions) et des propositions d'aide (Offres), et de les mettre en relation intelligemment.",
      },
      {
        question: 'Comment ca marche ?',
        answer:
          "Creez une Mission pour exprimer un besoin (aide financiere, conseil, materiel, mise en relation). D'autres membres peuvent contribuer en participant, proposant, finançant ou conseillant. Les Offres sont automatiquement correlees aux Missions correspondantes selon les tags, la geographie et le type d'aide.",
      },
      {
        question: "C'est gratuit ?",
        answer:
          "Oui, GR attitude est entierement gratuit. La plateforme est construite sur des principes d'entraide mutuelle, sans monetisation des relations humaines.",
      },
    ],
  },
  {
    title: 'Missions & Offres',
    items: [
      {
        question: 'Comment creer une mission ?',
        answer:
          "Connectez-vous, puis cliquez sur \"Nouvelle mission\" depuis la page Missions. Renseignez le titre, la description, la categorie, le type d'aide souhaite, l'urgence et optionnellement la localisation et des tags. La mission sera visible par la communaute des sa publication.",
      },
      {
        question: "Qu'est-ce qu'une offre ?",
        answer:
          "Une offre est une proposition d'aide que vous publiez proactivement. Elle decrit ce que vous pouvez apporter (don, competence, materiel, service, ecoute) et est automatiquement correlee aux missions correspondantes pour faciliter la mise en relation.",
      },
      {
        question: 'Comment cloturer une mission ?',
        answer:
          "En tant que createur de la mission, vous pouvez la cloturer depuis la page de detail en cliquant sur \"Cloturer la mission\". Vous pouvez indiquer si elle a ete resolue ou non, et laisser un message de remerciement aux contributeurs.",
      },
    ],
  },
  {
    title: 'IA & Matching',
    items: [
      {
        question: 'Comment fonctionne le matching ?',
        answer:
          "L'algorithme de correlation analyse les tags, la geographie, le type d'aide et la recence pour associer automatiquement les Offres aux Missions pertinentes. Un score de pertinence est calcule pour chaque correspondance et visible sur les pages de detail.",
      },
      {
        question: "Quelles donnees l'IA utilise-t-elle ?",
        answer:
          "Le systeme de matching utilise uniquement les donnees que vous avez publiees : tags, localisation, categorie et type d'aide. Aucune donnee personnelle privee n'est utilisee dans l'algorithme de correlation.",
      },
      {
        question: 'Mes donnees sont-elles en securite ?',
        answer:
          "Oui. GR attitude respecte le RGPD. Vous pouvez supprimer votre compte a tout moment depuis votre profil. Seules les informations que vous choisissez de rendre publiques sont visibles par les autres membres.",
      },
    ],
  },
  {
    title: 'Compte & Securite',
    items: [
      {
        question: 'Comment creer un compte ?',
        answer:
          "Cliquez sur \"Inscription\" en haut a droite. Vous pouvez vous inscrire avec une adresse email et un mot de passe, ou via votre compte Google ou Facebook pour une connexion rapide.",
      },
      {
        question: 'Comment supprimer mon compte ?',
        answer:
          "Rendez-vous sur votre page Profil et faites defiler jusqu'en bas. Un bouton \"Supprimer mon compte\" vous permettra d'effacer definitivement toutes vos donnees conformement au RGPD.",
      },
      {
        question: 'Mot de passe oublie ?',
        answer:
          'Sur la page de connexion, cliquez sur "Mot de passe oublie" et entrez votre adresse email. Vous recevrez un lien de reinitialisation. Si vous utilisez une connexion sociale (Google/Facebook), connectez-vous directement via ce fournisseur.',
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 space-y-10">
      <div>
        <h1 className="text-3xl font-bold">Foire Aux Questions</h1>
        <p className="mt-2 text-muted-foreground">
          Tout ce que vous devez savoir sur GR attitude.
        </p>
      </div>

      {FAQ_SECTIONS.map((section) => (
        <div key={section.title}>
          <h2 className="text-lg font-semibold mb-3">{section.title}</h2>
          <Accordion type="single" collapsible className="border rounded-lg px-4">
            {section.items.map((item, index) => (
              <AccordionItem key={index} value={`${section.title}-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
}
